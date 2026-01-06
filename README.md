# kobo-bifrost-addin

**kobo-bifrost-addin** is a custom Microsoft Office Add-in designed to bridge the gap between **Excel** and **KoboToolbox**. This tool streamlines data management workflows, allowing users to fetch, visualize, and manage KoboToolbox survey data directly within Excel.

Built with a modern stack including **React**, **Vite**, **Fluent UI**, and **TanStack Query**.

---

## 🏗 Architecture & The CORS Proxy

### Why is a Proxy Server Required?

Web browsers (and the webviews used by Excel Add-ins) enforce **CORS (Cross-Origin Resource Sharing)** security policies.

1.  **The Problem:** When the Add-in (running on `localhost:3000` or a specific domain) tries to directly request data from the KoboToolbox API, the browser blocks the request because the origins do not match.
2.  **The Solution:** This project utilizes a lightweight Node.js proxy server.
    - The Excel Add-in requests data from the **Proxy Server** (running locally).
    - The **Proxy Server** forwards the request to the **KoboToolbox API**.
    - Server-to-server communication is not subject to browser CORS restrictions, allowing the data to pass through securely.

### Proxy Implementations

This repository includes two proxy implementations to handle these requests:

- **Hono (Default):** A lightweight, ultrafast web framework (`proxy-hono-server.mjs`).
- **Express:** A traditional Node.js web framework (`proxy-server.mjs`).

> **Note:** The development scripts default to using **Hono** for performance.

---

## ⚡ Tech Stack

- **Core:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [Fluent UI React v9](https://react.fluentui.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Data Display:** [TanStack Table](https://tanstack.com/table/latest) & [Recharts](https://recharts.org/)
- **Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- npm (comes with Node.js)
- Microsoft Excel (Desktop)
- Microsoft webview2

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/sankalpa-adhikari-sa/kobo-bifrost-addin.git
```

```bash
cd kobo-bifrost-addin
npm install
```

### 🛠 Development

To start developing, you generally need to run two things: the **Dev Server** (Frontend + Proxy) and the **Office Debugging** tool (to launch Excel).

## 1. Start the Development Server

This command uses `concurrently` to launch the Vite frontend and the **Hono** proxy server simultaneously:

```bash
npm run dev-server
```

Frontend runs at: https://localhost:3000

Proxy runs at: http://localhost:5000

## 2. Sideload into Excel

Once the server is running, open a new terminal and run one of the following to launch Excel with the add-in loaded:

```bash
npm run start
```

Now you can start using the addin.

## 3. Stop Sideloading into Excel

To stop sideloading into Excel:

```bash
npm run stop
```

## Script overview

| Script                      | Description                                                 |
| --------------------------- | ----------------------------------------------------------- |
| `npm run dev-server`        | Recommended Dev Start. Runs Vite + Hono Proxy concurrently. |
| `npm run dev:proxy-hono`    | Dev Start. Runs Vite + Hono Proxy concurrently.             |
| `npm run dev:proxy-express` | Dev Start. Runs Vite + express Proxy concurrently.          |
| `npm run start`             | Aliased to `start:desktop`. Launches Excel debugging.       |     
| `npm run proxy-hono`        | Runs only the Hono proxy server (standalone).               |
| `npm run proxy-express`     | Runs only the Express proxy server (standalone).            |
| `npm run lint`              | Lints the codebase using ESLint.                            |
| `npm run validate`          | Validates the `manifest.xml` file for errors.               |

> **Note:**
>
> Using certain option like previewing, or downloading media files from the addin will redirect you to your default web browser. These will only work when you are already logged in to kobotoolbox on that browser.

### Demo:

Here is the small preview of the addin in action.

[Addin Showcase](https://www.linkedin.com/posts/sankalpa-adhikari-b78823238_kobotoolbox-exceladdin-xlsform-activity-7347353858576175105-40a1)
<img width="955" height="775" alt="screenshot-2026-01-03_18-22-48" src="https://github.com/user-attachments/assets/cd9d5387-c0df-48a4-ae00-64ec2021ecf9" />
<img width="1013" height="966" alt="screenshot-2026-01-03_18-21-35" src="https://github.com/user-attachments/assets/43139c73-dbe7-4e92-922e-b9ccfa002dbd" />
<img width="811" height="991" alt="screenshot-2026-01-03_18-19-43" src="https://github.com/user-attachments/assets/4394bcc1-b0f1-4cf9-a13d-79620f843d2c" />
<img width="837" height="954" alt="screenshot-2026-01-03_18-19-20" src="https://github.com/user-attachments/assets/b6c78a58-4bde-412d-bc50-fdae9044af30" />
<img width="842" height="978" alt="screenshot-2026-01-03_18-04-13" src="https://github.com/user-attachments/assets/30a76b69-538e-4b37-b2d2-2714fa994094" />
<img width="879" height="987" alt="screenshot-2026-01-03_18-04-01" src="https://github.com/user-attachments/assets/467960c2-c77a-449c-8ad9-c2d340fd28fc" />
<img width="922" height="975" alt="screenshot-2026-01-03_18-03-03" src="https://github.com/user-attachments/assets/45740da2-047c-4d70-96c4-3adbdf48c4c9" />
<img width="1097" height="1051" alt="screenshot-2026-01-03_18-02-18" src="https://github.com/user-attachments/assets/daadeca3-f1c0-41ef-9b74-5922810ff5ef" />
<img width="964" height="1004" alt="screenshot-2026-01-03_18-01-56" src="https://github.com/user-attachments/assets/7cb890c2-6fa7-4ff8-8a94-5461a3ad3823" />
<img width="894" height="982" alt="screenshot-2026-01-03_18-01-41" src="https://github.com/user-attachments/assets/f3dc825b-71af-4c95-988e-b57c2a5eeb80" />
<img width="897" height="996" alt="screenshot-2026-01-03_18-01-34" src="https://github.com/user-attachments/assets/0226e91b-932f-418b-ae48-7336c41f10e0" />
<img width="904" height="988" alt="screenshot-2026-01-03_18-01-26" src="https://github.com/user-attachments/assets/1bcf009c-c48e-46ca-9ed9-d3146b227025" />
<img width="926" height="967" alt="screenshot-2026-01-03_18-01-13" src="https://github.com/user-attachments/assets/50d0b11f-bc6e-4d17-a565-e3945c3c9ebb" />
<img width="856" height="771" alt="screenshot-2026-01-03_18-00-58" src="https://github.com/user-attachments/assets/9fb71d1a-8295-4cbf-a142-b37579eef3ef" />
<img width="927" height="1018" alt="screenshot-2026-01-03_18-00-25" src="https://github.com/user-attachments/assets/187b80b8-8d82-48bd-a0bd-69680cbb1920" />
