'use client';

interface WelcomeBackModalProps {
  missedDays: number;
  decayAmount: number;
  onDismiss: () => void;
}

export default function WelcomeBackModal({ missedDays, decayAmount, onDismiss }: WelcomeBackModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center rpg-modal-overlay px-8"
      onClick={onDismiss}
    >
      <div
        className="rpg-modal p-6 w-full max-w-sm relative modal-enter"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-5xl mb-3" style={{ animation: 'anvil-strike 0.5s ease-out 0.2s both' }}>
            🔥
          </div>
          <h2
            className="text-xl font-bold text-accent"
            style={{
              animation: 'title-burst 0.5s ease-out 0.4s both',
              textShadow: '0 0 16px rgba(232,160,32,0.4)',
            }}
          >
            おかえり、冒険者よ。
          </h2>
        </div>

        <div
          className="rpg-panel p-4 mb-4 space-y-2"
          style={{ animation: 'fade-in 0.3s ease-out 0.6s both' }}
        >
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">不在日数</span>
            <span className="text-text-primary font-medium pixel-num">{missedDays}日</span>
          </div>
          {decayAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">覚悟ゲージ減衰</span>
              <span className="text-danger font-medium pixel-num">-{decayAmount}</span>
            </div>
          )}
        </div>

        <div
          className="text-center mb-4"
          style={{ animation: 'fade-in 0.3s ease-out 0.8s both' }}
        >
          <p className="text-xs text-text-secondary">
            復帰チャレンジ開始: 3日連続記録で特別称号獲得！
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="w-full py-3 rpg-btn rpg-btn-primary text-sm"
          style={{ animation: 'fade-in 0.3s ease-out 1.0s both' }}
        >
          再び冒険に出発しよう
        </button>
      </div>
    </div>
  );
}
