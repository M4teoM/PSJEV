import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon'
import Home from './pages/Home'
import Recarga from './pages/Recarga'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComingSoon />} />
        <Route path="/v1-home" element={<Home />} />
        <Route path="/v1-home/recarga" element={<Recarga />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
