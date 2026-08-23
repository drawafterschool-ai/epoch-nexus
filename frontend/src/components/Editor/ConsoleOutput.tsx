import React from 'react';
import { Terminal, CheckCircle2, XCircle, Clock, ShieldCheck, Award } from 'lucide-react';
import { ExecutionResult } from '../../engine/sandbox/wasmRunner';

interface ConsoleOutputProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onClaimBadge?: () => void;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ result, isRunning, onClaimBadge }) => {
  return (
    <div className="flex flex-col h-full bg-[#121826] rounded-lg border border-slate-800 overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">Evaluation Matrix & Test Suites</span>
        </div>

        {result && (
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className={result.success ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {result.passedTests} / {result.totalTests} Tests Passed
            </span>
          </div>
        )}
      </div>

      {/* Test Matrix & Console Log Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono text-xs">
        {isRunning ? (
          <div className="flex items-center justify-center h-full text-slate-400 gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Executing test vectors inside isolated Wasm sandbox...</span>
          </div>
        ) : !result ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-1">
            <Terminal className="w-6 h-6 text-slate-600 mb-1" />
            <p>Click "Run Sandbox" to execute test cases against your code.</p>
          </div>
        ) : (
          <>
            {/* Test Case Cards */}
            <div className="space-y-1.5">
              {result.results.map((r, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border transition ${
                    r.passed
                      ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-900/50 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {r.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                      <span className="font-semibold text-xs text-slate-200">{r.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {r.executionTimeMs.toFixed(2)}ms
                    </span>
                  </div>

                  {!r.passed && (
                    <div className="mt-1.5 pt-1.5 border-t border-rose-900/30 text-[11px] space-y-0.5 text-rose-200">
                      <div>Expected: <span className="text-emerald-300">{JSON.stringify(r.expected)}</span></div>
                      <div>Actual: <span className="text-rose-400">{JSON.stringify(r.actual)}</span></div>
                      {r.error && <div className="text-rose-400 font-sans text-[10px] mt-1 whitespace-pre-wrap">{r.error}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Cryptographic Verification Hash (if passed) */}
            {result.success && result.verificationHash && (
              <div className="p-2.5 rounded bg-blue-950/40 border border-blue-800/60 text-blue-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cryptographic Proof Generated</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 break-all">
                    {result.verificationHash}
                  </div>
                </div>

                {onClaimBadge && (
                  <button
                    onClick={onClaimBadge}
                    className="ml-3 px-3 py-1.5 rounded bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition flex-shrink-0"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Mint L2 Badge</span>
                  </button>
                )}
              </div>
            )}

            {/* Standard Output Console */}
            {result.stdout && (
              <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-400 text-[11px] whitespace-pre-wrap">
                <span className="text-slate-600 font-bold block mb-1">STDOUT:</span>
                {result.stdout}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
