import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Skin } from "./pages/context/SkinContext";
import { AuthProvider } from "./pages/context/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
      <AuthProvider>
          <Skin>
              <App />
          </Skin>
      </AuthProvider>
  </React.StrictMode>
)