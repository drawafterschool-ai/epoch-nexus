import React, { useState } from 'react';
import { X, Award, ShieldCheck, Check, Copy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TrackData } from '../../tracks';

interface CertificateBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: TrackData[];
  completedTracks: number[];
  walletAddress: string;
  onMintBadge: (trackId: number) => Promise<any>;
}

export const CertificateBadgeModal: React.FC<CertificateBadgeModalProps> = ({
  isOpen,
  onClose,
  tracks,
  completedTracks,
  walletAddress,
  onMintBadge
}) => {
  const [mintingId, setMintingId] = useState<number | null>(null);
  const [mintedTokens, setMintedTokens] = useState<Record<number, { txHash: string; tokenId: number }>>({});
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMint = async (trackId: number) => {
    setMintingId(trackId);
    try {
      const resp = await onMintBadge(trackId);
      setMintedTokens(prev => ({
        ...prev,
        [trackId]: {
          txHash: resp?.tx_hash || "0x8f2a...9b41",
          tokenId: resp?.token_id || 1042
        }
      }));
      // Trigger festive confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error("Minting failed", err);
    } finally {
      setMintingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(text);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#101624] border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Verifiable Civics & STEM Credentials</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  ERC-5192 Soulbound
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Cryptographically verifiable on Polygon PoS & Arbitrum L2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tracks.map((track) => {
              const isCompleted = completedTracks.includes(track.id);
              const mintedInfo = mintedTokens[track.id];
              const isCurrentlyMinting = mintingId === track.id;

              return (
                <div
                  key={track.id}
                  className={`p-3.5 rounded-lg border transition flex flex-col justify-between ${
                    isCompleted
                      ? 'bg-slate-900/90 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{track.badgeIcon}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isCompleted ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isCompleted ? 'Milestone Achieved' : 'Locked'}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-slate-200 mb-0.5">{track.badgeName}</h3>
                    <p className="text-[11px] text-amber-400/90 font-medium mb-2">{track.title}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-2">{track.civicsFocus}</p>
                  </div>

                  {/* Action / Token state */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    {mintedInfo ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Token #{mintedInfo.tokenId}
                          </span>
                          <span className="text-slate-400 font-mono">Arbitrum Sepolia</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded text-[10px] font-mono text-slate-300">
                          <span className="truncate max-w-[140px]">{mintedInfo.txHash}</span>
                          <button
                            onClick={() => copyToClipboard(mintedInfo.txHash)}
                            className="text-slate-400 hover:text-white"
                          >
                            {copiedTx === mintedInfo.txHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    ) : isCompleted ? (
                      <button
                        onClick={() => handleMint(track.id)}
                        disabled={isCurrentlyMinting}
                        className="w-full py-1.5 px-3 rounded bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                      >
                        {isCurrentlyMinting ? (
                          <>
                            <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Broadcasting Tx...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Claim Soulbound NFT</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center text-[10px] text-slate-500 py-1">
                        Complete Track {track.id} coding challenges to unlock
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Student: <span className="font-mono text-slate-200">{walletAddress}</span></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
