# 维权算盘 (LawPrice) - 诉讼全景决策与维权成本评估系统

一款超越传统单一律师费计算器的**“全生命周期诉讼决策与成本收益分析系统”**。将诉讼中的**金钱成本、自然周期、个人精力投入、律师专业工作量、胜诉回款风险（ROI）**全面量化，帮助当事人在诉前做出最理性的维权决策。

---

## 🌟 核心功能亮点

1. **💰 全景费用构成测算（金钱总账本）**
   - **法院案件受理费**：依据《诉讼费用交纳办法》第13条严格阶梯累退计算（支持简易程序减半判定）。
   - **律师费市场参考区间**：基于全国 31 省市律协现行指导标准及市场行情测算。
   - **财产保全费 & 保全责任险**：自动测算封顶 5000 元保全费与 0.15% 诉讼责任保函保费。
   - **申请强制执行费**：法定阶梯费率，明确标识由被执行人承担。
   - **✨ 律师费转嫁支持判定器**：智能判定合同约定条款及法定转嫁情形（如知产侵权、人身侵权等），明确告知胜诉后能否让对方报销律师费。

2. **⏳ 双维度时间与精力分析（打破时间混淆）**
   - **日历自然周期（Calendar Timeline）**：立案到判决执行平均 3~6 个月，全流程阶段里程碑管理，打消当事人盲目焦虑。
   - **当事人自身工时对比（Personal Effort）**：
     - **委托律师**：仅需配合 **3 ~ 5 小时**（提供材料、线上签字），几乎零误工。
     - **自己打官司**：预计消耗 **50 ~ 80 小时**（自学法条、写文书、跑法院立案退补正、开庭质证），换算当事人月薪折算的误工损失与败诉风险。

3. **🛠️ 律师工作量清单与工时拆解（专业价值透明化）**
   - 拆解 4 大阶段（诉前研判、立案保全、庭审质证对抗、判决执行跟进）共 15+ 项具体交付动作。
   - 可视化展示约 **25~45 专业工时** 的交付清单，彻底解决“律师到底干了什么”的信任痛点。

4. **📊 胜诉率与 ROI 回款决策沙盘**
   - **法律胜诉概率模型**：结合证据链质量与时效进行评级。
   - **执行回款率与“老赖”风险预警**：强化“打赢官司不等于拿回现金”的风险意识。
   - **预期净收益期望值计算（EV）**：$$E = \text{标的额} \times P_{\text{胜诉}} \times P_{\text{执行}} - \text{实际终局总成本}$$
   - **智能行动建议**：推荐“立即诉讼”、“诉前调解/发律师函”或“谨慎维权避免扩大损失”。

5. **📑 一键导出专业《诉讼全景决策与成本评估报告》**
   - 支持浏览器直接打印 / 保存为高清 A4 PDF 报告。
   - 提供律师专属“快速报价”模式，一键生成微信/方案格式报价单。

---

## 🚀 本地开发与构建

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务
npm run dev

# 3. 生产打包
npm run build
```

---

## ☁️ 部署到 Cloudflare Pages

本项目已完全适配 Cloudflare Pages 静态边缘全球加速部署。

### 方式一：通过 Wrangler CLI 命令行一键部署（推荐）

```bash
# 1. 登录 Cloudflare 账号
npx wrangler login

# 2. 构建并发布到 Cloudflare Pages
npm run deploy
# 或运行：
# npx wrangler pages deploy dist --project-name=law-price
```

### 方式二：通过 Cloudflare 控制台连接 GitHub（自动化 CI/CD）

1. 将代码推送到 GitHub 仓库：
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of LawPrice decision system"
   git remote add origin <你的GitHub仓库地址>
   git push -u origin main
   ```
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**。
3. 选择你的 GitHub 仓库，配置构建参数：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. 点击 **Save and Deploy**，Cloudflare 将自动分配全球 CDN 域名（如 `https://law-price.pages.dev`）并开启自动化部署！
