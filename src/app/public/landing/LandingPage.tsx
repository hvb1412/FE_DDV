import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTheme } from '@/app/shared/stores/themeStore';
import {
  Leaf, Sun, Moon, ArrowRight, Stethoscope, HeartPulse, UserRound,
  Apple, Calculator, ScanLine, Bot, Calendar, BookOpen,
  Sparkles, Award, Users, CheckCircle2, Menu, X, Mail, Phone, MapPin,
  Globe, Send, Camera, Star, Activity,
} from 'lucide-react';

const roles = [
  {
    icon: UserRound,
    title: 'Người dùng',
    desc: 'Tra cứu thực phẩm, lập thực đơn, đánh giá dinh dưỡng cá nhân — đăng ký miễn phí.',
    cta: 'Đăng ký miễn phí',
    action: 'register' as const,
    accent: 'from-emerald-500 to-teal-500',
    bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    badge: 'Tự đăng ký',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
  },
  {
    icon: HeartPulse,
    title: 'Bệnh nhân',
    desc: 'Theo dõi sức khỏe, đặt lịch khám, nhận thực đơn từ bác sĩ. Tài khoản do cơ sở y tế cấp.',
    cta: 'Đăng nhập',
    action: 'login' as const,
    accent: 'from-rose-500 to-pink-500',
    bg: 'from-rose-50 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/60',
    border: 'border-rose-200 dark:border-rose-800/50',
    badge: 'Cơ sở y tế cấp',
    badgeClass: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
  },
  {
    icon: Stethoscope,
    title: 'Bác sĩ',
    desc: 'Quản lý bệnh nhân, tư vấn, xây dựng thực đơn chuyên môn. Dành cho chuyên gia dinh dưỡng.',
    cta: 'Đăng nhập',
    action: 'login' as const,
    accent: 'from-sky-500 to-blue-500',
    bg: 'from-sky-50 to-blue-50 dark:from-sky-950/60 dark:to-blue-950/60',
    border: 'border-sky-200 dark:border-sky-800/50',
    badge: 'Chuyên gia',
    badgeClass: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300',
  },
];

const features = [
  {
    icon: Apple,
    title: 'CSDL dinh dưỡng Việt',
    desc: 'Hơn 500 thực phẩm theo chuẩn Viện Dinh dưỡng Quốc gia 2026, đầy đủ macro, vi chất, acid amin, acid béo.',
    color: 'from-emerald-500 to-teal-500',
    tag: 'Dữ liệu',
  },
  {
    icon: Calculator,
    title: 'Máy tính dinh dưỡng',
    desc: 'Tính BMI, TDEE, nhu cầu năng lượng và khẩu phần theo từng đối tượng, mục tiêu.',
    color: 'from-violet-500 to-purple-500',
    tag: 'Công cụ',
  },
  {
    icon: ScanLine,
    title: 'Nhận diện món ăn',
    desc: 'Quét ảnh món ăn bằng AI để tra cứu thành phần dinh dưỡng và lượng calo tức thì.',
    color: 'from-amber-500 to-orange-500',
    tag: 'AI',
  },
  {
    icon: Bot,
    title: 'Trợ lý AI 24/7',
    desc: 'Hỏi đáp dinh dưỡng, gợi ý thực đơn cá nhân hóa dựa trên tình trạng sức khỏe.',
    color: 'from-sky-500 to-blue-500',
    tag: 'AI',
  },
  {
    icon: Calendar,
    title: 'Đặt lịch & tư vấn',
    desc: 'Kết nối trực tiếp với bác sĩ dinh dưỡng, đặt lịch khám online hoặc tại phòng khám.',
    color: 'from-rose-500 to-pink-500',
    tag: 'Y tế',
  },
  {
    icon: BookOpen,
    title: 'Kiến thức chuẩn',
    desc: 'Thư viện bài viết, video hướng dẫn từ chuyên gia, cập nhật theo nghiên cứu mới nhất.',
    color: 'from-teal-500 to-cyan-500',
    tag: 'Học liệu',
  },
];

const stats = [
  { value: '500+', label: 'Thực phẩm Việt', icon: Apple },
  { value: '50+', label: 'Bác sĩ chuyên môn', icon: Stethoscope },
  { value: '10K+', label: 'Người dùng tin tưởng', icon: Users },
  { value: '4.9/5', label: 'Đánh giá hài lòng', icon: Star },
];

const testimonials = [
  {
    name: 'Nguyễn Thu Hà',
    role: 'Mẹ bỉm sữa, Hà Nội',
    quote: 'Ứng dụng giúp tôi xây dựng thực đơn cho cả gia đình, đặc biệt là chế độ ăn dặm cho bé. Dữ liệu thực phẩm Việt rất đầy đủ.',
    initial: 'H',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'BS. Trần Thị A',
    role: 'Bác sĩ dinh dưỡng',
    quote: 'Công cụ tuyệt vời để quản lý bệnh nhân từ xa. Tôi có thể theo dõi nhật ký ăn uống và điều chỉnh thực đơn nhanh chóng.',
    initial: 'A',
    color: 'from-sky-400 to-blue-500',
  },
  {
    name: 'Lê Văn Minh',
    role: 'Bệnh nhân tiểu đường',
    quote: 'Nhờ thực đơn cá nhân hóa và nhắc nhở từ bác sĩ, chỉ số đường huyết của tôi đã ổn định sau 3 tháng sử dụng.',
    initial: 'M',
    color: 'from-rose-400 to-pink-500',
  },
];

const partners = ['Viện Dinh dưỡng QG', 'Bộ Y tế', 'BV Bạch Mai', 'BV Chợ Rẫy', 'ĐH Y Hà Nội'];

const CIRC = 2 * Math.PI * 30;

export function LandingPage() {
  const navigate = useNavigate();
  const { resolved, toggle } = useTheme();
  const isDark = resolved === 'dark';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">

      {/* ── NAV ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm border-b border-slate-100 dark:border-slate-800'
            : 'bg-white/60 dark:bg-slate-950/50 backdrop-blur-md border-b border-white/40 dark:border-white/5'
        }`}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-[72px]' : 'h-20'}`}>
          <Link to="/" className="group flex items-center gap-3 flex-shrink-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="leading-tight flex-shrink-0">
              <div className="text-slate-900 dark:text-white tracking-tight whitespace-nowrap" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                Dinh Dưỡng Việt
              </div>
              <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 whitespace-nowrap">Hệ thống chăm sóc dinh dưỡng</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              ['features', 'Tính năng'],
              ['roles', 'Đối tượng'],
              ['how', 'Cách hoạt động'],
              ['testimonials', 'Đánh giá'],
              ['contact', 'Liên hệ'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="px-3.5 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                style={{ fontSize: '0.95rem' }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggle}
              title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all text-sm"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all text-sm"
            >
              Bắt đầu miễn phí
            </button>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <button onClick={toggle} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-4 space-y-1">
            {[
              ['features', 'Tính năng'],
              ['roles', 'Đối tượng'],
              ['how', 'Cách hoạt động'],
              ['testimonials', 'Đánh giá'],
              ['contact', 'Liên hệ'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="block w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition text-sm"
              >
                {label}
              </button>
            ))}
            <div className="pt-3 flex gap-2 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                onClick={() => navigate('/login')}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm"
              >
                Đăng ký
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 lg:min-h-screen flex items-center overflow-hidden">
        {/* layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950" />
        <div
          className="absolute inset-0 opacity-[0.25] dark:opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/50 dark:bg-emerald-600/20 rounded-full blur-3xl" />
        <div className="absolute top-32 -right-16 w-80 h-80 bg-teal-300/40 dark:bg-teal-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-200/30 dark:bg-emerald-700/15 rounded-full blur-3xl" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          {/* left copy */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              Nền tảng dinh dưỡng số #1 Việt Nam 2026
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[3.25rem] xl:text-6xl text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Dinh dưỡng{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent whitespace-nowrap">
                cá nhân hóa
              </span>
              <br />
              cho người Việt
            </h1>

            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Tra cứu thực phẩm, lập thực đơn khoa học, kết nối bác sĩ dinh dưỡng và theo dõi sức khỏe
              — tất cả trên một nền tảng theo chuẩn Viện Dinh dưỡng Quốc gia.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate('/register')}
                className="group px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all flex items-center gap-2 text-sm"
              >
                Bắt đầu miễn phí
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('how')}
                className="px-7 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-sm"
              >
                Xem cách hoạt động
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-slate-500 dark:text-slate-500">
              {[
                'Miễn phí dùng thử',
                'Không cần thẻ tín dụng',
                'Dữ liệu chuẩn Quốc gia',
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* right: dashboard mock */}
          <div className="relative lg:pl-6 mt-12 lg:mt-0">
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-300/40 dark:shadow-black/60 p-6 border border-slate-100 dark:border-slate-800">
              {/* profile row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    M
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 600 }}>
                      Nguyễn Văn Minh
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Hôm nay, Thứ Năm 12/6</div>
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs">
                  Ngày 12
                </div>
              </div>

              {/* calorie ring */}
              <div className="flex items-center gap-5 mb-5 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/40">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="30" fill="none" strokeWidth="7" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      strokeWidth="7"
                      strokeLinecap="round"
                      stroke="url(#kcalGrad)"
                      strokeDasharray={`${CIRC * 0.877} ${CIRC}`}
                    />
                    <defs>
                      <linearGradient id="kcalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 700 }}>
                      88%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 600 }}>
                    1.842 / 2.100 kcal
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Còn 258 kcal cho tối nay</div>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      P: 78g
                    </span>
                    <span className="text-xs bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full">
                      C: 220g
                    </span>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      F: 52g
                    </span>
                  </div>
                </div>
              </div>

              {/* meal log */}
              <div className="space-y-1">
                {[
                  { name: 'Phở bò sáng', time: '07:30', kcal: 420, dot: 'bg-emerald-500', txt: 'text-emerald-600 dark:text-emerald-400' },
                  { name: 'Cơm tấm sườn', time: '12:00', kcal: 580, dot: 'bg-teal-500', txt: 'text-teal-600 dark:text-teal-400' },
                  { name: 'Bún chả Hà Nội', time: '18:30', kcal: 510, dot: 'bg-amber-500', txt: 'text-amber-600 dark:text-amber-400' },
                ].map((meal) => (
                  <div
                    key={meal.name}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${meal.dot}`} />
                      <div>
                        <div className="text-slate-800 dark:text-slate-200 text-sm" style={{ fontWeight: 500 }}>
                          {meal.name}
                        </div>
                        <div className="text-xs text-slate-400">{meal.time}</div>
                      </div>
                    </div>
                    <span className={`text-sm ${meal.txt}`} style={{ fontWeight: 600 }}>
                      {meal.kcal} kcal
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* floating: streak */}
            <div className="absolute -bottom-5 -left-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 p-3.5 border border-slate-100 dark:border-slate-800 flex items-center gap-3 min-w-[155px]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Award className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <div className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 600 }}>
                  Streak 12 ngày 🔥
                </div>
                <div className="text-xs text-slate-500">Tuyệt vời!</div>
              </div>
            </div>

            {/* floating: ai scan */}
            <div className="absolute -top-5 -right-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 p-3.5 border border-slate-100 dark:border-slate-800 flex items-center gap-3 min-w-[160px]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <ScanLine style={{ width: 18, height: 18 }} className="text-white" />
              </div>
              <div>
                <div className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 600 }}>
                  AI nhận diện
                </div>
                <div className="text-xs text-slate-500">Quét ảnh món ăn</div>
              </div>
            </div>

            {/* floating: doctor appointment */}
            <div className="absolute bottom-24 -right-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 p-3.5 border border-slate-100 dark:border-slate-800 min-w-[165px]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Stethoscope style={{ width: 13, height: 13 }} className="text-white" />
                </div>
                <span className="text-xs text-slate-500">BS. Trần Thị A</span>
              </div>
              <div className="text-slate-900 dark:text-white text-xs" style={{ fontWeight: 600 }}>
                Lịch hẹn Thứ 6
              </div>
              <div className="text-xs text-rose-500 mt-0.5">14:00 — Tư vấn dinh dưỡng</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="relative pt-10 pb-8 bg-white dark:bg-slate-950">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-black/30 p-6 sm:p-8">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`text-center px-2 ${i !== 0 ? 'md:border-l border-slate-100 dark:border-slate-800' : ''}`}
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl md:text-3xl bg-gradient-to-br from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-1" style={{ fontWeight: 700 }}>
                  {s.value}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full mb-4 text-sm">
              Tính năng nổi bật
            </div>
            <h2 className="text-3xl md:text-4xl text-slate-900 dark:text-white mb-4">
              Mọi công cụ bạn cần cho hành trình dinh dưỡng
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Từ tra cứu thực phẩm đến tư vấn chuyên môn — Dinh Dưỡng Việt cung cấp giải pháp toàn diện cho mọi đối tượng.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-transparent hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.04] bg-gradient-to-br ${f.color} transition-opacity duration-300 rounded-2xl`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-md`}>
                      <f.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section id="roles" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full mb-4 text-sm">
              Dành cho mọi đối tượng
            </div>
            <h2 className="text-3xl md:text-4xl text-slate-900 dark:text-white mb-4">
              Một nền tảng — dành cho mọi đối tượng
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Dù bạn là người dùng phổ thông, bệnh nhân hay chuyên gia y tế — Dinh Dưỡng Việt đều có giải pháp phù hợp.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((r) => (
              <div
                key={r.title}
                className={`group relative p-7 rounded-3xl border bg-gradient-to-br ${r.bg} ${r.border} hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${r.accent} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <r.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs ${r.badgeClass}`}>{r.badge}</span>
                </div>
                <h3 className="text-slate-900 dark:text-white mb-3">{r.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm flex-1">{r.desc}</p>
                <button
                  onClick={() => navigate(r.action === 'register' ? '/register' : '/login')}
                  className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r ${r.accent} text-white hover:opacity-90 hover:shadow-lg transition-all text-sm`}
                >
                  {r.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 dark:text-slate-500 mt-8 text-sm">
            Là quản trị viên hệ thống?{' '}
            <button onClick={() => navigate('/login')} className="text-emerald-600 dark:text-emerald-400 hover:underline">
              Đăng nhập tại đây
            </button>
            .
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full mb-4 text-sm">
              Cách hoạt động
            </div>
            <h2 className="text-3xl md:text-4xl text-slate-900 dark:text-white mb-4">Ba bước để bắt đầu</h2>
            <p className="text-slate-600 dark:text-slate-400">Dễ dàng, nhanh chóng — chỉ mất vài phút để thiết lập hồ sơ.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+3rem)] right-[calc(16.67%+3rem)] h-px bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-200 dark:from-emerald-800 dark:via-teal-700 dark:to-emerald-800" />

            {[
              {
                step: '01',
                title: 'Tạo tài khoản',
                desc: 'Đăng ký miễn phí, chọn vai trò và hoàn tất hồ sơ sức khỏe cá nhân.',
                icon: UserRound,
                color: 'from-emerald-500 to-teal-600',
                glow: 'rgba(16,185,129,0.25)',
              },
              {
                step: '02',
                title: 'Đánh giá & lập kế hoạch',
                desc: 'Hệ thống đánh giá tình trạng dinh dưỡng và gợi ý thực đơn phù hợp.',
                icon: Calculator,
                color: 'from-violet-500 to-purple-600',
                glow: 'rgba(139,92,246,0.25)',
              },
              {
                step: '03',
                title: 'Theo dõi & cải thiện',
                desc: 'Ghi nhật ký, nhận tư vấn từ bác sĩ và theo dõi tiến độ mỗi ngày.',
                icon: Activity,
                color: 'from-rose-500 to-pink-600',
                glow: 'rgba(244,63,94,0.25)',
              },
            ].map((s) => (
              <div key={s.step} className="relative text-center group">
                <div className="relative mx-auto w-[104px] h-[104px] mb-6">
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: s.glow }}
                  />
                  <div
                    className={`relative w-full h-full rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300`}
                  >
                    <s.icon className="w-11 h-11 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-current flex items-center justify-center shadow-md"
                    style={{ borderColor: s.color.includes('emerald') ? '#10b981' : s.color.includes('violet') ? '#8b5cf6' : '#f43f5e' }}
                  >
                    <span
                      className="text-xs"
                      style={{
                        fontWeight: 700,
                        color: s.color.includes('emerald') ? '#10b981' : s.color.includes('violet') ? '#8b5cf6' : '#f43f5e',
                      }}
                    >
                      {s.step}
                    </span>
                  </div>
                </div>
                <h3 className="text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm max-w-[240px] mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all text-sm"
            >
              Bắt đầu ngay hôm nay <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full mb-4 text-sm">
              Người dùng nói gì
            </div>
            <h2 className="text-3xl md:text-4xl text-slate-900 dark:text-white mb-4">
              Được tin dùng bởi hàng nghìn người Việt
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-slate-800/60 p-7 rounded-3xl border border-slate-100 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 flex-shrink-0">
                  <span className="text-white" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>
                    "
                  </span>
                </div>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed text-sm flex-1">{t.quote}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm flex-shrink-0`}
                    style={{ fontWeight: 600 }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 600 }}>
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* partners strip */}
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="text-center text-sm text-slate-500 dark:text-slate-500 mb-7">
              Đối tác &amp; chứng nhận uy tín
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {partners.map((p) => (
                <div
                  key={p}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-12 md:p-16 text-center text-white">
            <div className="absolute -top-28 -right-28 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-2xl rotate-12" />
            <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/10 rounded-xl -rotate-6" />

            <div className="relative">
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {[
                  { icon: Users, label: '10K+ người dùng' },
                  { icon: Star, label: '4.9/5 đánh giá' },
                  { icon: Stethoscope, label: '50+ bác sĩ' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl text-sm"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </div>
                ))}
              </div>

              <h2 className="text-3xl md:text-4xl mb-4">Sẵn sàng cải thiện sức khỏe của bạn?</h2>
              <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
                Tham gia cộng đồng hơn 10.000 người Việt đang xây dựng lối sống lành mạnh mỗi ngày.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-3.5 bg-white text-emerald-700 rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center gap-2 text-sm"
                  style={{ fontWeight: 600 }}
                >
                  Đăng ký miễn phí <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3.5 border border-white/40 text-white rounded-2xl hover:bg-white/15 transition text-sm"
                >
                  Đã có tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-slate-900 text-slate-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white text-sm" style={{ fontWeight: 700 }}>
                    Dinh Dưỡng Việt
                  </div>
                  <div className="text-xs text-emerald-400/70">Hệ thống dinh dưỡng số</div>
                </div>
              </div>
              <p className="text-slate-500 leading-relaxed text-sm mb-5">
                Nền tảng dinh dưỡng cá nhân hóa chuẩn Viện Dinh dưỡng Quốc gia, dành cho người Việt.
              </p>
              <div className="flex gap-2">
                {[Globe, Send, Camera].map((Ic, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition"
                  >
                    <Ic className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* product */}
            <div>
              <div className="text-white mb-5 text-sm" style={{ fontWeight: 600 }}>
                Sản phẩm
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  ['features', 'Tính năng'],
                  ['roles', 'Đối tượng'],
                ].map(([id, label]) => (
                  <li key={id}>
                    <button onClick={() => scrollTo(id)} className="hover:text-emerald-400 transition">
                      {label}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={() => navigate('/register')} className="hover:text-emerald-400 transition">
                    Đăng ký
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/login')} className="hover:text-emerald-400 transition">
                    Đăng nhập
                  </button>
                </li>
              </ul>
            </div>

            {/* company */}
            <div>
              <div className="text-white mb-5 text-sm" style={{ fontWeight: 600 }}>
                Công ty
              </div>
              <ul className="space-y-3 text-sm">
                {['Về chúng tôi', 'Đối tác', 'Tuyển dụng', 'Điều khoản'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-emerald-400 transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* contact */}
            <div>
              <div className="text-white mb-5 text-sm" style={{ fontWeight: 600 }}>
                Liên hệ
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  hello@dinhduongviet.vn
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  1900 1234
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Số 48 Tăng Bạt Hổ, Hai Bà Trưng, Hà Nội
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-3 text-slate-500 text-sm">
            <div>© 2026 Dinh Dưỡng Việt. Mọi quyền được bảo lưu.</div>
            <div className="flex gap-5">
              {['Bảo mật', 'Điều khoản', 'Cookies'].map((item) => (
                <a key={item} href="#" className="hover:text-emerald-400 transition">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
