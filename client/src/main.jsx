import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/appContext.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/auth-context/index.jsx";





createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AuthProvider>
   <AppContextProvider>
      <App />
    </AppContextProvider>
    </AuthProvider>,
  </BrowserRouter>,
);
