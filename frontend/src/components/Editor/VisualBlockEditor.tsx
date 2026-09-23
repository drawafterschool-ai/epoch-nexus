import React, { useState } from 'react';
import { Layers, Plus, Trash2, Code2, ArrowRight } from 'lucide-react';

interface VisualBlock {
  id: string;
  type: 'condition' | 'action' | 'math' | 'return';
  title: string;
  param: string;
  codeSnippet: string;
  color: string;
}

interface VisualBlockEditorProps {
  trackId: number;
  onCodeGenerated: (pythonCode: string) => void;
  onSwitchToMonaco: () => void;
}

export const VisualBlockEditor: React.FC<VisualBlockEditorProps> = ({
  trackId,
  onCodeGenerated,
  onSwitchToMonaco
}) => {
  // Pre-configured block templates based on active track
  const getInitialBlocks = (id: number): VisualBlock[] => {
    if (id === 1) {
      return [
        { id: 'b1', type: 'condition', title: '1. Check Tribunician Veto', param: 'veto_active == True', codeSnippet: 'if veto_active:\n    return "VETOED"', color: 'border-rose-600 bg-rose-950/40 text-rose-300' },
        { id: 'b2', type: 'math', title: '2. Tally Citizen Turnout', param: 'sum(votes.values())', codeSnippet: 'total_votes = votes.get("yes", 0) + votes.get("no", 0)', color: 'border-cyan-600 bg-cyan-950/40 text-cyan-300' },
        { id: 'b3', type: 'condition', title: '3. Verify Citizen Quorum', param: 'total_votes < quorum', codeSnippet: 'if total_votes < quorum:\n    return "QUORUM_FAILED"', color: 'border-amber-600 bg-amber-950/40 text-amber-300' },
        { id: 'b4', type: 'return', title: '4. Ratify Majority Decree', param: 'votes["yes"] > votes["no"]', codeSnippet: 'return "PASSED" if votes.get("yes", 0) > votes.get("no", 0) else "REJECTED"', color: 'border-emerald-600 bg-emerald-950/40 text-emerald-300' }
      ];
    } else if (id === 2) {
      return [
        { id: 'b1', type: 'math', title: '1. Modulo Key Wrap Shift', param: 'key[i % len(key)]', codeSnippet: 'shift = ord(str(key)[idx % len(str(key))].upper()) - ord("A")', color: 'border-cyan-600 bg-cyan-950/40 text-cyan-300' },
        { id: 'b2', type: 'condition', title: '2. Filter Uppercase ASCII', param: '"A" <= ch <= "Z"', codeSnippet: 'if "A" <= ch <= "Z":', color: 'border-amber-600 bg-amber-950/40 text-amber-300' },
        { id: 'b3', type: 'return', title: '3. Decrypt Modulo 26', param: '(ord(ch) - shift) % 26', codeSnippet: 'decrypted.append(chr((ord(ch) - ord("A") - shift) % 26 + ord("A")))', color: 'border-emerald-600 bg-emerald-950/40 text-emerald-300' }
      ];
    } else if (id === 3) {
      return [
        { id: 'b1', type: 'math', title: '1. Compute Daily Factory Output', param: 'workers * hours * 0.5', codeSnippet: 'output = min(self.workers * self.hours * 0.5, self.factory_capacity)', color: 'border-cyan-600 bg-cyan-950/40 text-cyan-300' },
        { id: 'b2', type: 'condition', title: '2. Factory Act Strike Guard', param: 'satisfaction < 30', codeSnippet: 'self.strike_risk = max(0.0, (100.0 - self.worker_satisfaction) / 100.0)', color: 'border-amber-600 bg-amber-950/40 text-amber-300' },
        { id: 'b3', type: 'action', title: '3. Smog Scrubber Filtration', param: 'smog_scrubbers >= 1', codeSnippet: 'self.smog_index = max(0.0, self.smog_index * 0.5)', color: 'border-emerald-600 bg-emerald-950/40 text-emerald-300' }
      ];
    } else {
      return [
        { id: 'b1', type: 'math', title: '1. Quadratic Cost Calculation', param: 'Cost = V^2', codeSnippet: 'cost = votes * votes  # Quadratic cost model', color: 'border-purple-600 bg-purple-950/40 text-purple-300' },
        { id: 'b2', type: 'condition', title: '2. Voice Credit Budget Guard', param: 'balance < cost', codeSnippet: 'if self.delegate_balances[delegate] < cost:\n    raise ValueError("Insufficient voice credits")', color: 'border-rose-600 bg-rose-950/40 text-rose-300' },
        { id: 'b3', type: 'action', title: '3. Deduct Voice Credits & Tally', param: 'balance -= cost', codeSnippet: 'self.delegate_balances[delegate] -= cost\nreturn cost', color: 'border-emerald-600 bg-emerald-950/40 text-emerald-300' }
      ];
    }
  };

  const [blocks, setBlocks] = useState<VisualBlock[]>(getInitialBlocks(trackId));

  // Generate Python Code from Visual Blocks
  const generateCode = (): string => {
    if (trackId === 1) {
      return `def tally_civic_vote(votes: dict, quorum: int, veto_active: bool) -> str:\n    # Auto-generated from Visual Logic Blocks\n` +
        blocks.map(b => '    ' + b.codeSnippet.replace(/\n/g, '\n    ')).join('\n') + '\n';
    } else if (trackId === 2) {
      return `def decrypt_diplomatic_cable(ciphertext: str, cipher_type: str, key) -> str:\n    decrypted = []\n    for idx, ch in enumerate(ciphertext):\n` +
        blocks.map(b => '        ' + b.codeSnippet.replace(/\n/g, '\n        ')).join('\n') + '\n    return "".join(decrypted)\n';
    } else if (trackId === 3) {
      return `class IndustrialEconomySim:\n    def tick(self):\n` +
        blocks.map(b => '        ' + b.codeSnippet.replace(/\n/g, '\n        ')).join('\n') + '\n';
    } else {
      return `class QuadraticVotingProtocol:\n    def cast_vote(self, delegate: str, proposal_id: str, votes: int) -> int:\n` +
        blocks.map(b => '        ' + b.codeSnippet.replace(/\n/g, '\n        ')).join('\n') + '\n';
    }
  };

  const handleApplyToEditor = () => {
    const code = generateCode();
    onCodeGenerated(code);
    onSwitchToMonaco();
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleAddSampleBlock = () => {
    const newBlock: VisualBlock = {
      id: 'b-' + Date.now(),
      type: 'condition',
      title: 'Emergency State Guard',
      param: 'active == True',
      codeSnippet: 'if crisis_active:\n    return "EMERGENCY_DECREE"',
      color: 'border-cyan-600 bg-cyan-950/40 text-cyan-300'
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d121f] rounded-lg border border-slate-800 p-3 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>VISUAL LOGIC BLOCK BUILDER</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
            Scratch / Blockly Mode
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSampleBlock}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center gap-1 transition"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            <span>Add Block</span>
          </button>

          <button
            onClick={handleApplyToEditor}
            className="px-3 py-1 rounded bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow transition"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Sync to Python & Run</span>
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-hidden">
        {/* Left Pane: Visual Block Sequence Palette */}
        <div className="space-y-2 overflow-y-auto pr-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Logic Execution Sequence (Drag & Snap):
          </div>

          {blocks.map((block) => (
            <div
              key={block.id}
              className={`p-2.5 rounded-lg border shadow-md flex items-center justify-between transition hover:translate-x-1 ${block.color}`}
            >
              <div className="space-y-0.5 truncate">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-current opacity-80"></span>
                  <span className="font-bold text-xs truncate">{block.title}</span>
                </div>
                <div className="font-mono text-[10px] opacity-80 truncate pl-3.5">
                  Constraint: <span className="font-bold">{block.param}</span>
                </div>
              </div>

              <button
                onClick={() => handleRemoveBlock(block.id)}
                className="p-1 text-slate-500 hover:text-rose-400 transition ml-2"
                title="Remove block"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Pane: Live Python Code Preview */}
        <div className="bg-[#080c16] rounded-lg border border-slate-800 p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-[10px] font-mono text-slate-400">
            <span>SYNCHRONIZED PYTHON CODE</span>
            <span className="text-emerald-400 font-bold">● Live Sync</span>
          </div>

          <pre className="flex-1 font-mono text-[11px] text-cyan-200 bg-[#05070d] p-2.5 rounded border border-slate-900 overflow-auto leading-relaxed">
            {generateCode()}
          </pre>

          <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800 mt-2">
            <span>Visual blocks auto-compile to pure Python</span>
            <button
              onClick={onSwitchToMonaco}
              className="text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Open in Monaco Editor</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
