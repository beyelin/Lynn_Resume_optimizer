import express from 'express';
import geminiServiceFactory from '../services/geminiService.js';
import PDFService from '../services/pdfService.js';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

// 生成优化简历
router.post('/generate', async (req, res) => {
  try {
    const { originalResume, jobDescription } = req.body;

    if (!originalResume || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: '请提供原始简历和职位描述'
      });
    }

    // 使用Gemini服务优化简历
    const geminiService = geminiServiceFactory.getInstance();
    const optimizationResult = await geminiService.optimizeResume(
      originalResume,
      jobDescription
    );

    // 生成简历ID
    const resumeId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      data: {
        id: resumeId,
        optimizedResume: optimizationResult.optimizedResume,
        matchScore: optimizationResult.matchScore,
        suggestions: optimizationResult.suggestions,
        originalResume,
        jobDescription,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('生成简历时出错:', error);
    res.status(500).json({
      success: false,
      message: error.message || '生成简历失败，请稍后重试'
    });
  }
});

// 编辑简历
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: '请提供简历内容'
      });
    }

    // 实际项目中应该更新数据库
    // 这里只是模拟返回
    res.json({
      success: true,
      data: {
        id,
        content,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('更新简历时出错:', error);
    res.status(500).json({
      success: false,
      message: '更新简历失败，请重试'
    });
  }
});

// 获取简历
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 实际项目中应该从数据库查询
    // 这里只是模拟返回
    res.json({
      success: true,
      data: {
        id,
        content: '模拟的简历内容...',
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('获取简历时出错:', error);
    res.status(500).json({
      success: false,
      message: '获取简历失败'
    });
  }
});

// 导出PDF
router.post('/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: '请提供简历内容'
      });
    }

    // 生成PDF文件
    const filePath = await PDFService.generatePDF(content, id);
    const downloadUrl = `/api/resume/${id}/download?file=${encodeURIComponent(path.basename(filePath))}`;

    res.json({
      success: true,
      downloadUrl,
      filePath
    });

  } catch (error) {
    console.error('导出PDF时出错:', error);
    res.status(500).json({
      success: false,
      message: '导出PDF失败'
    });
  }
});

// 下载PDF文件
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req.query;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: '缺少文件参数'
      });
    }

    const filePath = path.join(process.cwd(), 'temp', 'pdfs', file as string);
    
    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 设置响应头
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume_${id}.pdf"`);
    
    // 读取并发送文件
    const fileBuffer = await fs.readFile(filePath);
    res.send(fileBuffer);

    // 可选：删除临时文件（延迟删除）
    setTimeout(async () => {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('删除临时文件失败:', error);
      }
    }, 60000); // 1分钟后删除

  } catch (error) {
    console.error('下载PDF时出错:', error);
    res.status(500).json({
      success: false,
      message: '下载PDF失败'
    });
  }
});

export default router;