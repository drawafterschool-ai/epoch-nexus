import React, { useState } from 'react';
import { MessageSquare, Sparkles, UserCheck } from 'lucide-react';
import { DialogueNode } from '../../tracks';

interface DialogueTreeProps {
  dialogueList: DialogueNode[];
  onSelectOption?: (alignment: string) => void;
}

export const DialogueTree: React.FC<DialogueTreeProps> = ({ dialogueList, onSelectOption }) => {
  const [currentNodeIndex] = useState<number>(0);
  const [chosenOption, setChosenOption] = useState<{ label: string; feedback: string; civicAlignment?: string } | null>(null);

  const currentDialogue = dialogueList[currentNodeIndex] || dialogueList[0];

  const handleChoose = (opt: any) => {
    setChosenOption(opt);
    if (opt.civicAlignment && onSelectOption) {
      onSelectOption(opt.civicAlignment);
    }
  };

  return (
    <div className="bg-[#121826] rounded-lg border border-slate-800 p-3.5 flex flex-col h-full justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentDialogue.avatar}</span>
            <div>
              <div className="text-xs font-bold text-amber-300">{currentDialogue.speaker}</div>
              <div className="text-[10px] text-slate-400">{currentDialogue.role} • {currentDialogue.era}</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">
            Interactive Briefing
          </span>
        </div>

        {/* Dialogue Text Speech Bubble */}
        <div className="relative bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 leading-relaxed font-serif shadow-inner">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>"{currentDialogue.text}"</p>
          </div>
        </div>

        {/* Feedback response if chosen */}
        {chosenOption && (
          <div className="mt-2.5 p-2.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Alignment Recorded: {chosenOption.civicAlignment || "Citizen Scholar"}</span>
            </div>
            <p className="italic text-[11px]">{chosenOption.feedback}</p>
          </div>
        )}
      </div>

      {/* Decision Options */}
      <div className="mt-3 space-y-1.5">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Choose Civic Deliberation Path:
        </div>
        {currentDialogue.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleChoose(opt)}
            className={`w-full text-left p-2 rounded-md text-xs border transition flex items-center justify-between ${
              chosenOption?.label === opt.label
                ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-semibold'
                : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="leading-snug">{opt.label}</span>
            {chosenOption?.label === opt.label && (
              <UserCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 ml-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
