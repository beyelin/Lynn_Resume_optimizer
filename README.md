# 智能简历优化助手 🚀

一个基于AI的智能简历优化工具，帮助求职者根据目标职位描述优化简历内容，提高求职成功率。
![Uploading image.png…]()

## ✨ 核心功能

- **🤖 AI驱动优化**: 集成Google Gemini AI，智能分析简历与职位匹配度
- **📝 三栏式布局**: 元简历输入、职位描述输入、优化结果展示
- **✏️ 富文本编辑**: 支持格式化编辑、实时预览和内容调整
- **📄 PDF导出**: 一键生成专业简历PDF文件
- **📱 响应式设计**: 完美适配桌面端和移动端
- **🎨 现代化UI**: 渐变色彩、动画效果、专业视觉设计

## 🛠️ 技术栈

### 前端
- **React 18** - 现代化前端框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Lucide React** - 现代化图标库
- **React Router** - 客户端路由

### 后端
- **Node.js** - JavaScript运行时
- **Express** - Web应用框架
- **Google Generative AI** - Gemini AI集成
- **Puppeteer** - PDF生成
- **CORS** - 跨域资源共享

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd 简历优化工具
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
创建 `.env` 文件并配置以下变量：
```env
# Google Gemini API配置
GOOGLE_API_KEY=your_gemini_api_key_here

# 服务器配置
PORT=3001
NODE_ENV=development

# 前端配置
VITE_API_BASE_URL=http://localhost:3001
```

4. **启动开发服务器**
```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

## 📖 使用指南

### 1. 输入基础信息
- 在左侧"元简历"区域输入个人基本信息
- 在中间"职位描述"区域粘贴目标JD

### 2. AI智能优化
- 点击"生成优化简历"按钮
- AI将分析匹配度并提供优化建议
- 查看右侧优化结果和匹配度评分

### 3. 编辑完善
- 点击"编辑简历"进入富文本编辑器
- 支持文本格式化、字体调整等功能
- 实时预览编辑效果

### 4. 导出使用
- 点击"导出PDF"生成专业简历文件
- 支持下载和分享

## 🔧 API文档

### 简历优化
```http
POST /api/resume/generate
Content-Type: application/json

{
  "metaResume": "个人基础信息",
  "jobDescription": "职位描述"
}
```

### 简历更新
```http
PUT /api/resume/:id
Content-Type: application/json

{
  "content": "更新后的简历内容"
}
```

### PDF导出
```http
POST /api/resume/:id/export
```

### PDF下载
```http
GET /api/resume/:id/download
```

## 📁 项目结构

```
简历优化工具/
├── src/                    # 前端源码
│   ├── components/         # React组件
│   ├── pages/             # 页面组件
│   │   ├── Home.tsx       # 主页
│   │   └── Edit.tsx       # 编辑页
│   ├── utils/             # 工具函数
│   └── index.css          # 全局样式
├── api/                   # 后端源码
│   ├── routes/            # 路由定义
│   │   └── resume.ts      # 简历相关路由
│   ├── services/          # 业务服务
│   │   ├── geminiService.ts  # Gemini AI服务
│   │   └── pdfService.ts     # PDF生成服务
│   └── index.ts           # 服务器入口
├── public/                # 静态资源
├── vercel.json           # Vercel部署配置
├── package.json          # 项目配置
└── README.md            # 项目文档
```

## 🌍 环境变量配置

| 变量名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| `GOOGLE_API_KEY` | Google Gemini API密钥 | ✅ | - |
| `PORT` | 后端服务端口 | ❌ | 3001 |
| `NODE_ENV` | 运行环境 | ❌ | development |
| `VITE_API_BASE_URL` | 前端API基础URL | ❌ | http://localhost:3001 |

### 获取Gemini API密钥
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的API密钥
3. 将密钥添加到 `.env` 文件

## 🚀 部署指南

### Vercel部署
1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

### 手动部署
```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

## 🧪 开发脚本

```bash
# 启动开发服务器（前后端）
npm run dev

# 仅启动前端
npm run client:dev

# 仅启动后端
npm run server:dev

# 构建项目
npm run build

# 类型检查
npm run check

# 代码检查
npm run lint

# 预览构建结果
npm run preview
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范
- 使用TypeScript进行类型安全开发
- 遵循ESLint代码规范
- 组件保持单一职责，文件不超过300行
- 提交信息使用约定式提交格式

## 📝 更新日志

### v1.0.0 (2024-01-20)
- ✨ 初始版本发布
- 🤖 集成Gemini AI智能优化
- 📝 实现富文本编辑器
- 📄 支持PDF导出功能
- 📱 响应式设计适配

## 🔒 隐私与安全

- 用户数据仅用于简历优化，不会存储或分享
- 所有API调用均通过HTTPS加密传输
- 临时文件自动清理，保护用户隐私

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Google Gemini AI](https://ai.google.dev/) - 提供强大的AI能力
- [React](https://reactjs.org/) - 优秀的前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用的CSS框架
- [Lucide](https://lucide.dev/) - 精美的图标库

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/resume-optimizer/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/resume-optimizer/discussions)

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！
