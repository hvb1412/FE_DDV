import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, User, Phone, Calendar,
  CheckCircle2, Info, Sparkles, KeyRound,
} from 'lucide-react';
import { toast } from 'sonner';

type Gender = 'male' | 'female' | 'other';
type Step = 1 | 2 | 3 | 4 | 5;

export function RegisterPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);

  // Step 1 — account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Step 2 — personal
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>('male');

  // Step 3 — health basics (optional but useful for nutrition)
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain' | 'healthy'>('healthy');
  const [activity, setActivity] = useState<'low' | 'medium' | 'high'>('medium');
  const [agree, setAgree] = useState(false);

  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 4 — OTP verification
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<number | null>(null);

  const startCooldown = () => {
    setCooldown(30);
    if (cooldownRef.current) window.clearInterval(cooldownRef.current);
    cooldownRef.current = window.setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) { if (cooldownRef.current) window.clearInterval(cooldownRef.current); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (cooldownRef.current) window.clearInterval(cooldownRef.current); }, []);

  const resendOtp = () => {
    setErr('');
    setOtp('');
    startCooldown();
    toast.success('Mã OTP mới đã được gửi đến email của bạn (demo: 123456)');
  };

  const verifyOtp = () => {
    setErr('');
    if (otp.trim() !== '123456') { setErr('Mã OTP không đúng. Thử lại với mã 123456 (demo)'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(5);
      toast.success('Xác minh email thành công');
      window.setTimeout(() => navigate('/u/home'), 1800);
    }, 500);
  };

  // Password rules — required + bonus.
  // Required (must all pass): length >= 8, has lower, has upper, has digit, no whitespace.
  // Bonus (for strength score, not blocking): length >= 12, has special char.
  const emailLocal = email.split('@')[0]?.toLowerCase() ?? '';
  const pwdRules = {
    length:    password.length >= 8,
    lower:     /[a-z]/.test(password),
    upper:     /[A-Z]/.test(password),
    digit:     /\d/.test(password),
    noSpace:   password.length > 0 && !/\s/.test(password),
    notEmail:  password.length > 0 && (emailLocal.length < 3 || !password.toLowerCase().includes(emailLocal)),
  };
  const pwdRequiredOk = Object.values(pwdRules).every(Boolean);
  const pwdBonus = {
    long:    password.length >= 12,
    special: /[^A-Za-z0-9]/.test(password),
  };
  const pwdScore = Math.min(
    5,
    [pwdRules.length, pwdRules.lower, pwdRules.upper, pwdRules.digit, pwdBonus.long, pwdBonus.special]
      .filter(Boolean).length
  );
  const strengthLabel = ['Quá yếu', 'Yếu', 'Trung bình', 'Khá mạnh', 'Mạnh', 'Rất mạnh'][pwdScore];
  const strengthColor = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500', 'bg-green-600'][pwdScore];

  const validateStep1 = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Email không hợp lệ';
    if (!pwdRules.length)   return 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!pwdRules.noSpace)  return 'Mật khẩu không được chứa khoảng trắng';
    if (!pwdRules.lower)    return 'Mật khẩu cần có ít nhất 1 chữ thường (a-z)';
    if (!pwdRules.upper)    return 'Mật khẩu cần có ít nhất 1 chữ HOA (A-Z)';
    if (!pwdRules.digit)    return 'Mật khẩu cần có ít nhất 1 chữ số (0-9)';
    if (!pwdRules.notEmail) return 'Mật khẩu không được trùng với phần đầu email';
    if (password !== confirmPwd) return 'Mật khẩu xác nhận không khớp';
    return '';
  };

  const validateStep2 = () => {
    if (fullName.trim().length < 2) return 'Vui lòng nhập họ và tên';
    if (!/^0\d{9,10}$/.test(phone.trim())) return 'Số điện thoại không hợp lệ (VD: 0901234567)';
    if (!dob) return 'Vui lòng chọn ngày sinh';
    return '';
  };

  const validateStep3 = () => {
    if (!agree) return 'Bạn cần đồng ý với điều khoản sử dụng';
    return '';
  };

  const next = () => {
    let e = '';
    if (step === 1) e = validateStep1();
    if (step === 2) e = validateStep2();
    if (step === 3) e = validateStep3();
    if (e) { setErr(e); return; }
    setErr('');
    if (step === 3) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(4);
        setOtp('');
        startCooldown();
        toast.success('Mã OTP đã được gửi đến email của bạn (demo: 123456)');
      }, 700);
      return;
    }
    setStep((s) => (s + 1) as Step);
  };

  const back = () => {
    setErr('');
    // Không cho lùi từ bước OTP về form (account đã pending tạo)
    if (step === 4 || step === 5) return;
    setStep((s) => Math.max(1, s - 1) as Step);
  };

  return (
    <div className="app-main auth-shell min-h-screen w-full flex bg-gray-50">

      {/* Left brand panel */}
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

        <button onClick={() => navigate('/')} className="relative z-10 flex items-center gap-3 hover:opacity-90 transition text-left cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
            <Leaf size={24} className="text-green-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dinh Dưỡng Việt</h1>
            <p className="text-xs text-green-200">Tạo tài khoản người dùng miễn phí</p>
          </div>
        </button>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Bắt đầu hành trình<br/>ăn uống <span className="text-green-200">lành mạnh</span>
          </h2>
          <p className="text-green-100 max-w-md leading-relaxed">
            Tạo tài khoản người dùng để tra cứu dinh dưỡng, lên thực đơn cá nhân và theo dõi sức khoẻ hàng ngày.
          </p>
          <div className="space-y-3 pt-2">
            {[
              'Tra cứu hơn 1.000 món ăn Việt',
              'Tự xây dựng thực đơn theo nhu cầu',
              'Đánh giá dinh dưỡng và mục tiêu sức khoẻ',
              'Học kiến thức dinh dưỡng mỗi ngày',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-green-100">
                <CheckCircle2 size={16} className="text-green-200 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur rounded-xl p-4 ring-1 ring-white/15 flex gap-3">
          <Info size={18} className="text-green-200 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-green-100 leading-relaxed">
            <p className="text-white font-semibold mb-1">Bạn là bác sĩ hoặc bệnh nhân?</p>
            Tài khoản <span className="font-semibold">Bác sĩ / Chuyên gia</span> và <span className="font-semibold">Bệnh nhân</span> do cơ quan y tế cấp. Vui lòng liên hệ đơn vị quản lý của bạn để được cung cấp.
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <button onClick={() => navigate('/')} className="lg:hidden flex items-center justify-center gap-2 mb-8 w-full hover:opacity-90 transition cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Dinh Dưỡng Việt</span>
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {step === 4 ? 'Xác minh email' : step === 5 ? 'Chào mừng bạn!' : 'Đăng ký tài khoản'}
            </h2>
            <p className="text-sm text-gray-500">
              {step === 1 && 'Bước 1/4 · Thông tin đăng nhập'}
              {step === 2 && 'Bước 2/4 · Thông tin cá nhân'}
              {step === 3 && 'Bước 3/4 · Mục tiêu sức khoẻ'}
              {step === 4 && 'Bước 4/4 · Nhập mã OTP gửi về email'}
              {step === 5 && 'Tài khoản đã được kích hoạt'}
            </p>
          </div>

          {/* Step indicator */}
          {step !== 5 && (
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4].map((n, i) => {
                const active = step === n;
                const done = step > n;
                return (
                  <div key={n} className="flex-1 flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      active ? 'bg-green-600 text-white' : done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {done ? <CheckCircle2 size={14} /> : n}
                    </div>
                    {i < 3 && <div className={`flex-1 h-0.5 ${done ? 'bg-green-300' : 'bg-gray-200'}`} />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 1 — account */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ít nhất 8 ký tự, có chữ HOA, chữ thường và số"
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className={`flex-1 ${i < pwdScore ? strengthColor : ''}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500 w-20 text-right">{strengthLabel}</span>
                  </div>
                )}

                {/* Password requirements — always visible.
                    Collapses to a single confirmation line once all required rules pass. */}
                {pwdRequiredOk ? (
                  <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-green-50 border border-green-100">
                    <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" />
                    <span className="text-[11px] text-green-700 font-medium">
                      Mật khẩu đáp ứng yêu cầu bảo mật
                    </span>
                    {!pwdBonus.special && (
                      <span className="text-[11px] text-gray-400 ml-auto">
                        Thêm ký tự đặc biệt để mạnh hơn
                      </span>
                    )}
                  </div>
                ) : (
                  <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                    {[
                      { ok: pwdRules.length,   label: 'Tối thiểu 8 ký tự' },
                      { ok: pwdRules.upper,    label: 'Có chữ HOA (A-Z)' },
                      { ok: pwdRules.lower,    label: 'Có chữ thường (a-z)' },
                      { ok: pwdRules.digit,    label: 'Có chữ số (0-9)' },
                      { ok: pwdRules.noSpace,  label: 'Không có khoảng trắng' },
                      { ok: pwdBonus.special,  label: 'Có ký tự đặc biệt (khuyến nghị)', optional: true },
                    ].map((r) => (
                      <li key={r.label} className="flex items-center gap-1.5 text-[11px]">
                        {r.ok ? (
                          <CheckCircle2 size={12} className="text-green-600 flex-shrink-0" />
                        ) : (
                          <span className={`w-3 h-3 rounded-full border flex-shrink-0 ${r.optional ? 'border-gray-200' : 'border-gray-300'}`} />
                        )}
                        <span className={r.ok ? 'text-gray-700' : r.optional ? 'text-gray-400' : 'text-gray-500'}>
                          {r.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — personal */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="0901234567"
                    maxLength={11}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày sinh</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 bg-white"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — health */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed -mt-2">
                Thông tin này giúp cá nhân hoá khuyến nghị dinh dưỡng. Bạn có thể cập nhật sau trong Hồ sơ.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Chiều cao (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cân nặng (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="65"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu sức khoẻ</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: 'healthy',  label: 'Ăn lành mạnh' },
                    { id: 'maintain', label: 'Giữ cân' },
                    { id: 'lose',     label: 'Giảm cân' },
                    { id: 'gain',     label: 'Tăng cân' },
                  ] as const).map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition ${
                        goal === g.id ? 'border-green-600 bg-green-50 text-green-700 font-semibold' : 'border-gray-200 text-gray-700 hover:border-green-300'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ vận động</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'low',    label: 'Ít' },
                    { id: 'medium', label: 'Vừa' },
                    { id: 'high',   label: 'Nhiều' },
                  ] as const).map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setActivity(a.id)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition ${
                        activity === a.id ? 'border-green-600 bg-green-50 text-green-700 font-semibold' : 'border-gray-200 text-gray-700 hover:border-green-300'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-2 select-none">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="w-4 h-4 mt-[10px] flex-shrink-0 rounded border border-gray-300 bg-white inline-flex items-center justify-center transition peer-checked:border-green-600 peer-focus:ring-2 peer-focus:ring-green-300">
                  <svg
                    viewBox="0 0 16 16"
                    className="w-3 h-3 text-green-600 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: agree ? 1 : 0 }}
                  >
                    <polyline points="3 8.5 6.5 12 13 4.5" />
                  </svg>
                </span>
                <span className="text-xs text-gray-600 leading-relaxed">
                  Tôi đồng ý với <button type="button" className="text-green-600 hover:underline font-medium">Điều khoản sử dụng</button> và <button type="button" className="text-green-600 hover:underline font-medium">Chính sách bảo mật</button> của Dinh Dưỡng Việt.
                </span>
              </label>
            </div>
          )}

          {/* Step 4 — OTP verification */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-green-600 flex-shrink-0">
                  <KeyRound size={18} />
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  Chúng tôi đã gửi mã xác thực 6 chữ số đến{' '}
                  <span className="font-semibold text-gray-900">{email}</span>. Vui lòng kiểm tra hộp thư
                  (và mục Spam) để hoàn tất đăng ký.
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã OTP gồm 6 chữ số</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-3 py-3 text-center text-lg tracking-[0.5em] font-mono border border-gray-200 rounded-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                />
                <p className="text-[11px] text-gray-500 mt-2">
                  Không nhận được mã?{' '}
                  {cooldown > 0 ? (
                    <span className="text-gray-400">Gửi lại sau {cooldown}s</span>
                  ) : (
                    <button type="button" onClick={resendOtp} className="text-green-600 hover:text-green-700 font-medium">
                      Gửi lại mã
                    </button>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Step 5 — success */}
          {step === 5 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={36} />
              </div>
              <p className="text-lg font-semibold text-gray-900">Tài khoản đã sẵn sàng</p>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                Xin chào <span className="font-semibold text-gray-700">{fullName || email}</span>!
              </p>
              <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-left">
                <p className="text-[11px] text-gray-500 mb-1">Email đăng nhập của bạn</p>
                <p className="text-sm font-semibold text-gray-900 break-all">{email}</p>
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                  Hãy ghi nhớ email và mật khẩu để đăng nhập lần sau. Trình duyệt cũng có thể đề xuất lưu mật khẩu giúp bạn.
                </p>
              </div>
              <button
                onClick={() => navigate('/u/home')}
                className="mt-5 w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95"
              >
                Bắt đầu khám phá <ArrowRight size={16} />
              </button>
              <p className="text-[11px] text-gray-400 mt-3">Đang tự động chuyển đến trang chủ...</p>
            </div>
          )}

          {/* Error & actions */}
          {step !== 5 && (
            <>
              {err && (
                <div className="mt-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                  {err}
                </div>
              )}

              <div className="flex gap-2 mt-6">
                {step > 1 && step < 4 && (
                  <button
                    onClick={back}
                    className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Quay lại
                  </button>
                )}
                <button
                  onClick={step === 4 ? verifyOtp : next}
                  disabled={loading || (step === 4 && otp.length !== 6)}
                  className="flex-1 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {step === 4 ? 'Đang xác thực...' : 'Đang xử lý...'}
                    </>
                  ) : step === 3 ? (
                    <>Gửi mã xác thực <ArrowRight size={16} /></>
                  ) : step === 4 ? (
                    <>Xác thực & kích hoạt <CheckCircle2 size={16} /></>
                  ) : (
                    <>Tiếp tục <ArrowRight size={16} /></>
                  )}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Đã có tài khoản?{' '}
                  <button onClick={() => navigate('/login')} className="text-green-600 hover:text-green-700 font-semibold">
                    Đăng nhập
                  </button>
                </p>
              </div>

              <div className="mt-4 text-center text-[11px] text-gray-400">
                © 2026 Dinh Dưỡng Việt
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
