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
git clone [https://github.com/sankalpa-adhikari-sa/kobo-bifrost-addin.git](https://github.com/sankalpa-adhikari-sa/kobo-bifrost-addin.git)

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
| --------------------------- | ----------------------------------------------------------- | --- |
| `npm run dev-server`        | Recommended Dev Start. Runs Vite + Hono Proxy concurrently. |
| `npm run dev:proxy-hono`    | Dev Start. Runs Vite + Hono Proxy concurrently.             |
| `npm run dev:proxy-express` | Dev Start. Runs Vite + express Proxy concurrently.          |
| `npm run start`             | Aliased to `start:desktop`. Launches Excel debugging.       |     |
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
