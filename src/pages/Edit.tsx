import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Save,
  Download,
  ArrowLeft,
  Type,
  Palette,
  Eye,
  EyeOff,
  Edit3,
  FileText,
  Settings,
  Plus,
  Briefcase,
  GraduationCap,
  Star
} from 'lucide-react';

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id]);

  const loadResume = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/resume/${resumeId}`);
      const data = await response.json();
      if (data.success) {
        setContent(data.data.content);
      }
    } catch (error) {
      console.error('加载简历失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/resume/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      const data = await response.json();
      if (data.success) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!id) return;
    
    try {
      const response = await fetch(`/api/resume/${id}/export`, {
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

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const insertText = (text: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const applyFontSize = (size: number) => {
    setFontSize(size);
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${size}px`;
    }
  };

  const applyFontFamily = (family: string) => {
    setFontFamily(family);
    if (editorRef.current) {
      editorRef.current.style.fontFamily = family;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载简历中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">简历编辑器</h1>
                    <p className="text-xs text-gray-500 hidden sm:block">专业简历编辑与格式化工具</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {lastSaved ? `最后保存: ${lastSaved.toLocaleTimeString()}` : '未保存'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                  isPreviewMode 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isPreviewMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isPreviewMode ? '编辑' : '预览'}</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">{isSaving ? '保存中...' : '保存'}</span>
              </button>
              
              <button
                onClick={handleExport}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">导出</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      {!isPreviewMode && (
        <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-3 overflow-x-auto">
              {/* 字体设置 */}
              <div className="flex items-center space-x-3 border-r border-gray-200 pr-4">
                <div className="flex items-center space-x-2">
                  <Type className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">字体</span>
                </div>
                <select
                  value={fontFamily}
                  onChange={(e) => applyFontFamily(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="Arial">Arial</option>
                  <option value="Microsoft YaHei">微软雅黑</option>
                  <option value="SimSun">宋体</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => applyFontSize(parseInt(e.target.value))}
                  min="10"
                  max="24"
                  className="w-16 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
                <button
                  onClick={() => formatText('bold')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="粗体"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('italic')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="斜体"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('underline')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="下划线"
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
                <button
                  onClick={() => formatText('justifyLeft')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="左对齐"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('justifyCenter')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="居中对齐"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('justifyRight')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="右对齐"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* 列表按钮 */}
              <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
                <button
                  onClick={() => formatText('insertUnorderedList')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="无序列表"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('insertOrderedList')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="有序列表"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>
              
              {/* 快速插入 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => insertText('\n\n【工作经验】\n\n')}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 font-medium border border-blue-200"
                >
                  工作经验
                </button>
                <button
                  onClick={() => insertText('\n\n【教育背景】\n\n')}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-200 font-medium border border-green-200"
                >
                  教育背景
                </button>
                <button
                  onClick={() => insertText('\n\n【技能专长】\n\n')}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all duration-200 font-medium border border-purple-200"
                >
                  技能专长
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-blue-100">
          <div className="p-6 sm:p-8">
            <div className="relative">
              {isPreviewMode ? (
                <div 
                  className="min-h-[600px] prose max-w-none"
                  style={{
                    lineHeight: '1.6',
                    fontSize: `${fontSize}px`,
                    fontFamily: fontFamily
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="min-h-[600px] outline-none prose prose-lg max-w-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl p-6 border border-gray-200 bg-gradient-to-br from-white to-blue-50/30 transition-all duration-200"
                  style={{
                    lineHeight: '1.6',
                    fontSize: `${fontSize}px`,
                    fontFamily: fontFamily
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLDivElement;
                    setContent(target.innerHTML);
                  }}
                  dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
                />
              )}
              
              {/* 字数统计 */}
              <div className="absolute bottom-4 right-4 text-sm text-gray-500 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-blue-600" />
                  <span>字数: {content.replace(/<[^>]*>/g, '').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}