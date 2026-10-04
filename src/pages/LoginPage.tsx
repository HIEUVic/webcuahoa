import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setErrorMsg('Tài khoản hoặc mật khẩu không chính xác!')
      } else if (data.session) {
        navigate('/admin', { replace: true })
      }
    } catch (err: any) {
      setErrorMsg('Đã có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full sm:max-w-sm mx-auto flex flex-col justify-center px-6 py-12 relative"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Background Gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, #fff8fc 0%, #fef0f7 30%, #f5f0ff 70%, #fdfaff 100%)',
        }}
      />

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-stone-200/60">
        <div className="text-center mb-6">
          <span className="text-4xl">🔐</span>
          <h1
            className="text-xl font-bold mt-2 text-stone-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Đăng nhập Quản trị
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Vui lòng đăng nhập để quản lý sản phẩm & profile
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-white text-sm font-semibold shadow-md active:scale-95 transition-all disabled:opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))',
            }}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            ← Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}