import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ShiftProvider } from "./context/ShiftContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ShiftProvider>
      <App />
    </ShiftProvider>
  </React.StrictMode>
);
