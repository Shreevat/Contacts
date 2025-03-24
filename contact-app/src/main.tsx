import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import { ThemeProvider} from "./components/ThemeProvider"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
     <ThemeProvider defaultTheme="system" storageKey="digital-diary-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
