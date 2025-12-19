# FLOA Agent Web

基于 React + Vite + HeroUI 的 Web3 AI Agent 平台，支持 AI Agent 创建、训练、对话和收益管理。

## 技术栈

- React 18 + TypeScript
- Vite + Tailwind CSS
- HeroUI 组件库
- Wagmi + Reown AppKit (Web3)
- Zustand (状态管理)
- i18next (国际化)

## 快速开始

### 环境要求

- Node.js >= 22.19.0
- Yarn >= 1.22.0

### 环境配置

复制 [.env.example](.env.example) 文件并重命名为 `.env.dev` 或 `.env.prod`，填入必要的配置：

```bash
VITE_API_BASE_URL=your_api_url
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### 安装运行

```bash
# 安装依赖
yarn install

# 开发模式
yarn dev

# 生产构建
yarn build:prod
```

## 项目结构

```
src/
├── components/       # UI 组件
├── pages/           # 页面
├── layouts/         # 布局
├── hooks/           # 自定义 Hooks
├── stores/          # 状态管理
├── i18n/            # 国际化
└── router/          # 路由配置
```

## 主要功能

- Web3 钱包连接与签名
- AI Agent 创建与管理
- Agent 对话与训练
- 收益管理与提现
- 邀请推广系统
- 多语言支持（中/英）
- 响应式设计（PC/移动端）

## 注意事项

本项目仅为前端展示代码，不包含后端 API 和智能合约配置。需要自行配置后端服务才能正常运行。

## License

MIT
