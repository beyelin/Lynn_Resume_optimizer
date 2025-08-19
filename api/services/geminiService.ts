import { GoogleGenerativeAI } from '@google/generative-ai';

interface ResumeOptimizationResult {
  optimizedResume: string;
  matchScore: number;
  suggestions: string[];
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY 环境变量未设置');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async optimizeResume(
    originalResume: string,
    jobDescription: string
  ): Promise<ResumeOptimizationResult> {
    try {
      const prompt = this.createOptimizationPrompt(originalResume, jobDescription);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseOptimizationResult(text);
    } catch (error) {
      console.error('Gemini API 调用失败:', error);
      throw new Error('简历优化失败，请稍后重试');
    }
  }

  private createOptimizationPrompt(resume: string, jobDescription: string): string {
    return `
作为一名专业的简历优化专家，请根据以下职位描述优化简历内容。

职位描述：
${jobDescription}

原始简历：
${resume}

请按照以下要求进行优化：

1. 分析职位要求与简历的匹配度
2. 优化简历内容，突出与职位相关的技能和经验
3. 调整关键词以提高ATS系统通过率
4. 保持简历的真实性，不添加虚假信息
5. 优化语言表达，使其更加专业和有说服力

请按照以下JSON格式返回结果：
{
  "optimizedResume": "优化后的完整简历内容",
  "matchScore": 85,
  "suggestions": [
    "建议1：突出相关技术技能",
    "建议2：量化工作成果",
    "建议3：调整关键词匹配"
  ]
}

注意：
- matchScore 应该是0-100之间的整数，表示优化后简历与职位的匹配度
- suggestions 应该包含3-5条具体的优化建议
- optimizedResume 应该是完整的、格式良好的简历内容
- 请确保返回的是有效的JSON格式
    `;
  }

  private parseOptimizationResult(text: string): ResumeOptimizationResult {
    try {
      // 尝试提取JSON内容
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法解析AI响应');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // 验证必要字段
      if (!parsed.optimizedResume || typeof parsed.matchScore !== 'number') {
        throw new Error('AI响应格式不正确');
      }

      return {
        optimizedResume: parsed.optimizedResume,
        matchScore: Math.min(100, Math.max(0, parsed.matchScore)), // 确保分数在0-100之间
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
      };
    } catch (error) {
      console.error('解析AI响应失败:', error);
      
      // 如果解析失败，返回基本的优化结果
      return {
        optimizedResume: this.createFallbackOptimization(text),
        matchScore: 75, // 默认匹配度
        suggestions: [
          '建议突出与职位相关的技能和经验',
          '建议量化工作成果和项目影响',
          '建议调整关键词以提高匹配度'
        ]
      };
    }
  }

  private createFallbackOptimization(text: string): string {
    // 如果AI响应无法解析为JSON，尝试提取有用的内容
    const lines = text.split('\n').filter(line => line.trim());
    
    // 查找看起来像简历内容的部分
    const resumeStart = lines.findIndex(line => 
      line.includes('姓名') || 
      line.includes('联系方式') || 
      line.includes('个人信息') ||
      line.includes('工作经验') ||
      line.includes('教育背景')
    );
    
    if (resumeStart >= 0) {
      return lines.slice(resumeStart).join('\n');
    }
    
    // 如果找不到明显的简历内容，返回整个响应
    return text;
  }

  async calculateMatchScore(
    resume: string,
    jobDescription: string
  ): Promise<number> {
    try {
      const prompt = `
请分析以下简历与职位描述的匹配度，并给出0-100的分数。

职位描述：
${jobDescription}

简历：
${resume}

请只返回一个0-100之间的数字，表示匹配度分数。
      `;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // 提取数字
      const scoreMatch = text.match(/\d+/);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[0]);
        return Math.min(100, Math.max(0, score));
      }
      
      return 75; // 默认分数
    } catch (error) {
      console.error('计算匹配度失败:', error);
      return 75; // 默认分数
    }
  }
}

let geminiServiceInstance: GeminiService | null = null;

export default {
  getInstance(): GeminiService {
    if (!geminiServiceInstance) {
      geminiServiceInstance = new GeminiService();
    }
    return geminiServiceInstance;
  }
};