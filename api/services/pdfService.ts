import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

export class PDFService {
  private static instance: PDFService;
  private browser: any = null;

  private constructor() {}

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  private async getBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
    }
    return this.browser;
  }

  public async generatePDF(resumeContent: string, resumeId: string): Promise<string> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      // 设置页面大小为A4
      await page.setViewport({ width: 794, height: 1123 });

      // 创建HTML模板
      const htmlTemplate = this.createHTMLTemplate(resumeContent);

      // 设置页面内容
      await page.setContent(htmlTemplate, {
        waitUntil: 'networkidle0'
      });

      // 生成PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      // 确保输出目录存在
      const outputDir = path.join(process.cwd(), 'temp', 'pdfs');
      await fs.mkdir(outputDir, { recursive: true });

      // 保存PDF文件
      const fileName = `resume_${resumeId}_${Date.now()}.pdf`;
      const filePath = path.join(outputDir, fileName);
      await fs.writeFile(filePath, pdfBuffer);

      return filePath;
    } finally {
      await page.close();
    }
  }

  private createHTMLTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>简历</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            font-size: 14px;
        }
        
        .resume-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        h1 {
            font-size: 24px;
            color: #2563eb;
            margin-bottom: 10px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 5px;
        }
        
        h2 {
            font-size: 18px;
            color: #1e40af;
            margin: 20px 0 10px 0;
            border-left: 4px solid #2563eb;
            padding-left: 10px;
        }
        
        h3 {
            font-size: 16px;
            color: #374151;
            margin: 15px 0 8px 0;
        }
        
        p {
            margin-bottom: 8px;
            text-align: justify;
        }
        
        ul, ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        li {
            margin-bottom: 5px;
        }
        
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 20px;
            padding: 10px;
            background: #f8fafc;
            border-radius: 5px;
        }
        
        .contact-item {
            font-size: 13px;
            color: #4b5563;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .experience-item {
            margin-bottom: 15px;
            padding: 10px;
            border-left: 3px solid #e5e7eb;
        }
        
        .company-name {
            font-weight: bold;
            color: #1f2937;
        }
        
        .position-title {
            color: #2563eb;
            font-weight: 600;
        }
        
        .date-range {
            color: #6b7280;
            font-size: 12px;
            float: right;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        
        .skill-category {
            background: #f1f5f9;
            padding: 8px;
            border-radius: 4px;
        }
        
        .skill-category strong {
            color: #1e40af;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .resume-container {
                box-shadow: none;
                margin: 0;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        ${this.formatContent(content)}
    </div>
</body>
</html>
    `;
  }

  private formatContent(content: string): string {
    // 简单的内容格式化，将纯文本转换为HTML
    let formattedContent = content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.+)$/gm, '<p>$1</p>');

    // 识别并格式化标题
    formattedContent = formattedContent
      .replace(/<p>([^<]+?)：<\/p>/g, '<h2>$1</h2>')
      .replace(/<p>([^<]+?):<\/p>/g, '<h2>$1</h2>')
      .replace(/<p>(姓名|联系方式|邮箱|电话|地址)([：:])([^<]+)<\/p>/g, '<div class="contact-item"><strong>$1</strong>$2 $3</div>');

    // 识别并格式化列表项
    formattedContent = formattedContent
      .replace(/<p>[-•]\s*([^<]+)<\/p>/g, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

    // 清理多余的p标签
    formattedContent = formattedContent
      .replace(/<p><\/p>/g, '')
      .replace(/<p>\s*<\/p>/g, '');

    return formattedContent;
  }

  public async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export default PDFService.getInstance();