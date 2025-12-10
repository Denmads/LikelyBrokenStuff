import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import TodoListPage from './pages/TodoListPage.tsx'
import PasswordGeneratorPage from './pages/PasswordGeneratorPage.tsx'
import ColorPickerPage from './pages/ColorPickerPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tools/todo" element={<TodoListPage />} />
        <Route path="/tools/password" element={<PasswordGeneratorPage />} />
        <Route path="/tools/color" element={<ColorPickerPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
