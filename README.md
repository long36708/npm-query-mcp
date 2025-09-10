# npm-query-mcp - NPM 包搜索 MCP 服务器

![npm-query-mcp](/public/banner.png)

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/npm-query-mcp?style=flat-square&logo=npm">
  <img alt="License" src="https://img.shields.io/github/license/long36708/npm-query-mcp?style=flat-square">
  <img alt="Node Version" src="https://img.shields.io/node/v/npm-query-mcp?style=flat-square">
  <br />
  <strong>由 longmo 创建</strong><br />
  <a href="https://github.com/long36708">
    <img src="https://img.shields.io/github/followers/long36708?style=social" alt="Follow @long36708 on GitHub">
  </a>
</div>

**想要在 AI 助手中搜索 NPM 包？**

npm-query-mcp 是一个基于 Model Context Protocol (MCP) 标准的服务器，为 Cursor、Claude 等 AI 助手提供 NPM 包搜索功能。

---

## ✨ 功能特性

- 📦 **NPM 包搜索** - 通过 `npm search` 命令搜索 NPM 包
- 📡 **多种通信协议** - 支持多种客户端与服务器之间的通信方式
    - `stdio`: 本地使用（推荐）
    - `HTTP`: 远程和本地使用，支持流式传输
    - `SSE`: 服务器发送事件（已弃用）
- 🤖 **AI 助手集成** - 包含 Cursor IDE 配置示例
- ⌨️ **TypeScript** - 完整的类型安全支持
- 🛠️ **开发友好** - 内置开发工具和热重载

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18.0.0
- 兼容 MCP 的客户端（如 [Cursor](https://cursor.com/)）

### 安装

#### 方式一：使用 npx（推荐）

```bash
npx npm-query-mcp
```

#### 方式二：全局安装

```bash
npm install -g npm-query-mcp
npm-search-server
```

#### 方式三：本地开发

```bash
git clone https://github.com/long36708/npm-query-mcp.git
cd npm-query-mcp
npm install
npm run build
```

## 📖 使用方法

### 支持的传输协议

Model Context Protocol 支持多种传输方式。

### stdio（标准输入输出）

![stdio transport](/public/stdio-mcp-starter.jpg)

**推荐用于本地设置**

#### 代码编辑器支持

在以下位置添加配置：

**Cursor IDE**: `.cursor/mcp.json`

**本地开发/测试**

如果你想在本地测试 MCP 服务器：

```json
{
	"mcpServers": {
		"npm-search-server": {
			"command": "node",
			"args": [
				"./bin/cli.mjs"
			]
		}
	}
}
```

**已发布的包**

当你的包已发布到 npm 注册表时：

```json
{
	"mcpServers": {
		"npm-search-server": {
			"command": "npx",
			"args": [
				"npm-query-mcp"
			]
		}
	}
}
```

windows 电脑推荐如下配置

```json
{
	"npm-query-mcp": {
		"command": "node",
		"args": [
			"D:\\dev\\Volta\\tools\\shared\\npm-query-mcp\\bin\\cli.mjs"
		]
	}
}
```

### 流式 HTTP

![http transport](/public/mcp-sse-starter.jpg)

> 重要：Cursor 暂不支持流式 HTTP

**推荐用于远程服务器**

**重要：** 与 stdio 不同，你需要使用正确的标志运行服务器

**本地开发**

1. 启动 MCP 服务器
   在终端中运行：
   ```bash
   node ./bin/cli.mjs --http --port 4200
   ```

   或者使用 MCP 检查器：
   ```bash
   npm run dev-http
   ```

2. 添加配置：
   ```json
   {
     "mcpServers": {
       "npm-search-server-http": {
         "command": "node",
         "args": ["./bin/cli.mjs", "--http", "--port", "4200"]
       }
     }
   }
   ```

**已发布的包**

在终端中运行：

```bash
npx npm-query-mcp --http --port 4200
```

配置：

```json
{
	"mcpServers": {
		"npm-search-server-http": {
			"url": "http://localhost:4200/mcp"
		}
	}
}
```

## 🔧 开发

### 构建和设置

```bash
# 构建项目
npm run build

# 开发模式（热重载）
npm run start

# 开发模式 + MCP 检查器（推荐）
npm run dev

# 准备开发环境
npm run dev:prepare
```

### 测试和质量检查

```bash
# 运行测试
npm run test

# 代码检查
npm run lint

# 修复代码检查问题
npm run lint:fix

# 类型检查
npm run typecheck
```

### MCP 服务器测试

```bash
# 使用 stdio 传输测试（默认）
npm run run-cli

# 使用 HTTP 传输 + 检查器测试
npm run dev-http

# 使用 SSE 传输 + 检查器测试（已弃用）
npm run dev-sse

# 使用 stdio + 检查器测试
npm run dev-stdio

# 单独使用 MCP 检查器
npm run inspect
```

## 🏗️ 架构

### 核心组件

- **`src/index.ts`**: 使用 `citty` 的 CLI 入口点
- **`src/server.ts`**: MCP 服务器创建和传输管理（stdio/HTTP/SSE）
- **`src/types.ts`**: MCP 工具上下文和服务器选项的 TypeScript 接口
- **`src/tools/`**: 包含 MCP 工具实现的目录

### 传输协议

服务器支持三种传输方式：

1. **stdio**（默认）：标准 I/O，用于本地使用
2. **HTTP**：REST API，支持流式传输，用于远程/本地使用
3. **SSE**：服务器发送事件（已弃用）

### 工具系统

工具在 `src/tools/mytool.ts` 中注册：

- **`search_npm_packages`**：执行 `npm search` 命令并返回结果
- 使用 Zod 进行输入验证
- 实现带有 MCP 错误代码的适当错误处理

### 构建系统

- **主要**：`unbuild` 配合 ESBuild 用于生产构建
- **开发**：`tsx` 用于 TypeScript 执行
- **测试**：Vitest
- **代码检查**：ESLint 配合 Antfu 配置

## 🔍 使用检查器

使用 `inspect` 命令调试你的 MCP 服务器：

![mcp inspector](/public/inspect.jpg)
![streamable](/public/streamable2.jpg)

## 📋 命令行选项

### 协议选择

| 协议      | 描述        | 标志                                                          | 备注  |
|:--------|:----------|:------------------------------------------------------------|:----|
| `stdio` | 标准输入输出    | （无）                                                         | 默认  |
| `http`  | HTTP REST | `--port <num>` (默认: 3000), `--endpoint <path>` (默认: `/mcp`) |     |
| `sse`   | 服务器发送事件   | `--port <num>` (默认: 3000)                                   | 已弃用 |

## 🛠️ 可用工具

### search_npm_packages

搜索 NPM 包的工具。

**参数：**

- `query` (string): 搜索查询字符串

**示例：**

```
搜索 "react" 相关的包
搜索 "typescript" 工具
```

## 📄 许可证

本项目基于 MIT 许可证 - 详见 LICENSE 文件。

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 📞 支持

如果你遇到任何问题或有疑问，请在 [GitHub Issues](https://github.com/long36708/npm-query-mcp/issues) 中提出。

---

**想要构建自己的 MCP 服务器？** 这个项目为你提供了一个基本结构，可以使用 MCP 标准在 Cursor、Claude 和其他工具中运行本地工具。
