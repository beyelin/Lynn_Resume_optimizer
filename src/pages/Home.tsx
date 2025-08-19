import { useState } from 'react';
import { FileText, Briefcase, Sparkles, Download, Edit, Eye, Lightbulb } from 'lucide-react';

export default function Home() {
  const [masterResume, setMasterResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [matchScore, setMatchScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeId, setResumeId] = useState('');

  const handleGenerate = async () => {
    if (!masterResume.trim() || !jobDescription.trim()) {
      alert('请填写元简历和职位描述');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalResume: masterResume,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOptimizedResume(data.data.optimizedResume);
        setMatchScore(data.data.matchScore);
        setResumeId(data.data.id);
        // 可以在这里处理 suggestions 数据
        console.log('优化建议:', data.data.suggestions);
      } else {
        alert('生成失败，请重试');
      }
    } catch (error) {
      console.error('生成简历时出错:', error);
      alert('生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = () => {
    if (resumeId) {
      window.open(`/edit/${resumeId}`, '_blank');
    }
  };

  const handleExport = async () => {
    if (!resumeId) return;
    
    try {
      const response = await fetch(`/api/resume/${resumeId}/export`, {
        method: 'POST',
      });
      
      const data = await response.json();
      if (data.success) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">智能简历优化助手</h1>
                <p className="text-xs sm:text-sm text-gray-500">AI驱动的专业简历优化平台</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-xs sm:text-sm text-yellow-700 font-medium">AI优化</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 元简历输入区 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">元简历输入</h2>
                <p className="text-sm text-gray-500">输入您的原始简历</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              请输入您的完整简历信息，包括个人信息、教育背景、工作经历、技能等。
            </p>
            <textarea
              value={masterResume}
              onChange={(e) => setMasterResume(e.target.value)}
              placeholder="请输入您的元简历内容...\n\n示例：\n姓名：张三\n联系方式：13800138000\n邮箱：zhangsan@email.com\n\n教育背景：\n2018-2022 北京大学 计算机科学与技术 本科\n\n工作经历：\n2022-至今 某科技公司 前端工程师\n- 负责公司官网和管理系统的前端开发\n- 使用React、TypeScript等技术栈\n- 参与项目架构设计和代码review\n\n技能：\n- 前端：React、Vue、TypeScript、JavaScript\n- 后端：Node.js、Python\n- 数据库：MySQL、MongoDB"
              className="w-full h-56 sm:h-80 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* JD输入区 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">职位描述</h2>
                <p className="text-sm text-gray-500">输入目标职位要求</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              请粘贴目标职位的JD（职位描述），AI将根据此信息优化您的简历。
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="请输入目标职位的JD内容...\n\n示例：\n职位：高级前端工程师\n\n职位要求：\n1. 本科及以上学历，计算机相关专业\n2. 3年以上前端开发经验\n3. 精通React、Vue等前端框架\n4. 熟悉TypeScript、ES6+语法\n5. 有移动端开发经验优先\n6. 良好的代码规范和团队协作能力\n\n工作内容：\n1. 负责公司核心产品的前端开发\n2. 参与产品需求分析和技术方案设计\n3. 优化前端性能，提升用户体验\n4. 指导初级工程师，参与代码review"
              className="w-full h-44 sm:h-80 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200 bg-gray-50/50 focus:bg-white"
            />
            
            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !masterResume.trim() || !jobDescription.trim()}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AI正在优化中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>生成优化简历</span>
                </>
              )}
            </button>
          </div>

          {/* 结果展示区 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">优化结果</h2>
                  <p className="text-sm text-gray-500">AI分析与优化建议</p>
                </div>
              </div>
              {matchScore > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">匹配度:</span>
                  <span className={`text-lg font-bold ${
                    matchScore >= 0.8 ? 'text-green-600' : 
                    matchScore >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round(matchScore * 100)}%
                  </span>
                </div>
              )}
            </div>
            
            {optimizedResume ? (
              <>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 mb-4 max-h-80 overflow-y-auto border border-gray-100">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {optimizedResume}
                  </pre>
                </div>
                
                {/* 操作按钮 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleEdit}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <Edit className="w-4 h-4" />
                    <span>编辑简历</span>
                  </button>
                  <button
                    onClick={handleExport}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    <span>导出PDF</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">等待生成优化简历</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  请在左侧输入元简历和职位描述，然后点击生成按钮
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}