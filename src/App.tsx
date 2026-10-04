import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import ProtectedRoute from './components/admin/ProtectedRoute'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Trang người xem */}
        <Route path="/" element={<HomePage />} />

        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Trang quản trị (bảo vệ bằng Supabase Auth) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Tuyến đường phụ tự quay về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}