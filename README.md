# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

### Backend configuration

The Express server now uses MongoDB Atlas for data storage. You must provide a connection string via the
`MONGODB_URI` environment variable (e.g. `mongodb+srv://<user>:<pass>@cluster0.mongodb.net/your-db?retryWrites=true&w=majority`).
Create a `.env` file at the project root with the following values:

```text
SERVER_PORT=4000
FRONTEND_URL=http://localhost:5173
GMAIL_USER=you@example.com
GMAIL_PASS=...
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/your-db?retryWrites=true&w=majority
```

Restart the server after adding the variable so the new connection is established.
