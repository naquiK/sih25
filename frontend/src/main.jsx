import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer/>
  </StrictMode>,
)
