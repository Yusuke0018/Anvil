'use client';

interface WelcomeBackModalProps {
  missedDays: number;
  decayAmount: number;
  onDismiss: () => void;
}

export default function WelcomeBackModal({ missedDays, decayAmount, onDismiss }: WelcomeBackModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-8"
      onClick={onDismiss}
    >
      <div
        className="bg-bg-card border border-accent/20 rounded-2xl p-6 w-full max-w-sm relative modal-enter"
        onClick={e => e.stopPropagation()}
      >
        {/* 炎の演出 */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-3" style={{ animation: 'anvil-strike 0.5s ease-out 0.2s both' }}>
            🔥
          </div>
          <h2
            className="text-xl font-bold text-accent"
            style={{
              animation: 'title-burst 0.5s ease-out 0.4s both',
              textShadow: '0 0 16px rgba(255,107,43,0.4)',
            }}
          >
            おかえり、鍛冶師よ。
          </h2>
        </div>

        {/* 不在情報 */}
        <div
          className="bg-bg-surface rounded-lg p-4 mb-4 space-y-2"
          style={{ animation: 'fade-in 0.3s ease-out 0.6s both' }}
        >
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">不在日数</span>
            <span className="text-text-primary font-medium">{missedDays}日</span>
          </div>
          {decayAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">覚悟ゲージ減衰</span>
              <span className="text-danger font-medium">-{decayAmount}</span>
            </div>
          )}
        </div>

        {/* 復帰チャレンジ案内 */}
        <div
          className="text-center mb-4"
          style={{ animation: 'fade-in 0.3s ease-out 0.8s both' }}
        >
          <p className="text-xs text-text-secondary">
            復帰チャレンジ開始: 3日連続記録で特別称号獲得！
          </p>
        </div>

        {/* ボタン */}
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-accent text-white rounded-lg font-bold text-sm active:scale-[0.98] transition-transform"
          style={{ animation: 'fade-in 0.3s ease-out 1.0s both' }}
        >
          炉に再び火を灯そう
        </button>
      </div>
    </div>
  );
}
