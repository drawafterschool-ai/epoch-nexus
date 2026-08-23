import React, { useState } from 'react';
import { Compass, Key, Lock, Unlock, Ship } from 'lucide-react';

interface RenaissanceMapSimProps {
  isRunning: boolean;
  testPassed: boolean;
}

export const RenaissanceMapSim: React.FC<RenaissanceMapSimProps> = ({ testPassed }) => {
  const [shiftKey, setShiftKey] = useState<number>(3);
  const rawText = "ALLIANCE WITH VENICE";
  
  // Caesar encode live
  const caesarEncode = (str: string, shift: number) => {
    return str.split('').map(ch => {
      if (ch >= 'A' && ch <= 'Z') {
        return String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      return ch;
    }).join('');
  };

  const encryptedText = caesarEncode(rawText, shiftKey);

  return (
    <div className="relative flex flex-col h-full bg-[#121826] rounded-lg border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-semibold text-amber-400">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Mediterranean Maritime Routes & Cryptographic Intercept Terminal</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
          <Ship className="w-3.5 h-3.5" />
          <span>4 Convoys Active</span>
        </div>
      </div>

      <div className="relative flex-1 p-3 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
        {/* Maritime Map SVG Canvas */}
        <div className="relative bg-[#0d1726] rounded-md border border-slate-800/80 p-2 overflow-hidden flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between mb-1">
            <span>NAUTICAL CHART (1520 CE)</span>
            <span className="text-amber-400">Aegean & Adriatic Sea</span>
          </div>

          <svg viewBox="0 0 300 160" className="w-full h-36">
            {/* Water ripples / background */}
            <rect width="300" height="160" fill="#0f1f38" />
            
            {/* Coastlines */}
            {/* Italy/Venice */}
            <path d="M 20,10 Q 50,40 70,80 Q 90,120 70,150" fill="none" stroke="#334155" strokeWidth="12" />
            {/* Greece/Balkans */}
            <path d="M 170,10 Q 200,50 190,90 Q 220,130 250,150" fill="none" stroke="#334155" strokeWidth="14" />
            {/* Alexandria Coast */}
            <path d="M 120,155 Q 200,145 290,155" fill="none" stroke="#334155" strokeWidth="10" />

            {/* Trade Route Lines */}
            <line x1="60" y1="30" x2="190" y2="70" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" />
            <line x1="190" y1="70" x2="230" y2="135" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
            <line x1="60" y1="30" x2="180" y2="145" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" />

            {/* Ports */}
            <circle cx="60" cy="30" r="4" fill="#38bdf8" />
            <text x="68" y="32" fill="#bae6fd" fontSize="9" fontWeight="bold">Venice</text>

            <circle cx="190" cy="70" r="4" fill="#f59e0b" />
            <text x="198" y="72" fill="#fde68a" fontSize="9" fontWeight="bold">Constantinople</text>

            <circle cx="230" cy="135" r="4" fill="#34d399" />
            <text x="175" y="145" fill="#a7f3d0" fontSize="9" fontWeight="bold">Alexandria</text>

            {/* Animated Merchant Galley */}
            <g className="animate-float">
              <rect x="120" y="45" width="16" height="8" rx="2" fill="#d97706" />
              <polygon points="128,37 128,45 136,45" fill="#fef3c7" />
            </g>
          </svg>

          {/* Trade manifest metrics */}
          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-300">
            <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
              <div className="text-slate-400">Silk Galleys</div>
              <div className="font-mono font-bold text-amber-400">100 bales (10% tariff)</div>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
              <div className="text-slate-400">Spices (Pepper)</div>
              <div className="font-mono font-bold text-emerald-400">250 sacks (15% tariff)</div>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
              <div className="text-slate-400">Murano Glass</div>
              <div className="font-mono font-bold text-cyan-400">80 crates (5% tariff)</div>
            </div>
          </div>
        </div>

        {/* Cryptographic Dispatch Decryptor */}
        <div className="bg-slate-900/60 rounded-md border border-slate-800 p-3 flex flex-col justify-between text-xs">
          <div>
            <div className="flex items-center justify-between text-amber-400 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Cipher Disk & Intercept</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">Polyalphabetic Vigenère / Caesar</span>
            </div>

            {/* Cipher shift slider */}
            <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Rotational Shift Key (K):</span>
                <span className="font-mono font-bold text-amber-400 text-sm">+{shiftKey}</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={shiftKey}
                onChange={(e) => setShiftKey(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Intercepted ciphertext */}
            <div className="space-y-2">
              <div className="bg-slate-950 p-2 rounded border border-rose-900/40">
                <div className="text-[10px] text-rose-400 uppercase font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Intercepted Ciphertext
                </div>
                <div className="font-mono text-rose-200 tracking-wider mt-0.5 text-xs">
                  {encryptedText}
                </div>
              </div>

              {/* Decrypted plaintext */}
              <div className="bg-slate-950 p-2 rounded border border-emerald-900/40">
                <div className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> Decrypted Diplomatic Cable
                </div>
                <div className="font-mono text-emerald-300 font-bold tracking-wider mt-0.5 text-xs">
                  {testPassed ? rawText : "••••••••••••••••••••"}
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800">
            {testPassed
              ? "✓ Naval dispatch verified: Venetian fleet authorized for passage."
              : "Awaiting algorithmic decryption in code editor..."}
          </div>
        </div>
      </div>
    </div>
  );
};
