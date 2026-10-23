import React from "react";
import ReactDOM from "react-dom/client";
import "./tailwind.css";
import "./style.css";
import App from "./App";
import "./pages.css";
import "./portrait-hero.css";
import "./studio-theme.css";
import "./portfolio-refinements.css";
import "./sections.css";
import "./project-editorial.css";
import "./contact-section.css";
import "./github-stats.css";

const AdminPage = React.lazy(() => import("./admin/AdminPage"));
const adminRoute = /^\/admin(?:\/|$)/.test(window.location.pathname);

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>{adminRoute ? <React.Suspense fallback={<p role="status" style={{ padding: "48px", color: "#796b59" }}>Opening your workspace…</p>}><AdminPage /></React.Suspense> : <App />}</React.StrictMode>
);

