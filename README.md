<div align="center">
  
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" alt="React" width="60" />
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" alt="Node.js" width="60" />
  
  <h1 align="center">🌟 Portfolio Website Monorepo 🌟</h1>

  <p align="center">
    <strong>A high-performance, modern, and unified workspace.</strong><br>
    <em>Powered by Next.js, Astro, Cloudflare Workers & pnpm</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220" alt="pnpm" />
    <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/astro-%232C2052.svg?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" />
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white" alt="Cloudflare" />
  </p>

</div>

---

## ⚡ Overview

Welcome to the central repository for the Portfolio platform. We have adopted a **pnpm workspaces** monorepo architecture to streamline development, share dependencies effortlessly, and keep our frontend and backend ecosystems closely integrated.

<details>
<summary><b>Click to expand Project Structure</b></summary>
<br>

| Package | Framework | Description |
| :--- | :--- | :--- |
| 🌐 **[`core-fe`](./core-fe)** | `Next.js` | The main user-facing frontend application. Styled beautifully with Tailwind CSS. |
| 🛠 **[`cms-dashboard`](./cms-dashboard)** | `Astro` / `EmDash` | The content management system (CMS) dashboard, optimized for Cloudflare Workers. |

</details>

<br>

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### 1️⃣ Prerequisites

Ensure you have **Node.js** installed, and use `pnpm` as the package manager:
```bash
npm install -g pnpm
```

### 2️⃣ Installation

Bootstrap the entire monorepo with a single command. This resolves dependencies globally and links workspace packages.
```bash
pnpm install
```

### 3️⃣ Development Workflow

Start the development servers for all packages concurrently:
```bash
pnpm run dev
```

> **Tip:** Want to focus on just one app? Use `pnpm` filtering!
> ```bash
> # Start only the Next.js frontend
> pnpm --filter core-fe run dev
> 
> # Start only the Astro CMS dashboard
> pnpm --filter cms-dashboard run dev
> ```

---

## ✨ Features

- **Unified Workspace:** Single `pnpm-lock.yaml` and hoisted `node_modules` for lightning-fast installations.
- **Next.js App Router:** Cutting-edge frontend architecture delivering seamless user experiences in `core-fe`.
- **EmDash CMS:** Headless CMS integration tailored specifically for the Cloudflare ecosystem in `cms-dashboard`.
- **Code Formatting:** Standardized tooling using [Biome](https://biomejs.dev/) to keep our code pristine.

---

## 🛡 Git Management

> [!NOTE]  
> This repository is initialized as a **single Git root**. 
> Package-level nested Git repositories (`.git` folders inside packages) have been deliberately removed to ensure a clean commit history and easier branching. 
> 
> **Always commit your changes from the root workspace directory.**
