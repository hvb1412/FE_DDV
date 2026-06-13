import { useState } from 'react';
import { Award, Gift, Star, Trophy, Sparkles, History, TrendingUp, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const TIERS = [
  { name: 'Đồng', emoji: '🥉', at: 0 },
  { name: 'Bạc', emoji: '🥈', at: 100 },
  { name: 'Vàng', emoji: '🥇', at: 500 },
  { name: 'Kim cương', emoji: '💎', at: 1000 },
];

const badgeMeta: Record<string, string> = {
  'Yêu rau xanh': 'Hoàn thành 10 bữa có rau xanh trong tuần',
  'Bền bỉ': 'Đăng nhập đều đặn 14 ngày liên tiếp',
  'Streak 7 ngày': 'Duy trì học bài 7 ngày liên tiếp',
  'Sao mới': 'Đạt 100 điểm đầu tiên',
  'Vàng tháng 5': 'Vào top 100 người dùng tháng 5',
  'Đạt mục tiêu': 'Hoàn thành 1 mục tiêu cân nặng',
  'Streak 30 ngày': 'Duy trì học bài 30 ngày liên tiếp',
  'Kim cương': 'Đạt 1000 điểm',
};

const rewards = [
  { id: 1, name: 'Voucher khám dinh dưỡng', cost: 500, partner: 'Phòng khám Dinh Dưỡng Việt', emoji: '🩺', hot: true },
  { id: 2, name: 'Túi hạt dinh dưỡng 500g', cost: 200, partner: 'Healthy Mart', emoji: '🌰', hot: false },
  { id: 3, name: 'Sách "Ăn lành sống khoẻ"', cost: 350, partner: 'NXB Y học', emoji: '📚', hot: false },
  { id: 4, name: 'Bình nước thông minh', cost: 800, partner: 'HydroPlus', emoji: '💧', hot: true },
  { id: 5, name: 'Khoá học online 1 tháng', cost: 600, partner: 'NutriLearn', emoji: '🎓', hot: false },
  { id: 6, name: 'Gói detox 7 ngày', cost: 1000, partner: 'GreenJuice', emoji: '🥤', hot: false },
  { id: 7, name: 'Combo cân + máy đo BP', cost: 1500, partner: 'Omron VN', emoji: '⚖️', hot: true },
  { id: 8, name: 'Áo thể thao DDV', cost: 450, partner: 'Dinh Dưỡng Việt', emoji: '👕', hot: false },
];

const badges = [
  { emoji: '🥗', name: 'Yêu rau xanh', earned: true },
  { emoji: '💪', name: 'Bền bỉ', earned: true },
  { emoji: '🔥', name: 'Streak 7 ngày', earned: true },
  { emoji: '⭐', name: 'Sao mới', earned: true },
  { emoji: '🏆', name: 'Vàng tháng 5', earned: true },
  { emoji: '🎯', name: 'Đạt mục tiêu', earned: false },
  { emoji: '🌟', name: 'Streak 30 ngày', earned: false },
  { emoji: '💎', name: 'Kim cương', earned: false },
];

const history = [
  { action: 'Hoàn thành bài học', points: 10, time: 'Hôm nay 09:15' },
  { action: 'Tuân thủ uống thuốc 7 ngày', points: 50, time: 'Hôm qua' },
  { action: 'Ghi nhận cân nặng', points: 5, time: '18/05' },
  { action: 'Đổi voucher hạt dinh dưỡng', points: -200, time: '15/05' },
  { action: 'Đăng nhập liên tục 7 ngày', points: 20, time: '14/05' },
];

export function PatientRewards() {
  const [points, setPoints] = useState(245);
  const [showHistory, setShowHistory] = useState(false);
  const [redeemed, setRedeemed] = useState<number[]>([]);
  const [pointHistory, setPointHistory] = useState(history);
  const [confirmRedeem, setConfirmRedeem] = useState<typeof rewards[number] | null>(null);
  const [activeBadge, setActiveBadge] = useState<typeof badges[number] | null>(null);

  const currentTier = [...TIERS].reverse().find((t) => points >= t.at)!;
  const nextTier = TIERS.find((t) => t.at > points) || null;
  const tierProgress = nextTier ? Math.min(100, Math.round(((points - currentTier.at) / (nextTier.at - currentTier.at)) * 100)) : 100;
  const toNext = nextTier ? nextTier.at - points : 0;
  const monthEarned = pointHistory.filter((h) => h.points > 0).reduce((s, h) => s + h.points, 0);

  const askRedeem = (r: typeof rewards[number]) => {
    if (points < r.cost) {
      toast.error('Bạn chưa đủ điểm cho phần thưởng này');
      return;
    }
    setConfirmRedeem(r);
  };

  const doRedeem = () => {
    if (!confirmRedeem) return;
    const r = confirmRedeem;
    setPoints((p) => p - r.cost);
    setRedeemed((prev) => [...prev, r.id]);
    setPointHistory((prev) => [{ action: `Đổi quà: ${r.name}`, points: -r.cost, time: 'Vừa xong' }, ...prev]);
    setConfirmRedeem(null);
    toast.success(`Đã đổi "${r.name}"! Kiểm tra email để nhận mã.`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top: Points hero + quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-2xl p-4 sm:p-6 text-white shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-white/90 flex items-center gap-1"><Sparkles size={14} /> Điểm hiện có</p>
              <p className="mt-2 flex items-baseline gap-2">
                <Star size={28} className="text-yellow-200 sm:hidden" />
                <Star size={36} className="text-yellow-200 hidden sm:inline" />
                <span className="text-5xl sm:text-6xl">{points}</span>
              </p>
              <p className="text-xs sm:text-sm text-white/80 mt-1">{nextTier ? `Cần ${toNext} điểm nữa để lên hạng ${nextTier.emoji} ${nextTier.name}` : 'Bạn đã đạt hạng cao nhất 💎'}</p>
            </div>
            <Trophy size={64} className="text-white/30 flex-shrink-0 hidden sm:block sm:size-20" />
          </div>
          <div className="h-3 bg-white/20 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${tierProgress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-white/90 mt-2 gap-1 flex-wrap">
            {TIERS.map((t) => (
              <span key={t.name} className={`${currentTier.name === t.name ? 'text-white' : ''} whitespace-nowrap`}>{currentTier.name === t.name && '🎯 '}{t.emoji} {t.name} ({t.at})</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Đã đổi</p>
              <Gift size={16} className="text-pink-500" />
            </div>
            <p className="text-gray-900 mt-1" style={{ fontSize: '1.5rem' }}>{redeemed.length} <span className="text-sm text-gray-500">phần thưởng</span></p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Huy hiệu</p>
              <Award size={16} className="text-amber-500" />
            </div>
            <p className="text-gray-900 mt-1" style={{ fontSize: '1.5rem' }}>{badges.filter((b) => b.earned).length}<span className="text-sm text-gray-500">/{badges.length}</span></p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Tháng này</p>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <p className="text-gray-900 mt-1" style={{ fontSize: '1.5rem' }}>+{monthEarned} <span className="text-sm text-emerald-600">điểm</span></p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rewards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900 flex items-center gap-2"><Gift size={20} className="text-pink-600" /> Đổi quà</h3>
            <button onClick={() => setShowHistory(true)} className="text-sm text-emerald-600 hover:underline">Lịch sử đổi quà</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center relative" style={{ fontSize: '3rem' }}>
                  {r.emoji}
                  {r.hot && <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white">🔥 HOT</span>}
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">{r.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{r.partner}</p>
                  <button
                    onClick={() => askRedeem(r)}
                    disabled={points < r.cost || redeemed.includes(r.id)}
                    className={`w-full mt-2 px-2 py-2 rounded-lg text-xs flex items-center justify-center gap-1 ${
                      redeemed.includes(r.id) ? 'bg-gray-100 text-gray-500 cursor-not-allowed' :
                      points >= r.cost ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {redeemed.includes(r.id) ? '✓ Đã đổi' : <><Star size={12} /> {r.cost} điểm</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: badges + history */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-gray-900 mb-3 flex items-center gap-2"><Award size={18} className="text-amber-500" /> Huy hiệu</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {badges.map((b, i) => (
                <button key={i} onClick={() => setActiveBadge(b)} className="text-center group">
                  <div className={`aspect-square rounded-2xl flex items-center justify-center text-2xl transition group-hover:scale-105 ${b.earned ? 'bg-gradient-to-br from-amber-100 to-yellow-200' : 'bg-gray-100 grayscale opacity-40'}`}>
                    {b.emoji}
                  </div>
                  <p className="text-[10px] text-gray-700 mt-1 leading-tight">{b.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-gray-900 mb-3 flex items-center gap-2"><History size={18} /> Hoạt động điểm</h3>
            <div className="space-y-2">
              {pointHistory.slice(0, 6).map((h, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 truncate">{h.action}</p>
                    <p className="text-[10px] text-gray-500">{h.time}</p>
                  </div>
                  <span className={`text-sm ${h.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {h.points > 0 ? '+' : ''}{h.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Redeem confirmation */}
      {confirmRedeem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirmRedeem(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-gray-900">Xác nhận đổi quà</h3>
              <button onClick={() => setConfirmRedeem(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={16} /></button>
            </div>
            <div className="p-5">
              <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center" style={{ fontSize: '4rem' }}>{confirmRedeem.emoji}</div>
              <p className="text-gray-900 mt-3">{confirmRedeem.name}</p>
              <p className="text-xs text-gray-500">Đối tác: {confirmRedeem.partner}</p>
              <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm space-y-1">
                <div className="flex justify-between text-gray-600"><span>Điểm hiện có</span><span>{points}</span></div>
                <div className="flex justify-between text-rose-600"><span>Chi phí</span><span>-{confirmRedeem.cost}</span></div>
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex justify-between text-gray-900"><span>Còn lại sau khi đổi</span><span>{points - confirmRedeem.cost}</span></div>
              </div>
              <p className="text-[11px] text-gray-500 mt-3">Mã ưu đãi sẽ được gửi đến email đăng ký. Một số phần thưởng có thể yêu cầu xác minh thông tin.</p>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
              <button onClick={() => setConfirmRedeem(null)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">Huỷ</button>
              <button onClick={doRedeem} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={14} /> Xác nhận đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge detail */}
      {activeBadge && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setActiveBadge(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-xs max-h-[90vh] overflow-y-auto p-5 shadow-2xl text-center">
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl ${activeBadge.earned ? 'bg-gradient-to-br from-amber-100 to-yellow-200' : 'bg-gray-100 grayscale opacity-50'}`}>
              {activeBadge.emoji}
            </div>
            <p className="text-gray-900 mt-3">{activeBadge.name}</p>
            <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full border ${activeBadge.earned ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
              {activeBadge.earned ? '✓ Đã đạt' : 'Chưa đạt'}
            </span>
            <p className="text-sm text-gray-600 mt-3">{badgeMeta[activeBadge.name] || 'Chi tiết huy hiệu sẽ được cập nhật.'}</p>
            <button onClick={() => setActiveBadge(null)} className="w-full mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">Đóng</button>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowHistory(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto p-5 shadow-xl">
            <h3 className="text-gray-900 mb-3">Lịch sử đổi quà</h3>
            {redeemed.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">Bạn chưa đổi phần thưởng nào</p>
            ) : (
              <div className="space-y-2">
                {redeemed.map((id) => {
                  const r = rewards.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <div className="text-2xl">{r.emoji}</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">-{r.cost} điểm</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={() => setShowHistory(false)} className="w-full mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
