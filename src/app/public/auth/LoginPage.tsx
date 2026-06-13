import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, X, CheckCircle2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

type Role = 'doctor' | 'patient' | 'user' | 'admin';

const accounts: Record<string, { password: string; role: Role; path: string; name: string }> = {
  'doctor@gmail.com':  { password: 'doctor',  role: 'doctor',  path: '/d',      name: 'BS. Trần Thị A' },
  'patient@gmail.com': { password: 'patient', role: 'patient', path: '/p/home', name: 'Nguyễn Văn Minh' },
  'user@gmail.com':    { password: 'user',    role: 'user',    path: '/u/home', name: 'Nguyễn Văn A' },
  'admin@gmail.com':   { password: 'admin',   role: 'admin',   path: '/a',      name: 'Quản trị viên' },
};

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password flow
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset' | 'done'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPwd, setForgotNewPwd] = useState('');
  const [forgotConfirmPwd, setForgotConfirmPwd] = useState('');
  const [forgotErr, setForgotErr] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const openForgot = () => {
    setForgotOpen(true);
    setForgotStep('email');
    setForgotEmail(email);
    setForgotOtp('');
    setForgotNewPwd('');
    setForgotConfirmPwd('');
    setForgotErr('');
  };

  const closeForgot = () => setForgotOpen(false);

  const startCooldown = () => {
    setCooldown(30);
    const iv = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) { clearInterval(iv); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const sendOtp = () => {
    setForgotErr('');
    const e = forgotEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setForgotErr('Email không hợp lệ'); return; }
    if (!accounts[e]) { setForgotErr('Không tìm thấy tài khoản với email này'); return; }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStep('otp');
      startCooldown();
      toast.success('Mã OTP đã được gửi đến email của bạn (demo: 123456)');
    }, 600);
  };

  const verifyOtp = () => {
    setForgotErr('');
    if (forgotOtp.trim() !== '123456') { setForgotErr('Mã OTP không đúng. Thử lại với mã 123456 (demo)'); return; }
    setForgotStep('reset');
  };

  const resetPassword = () => {
    setForgotErr('');
    if (forgotNewPwd.length < 6) { setForgotErr('Mật khẩu phải có ít nhất 6 ký tự'); return; }
    if (forgotNewPwd !== forgotConfirmPwd) { setForgotErr('Mật khẩu xác nhận không khớp'); return; }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStep('done');
      toast.success('Đặt lại mật khẩu thành công');
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const acc = accounts[email.trim().toLowerCase()];
    if (!acc || acc.password !== password) {
      setError('Email hoặc mật khẩu không đúng');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(acc.path);
    }, 400);
  };

  return (
    <div className="app-main auth-shell min-h-screen w-full flex bg-gray-50">

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(20,83,45,0.92) 0%, rgba(22,101,52,0.88) 40%, rgba(21,128,61,0.82) 75%, rgba(22,163,74,0.78) 100%), url("https://images.unsplash.com/photo-1603519203402-fa71f28d31ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-10 -left-10 w-72 h-72 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 mb-2 hover:opacity-90 transition text-left cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
              <Leaf size={24} className="text-green-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dinh Dưỡng Việt</h1>
              <p className="text-xs text-green-200">Hệ thống chăm sóc dinh dưỡng toàn diện</p>
            </div>
          </button>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Sức khỏe của bạn,<br/>bắt đầu từ <span className="text-green-200">bữa ăn</span>
          </h2>
          <p className="text-green-100 max-w-md leading-relaxed">
            Nền tảng kết nối đội ngũ bác sĩ dinh dưỡng với bệnh nhân và người dùng, hỗ trợ tra cứu món ăn Việt và xây dựng thực đơn cá nhân hoá.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { num: '500+', label: 'Món ăn Việt' },
              { num: '15+',  label: 'Bác sĩ' },
              { num: '300+', label: 'Người dùng' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4 ring-1 ring-white/10">
                <p className="text-2xl font-bold">{s.num}</p>
                <p className="text-xs text-green-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-green-200">
          © 2026 Dinh Dưỡng Việt
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <button onClick={() => navigate('/')} className="lg:hidden flex items-center justify-center gap-2 mb-8 w-full hover:opacity-90 transition cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Dinh Dưỡng Việt</span>
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Đăng nhập</h2>
            <p className="text-sm text-gray-500">Nhập email và mật khẩu để tiếp tục</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                <button type="button" onClick={openForgot} className="text-xs text-green-600 hover:text-green-700 font-medium">
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="peer sr-only"
              />
              <span className="w-4 h-4 rounded border border-gray-300 bg-white flex items-center justify-center transition peer-checked:border-green-600 peer-focus:ring-2 peer-focus:ring-green-300">
                <svg
                  viewBox="0 0 16 16"
                  className="w-3 h-3 text-green-600 opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: remember ? 1 : 0 }}
                >
                  <polyline points="3 8.5 6.5 12 13 4.5" />
                </svg>
              </span>
              <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
            </label>

            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-green-600 to-emerald-700 hover:shadow-lg hover:opacity-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Chưa có tài khoản?{' '}
              <button onClick={() => navigate('/register')} className="text-green-600 hover:text-green-700 font-semibold">
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ── Forgot password modal ── */}
      {forgotOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeForgot}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-sm">Quên mật khẩu</h3>
                  <p className="text-xs text-gray-500">
                    {forgotStep === 'email' && 'Nhập email để nhận mã xác thực'}
                    {forgotStep === 'otp'   && 'Nhập mã OTP gồm 6 chữ số'}
                    {forgotStep === 'reset' && 'Tạo mật khẩu mới cho tài khoản'}
                    {forgotStep === 'done'  && 'Hoàn tất đặt lại mật khẩu'}
                  </p>
                </div>
              </div>
              <button onClick={closeForgot} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            {/* Step indicator */}
            {forgotStep !== 'done' && (
              <div className="flex items-center gap-2 px-5 pt-4">
                {(['email', 'otp', 'reset'] as const).map((s, i) => {
                  const order = { email: 0, otp: 1, reset: 2, done: 3 }[forgotStep];
                  const isActive = i === order;
                  const isDone = i < order;
                  return (
                    <div key={s} className="flex-1 flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive ? 'bg-green-600 text-white' : isDone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isDone ? <CheckCircle2 size={12} /> : i + 1}
                      </div>
                      {i < 2 && <div className={`flex-1 h-0.5 ${isDone ? 'bg-green-300' : 'bg-gray-200'}`} />}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="p-5 space-y-4">
              {forgotStep === 'email' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email tài khoản</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="email@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                      />
                    </div>
                  </div>
                  {forgotErr && <p className="text-xs text-red-600">{forgotErr}</p>}
                  <button
                    onClick={sendOtp}
                    disabled={forgotLoading}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold text-sm hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? 'Đang gửi...' : <>Gửi mã xác thực <ArrowRight size={14} /></>}
                  </button>
                </>
              )}

              {forgotStep === 'otp' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã OTP gồm 6 chữ số</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full px-3 py-3 text-center text-lg tracking-[0.5em] font-mono border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                    />
                    <p className="text-[11px] text-gray-500 mt-2">
                      Mã đã gửi tới <span className="font-medium text-gray-700">{forgotEmail}</span>.{' '}
                      {cooldown > 0 ? (
                        <span className="text-gray-400">Gửi lại sau {cooldown}s</span>
                      ) : (
                        <button onClick={sendOtp} className="text-green-600 hover:text-green-700 font-medium">Gửi lại mã</button>
                      )}
                    </p>
                  </div>
                  {forgotErr && <p className="text-xs text-red-600">{forgotErr}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => setForgotStep('email')} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                      Quay lại
                    </button>
                    <button
                      onClick={verifyOtp}
                      disabled={forgotOtp.length !== 6}
                      className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold text-sm hover:opacity-95 disabled:opacity-60"
                    >
                      Xác thực
                    </button>
                  </div>
                </>
              )}

              {forgotStep === 'reset' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={forgotNewPwd}
                        onChange={(e) => setForgotNewPwd(e.target.value)}
                        placeholder="Tối thiểu 6 ký tự"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={forgotConfirmPwd}
                        onChange={(e) => setForgotConfirmPwd(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                      />
                    </div>
                  </div>
                  {forgotErr && <p className="text-xs text-red-600">{forgotErr}</p>}
                  <button
                    onClick={resetPassword}
                    disabled={forgotLoading}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold text-sm hover:opacity-95 disabled:opacity-60"
                  >
                    {forgotLoading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                  </button>
                </>
              )}

              {forgotStep === 'done' && (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="text-gray-900 font-semibold">Đặt lại mật khẩu thành công</p>
                  <p className="text-sm text-gray-500 mt-1">Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.</p>
                  <button
                    onClick={() => { closeForgot(); setEmail(forgotEmail); setPassword(''); }}
                    className="mt-5 w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold text-sm hover:opacity-95"
                  >
                    Quay lại đăng nhập
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
