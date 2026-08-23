import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Users, CheckCircle2, XCircle } from 'lucide-react';

interface AgoraSimProps {
  isRunning?: boolean;
  testPassed?: boolean;
}

export const AgoraSim: React.FC<AgoraSimProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [vetoActive, setVetoActive] = useState(false);
  const yesVotes = 4200;
  const noVotes = 1800;
  const quorum = 6000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    // Generate citizen dots on the Pnyx hillside
    const citizens: Array<{ x: number; y: number; color: string; vote: 'yes' | 'no' | 'undecided' }> = [];
    const totalDots = 160;
    for (let i = 0; i < totalDots; i++) {
      const angle = Math.random() * Math.PI;
      const radius = 40 + Math.random() * 110;
      const cx = canvas.width / 2 + Math.cos(angle) * radius;
      const cy = canvas.height - 40 - Math.sin(angle) * (radius * 0.7);
      const isYes = i < 110;
      citizens.push({
        x: cx,
        y: cy,
        color: isYes ? '#3b82f6' : '#ef4444',
        vote: isYes ? 'yes' : 'no'
      });
    }

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background: Athenian Sky and Pnyx Rock
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant Acropolis silhouette
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.rect(canvas.width * 0.65, 30, 80, 25);
      ctx.fill();
      // Parthenon pillars
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      for (let p = 0; p < 7; p++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.65 + 6 + p * 11, 30);
        ctx.lineTo(canvas.width * 0.65 + 6 + p * 11, 55);
        ctx.stroke();
      }

      // Pnyx Hill Stone Terrace (Bema podium)
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height - 20, canvas.width * 0.45, 70, 0, 0, Math.PI * 2);
      ctx.fill();

      // Speaker's Stone Podium (Bema)
      ctx.fillStyle = '#d97706';
      ctx.fillRect(canvas.width / 2 - 25, canvas.height - 70, 50, 30);
      ctx.fillStyle = '#fef3c7';
      ctx.font = '10px sans-serif';
      ctx.fillText('BEMA', canvas.width / 2 - 14, canvas.height - 50);

      // Draw Citizens
      citizens.forEach((c, idx) => {
        const floatOffset = Math.sin(tick * 0.05 + idx) * 2;
        ctx.fillStyle = vetoActive ? '#64748b' : (c.vote === 'yes' ? '#60a5fa' : '#f87171');
        ctx.beginPath();
        ctx.arc(c.x, c.y + floatOffset, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Voting Urns (Kaddoi)
      // Yes Urn
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(50, canvas.height - 75, 45, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('NAI (YES)', 47, canvas.height - 82);
      ctx.fillText(`${yesVotes}`, 55, canvas.height - 45);

      // No Urn
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(canvas.width - 95, canvas.height - 75, 45, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('OU (NO)', canvas.width - 96, canvas.height - 82);
      ctx.fillText(`${noVotes}`, canvas.width - 85, canvas.height - 45);

      // Veto Banner
      if (vetoActive) {
        ctx.fillStyle = 'rgba(220, 38, 38, 0.85)';
        ctx.fillRect(canvas.width / 2 - 120, 70, 240, 40);
        ctx.strokeStyle = '#fca5a5';
        ctx.strokeRect(canvas.width / 2 - 120, 70, 240, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('⚡ TRIBUNICIAN VETO ACTIVE ⚡', canvas.width / 2 - 105, 95);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [vetoActive, yesVotes, noVotes]);

  const total = yesVotes + noVotes;
  const quorumMet = total >= quorum;
  const passed = !vetoActive && quorumMet && yesVotes > noVotes;

  return (
    <div className="relative flex flex-col h-full bg-[#121826] rounded-lg border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-semibold text-amber-400">
          <Users className="w-4 h-4 text-amber-400" />
          <span>Athenian Pnyx Assembly & Roman Senate Simulation</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVetoActive(!vetoActive)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
              vetoActive
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {vetoActive ? 'Lift Tribune Veto' : 'Trigger Tribune Veto'}
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-[220px]">
        <canvas ref={canvasRef} width={500} height={230} className="w-full h-full block" />

        {/* Live Status Overlay */}
        <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur border border-slate-800 rounded p-2 text-xs space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Turnout / Quorum:</span>
            <span className={`font-mono font-bold ${quorumMet ? 'text-emerald-400' : 'text-amber-400'}`}>
              {total.toLocaleString()} / {quorum.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Decree Status:</span>
            <span className={`font-bold flex items-center gap-1 ${
              vetoActive ? 'text-rose-400' : passed ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {vetoActive ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" /> VETOED
                </>
              ) : passed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> RATIFIED
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" /> FAILED
                </>
              )}
            </span>
          </div>
        </div>

        {/* Ostracism Shard Container */}
        <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur border border-slate-800 rounded p-2 text-[11px]">
          <div className="text-amber-400 font-bold mb-1 flex items-center gap-1">
            <span>🏺 Ostracism Shards (Ostrakon)</span>
          </div>
          <div className="text-slate-300 space-y-0.5">
            <div>Themistocles: <span className="font-mono text-rose-400">3,500</span></div>
            <div>Aristides: <span className="font-mono text-slate-400">2,600</span></div>
            <div>Xanthippus: <span className="font-mono text-slate-400">400</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
