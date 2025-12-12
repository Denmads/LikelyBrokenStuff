import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import TodoListPage from './pages/TodoListPage.tsx'
import PasswordGeneratorPage from './pages/PasswordGeneratorPage.tsx'
import ColorPickerPage from './pages/ColorPickerPage.tsx'
import DefinitelySyncingPage from './pages/DefinitelySyncingPage.tsx'
import GlitchGobblerPage from './pages/GlitchGobblerPage.tsx'
import ScrollToTop from './components/ScrollToTop'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tools/todo" element={<TodoListPage />} />
        <Route path="/tools/password" element={<PasswordGeneratorPage />} />
        <Route path="/tools/color" element={<ColorPickerPage />} />
        <Route path="/tools/sync" element={<DefinitelySyncingPage />} />
        <Route path="/tools/game" element={<GlitchGobblerPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
