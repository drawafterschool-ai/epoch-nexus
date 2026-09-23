import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Sparkles, Code2, Layers } from 'lucide-react';
import { VisualBlockEditor } from './VisualBlockEditor';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onRunCode: () => void;
  onResetCode: () => void;
  onLoadSolution: () => void;
  isRunning: boolean;
  language?: string;
  trackId?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRunCode,
  onResetCode,
  onLoadSolution,
  isRunning,
  language = "python",
  trackId = 1
}) => {
  const [editorMode, setEditorMode] = useState<'monaco' | 'blocks'>('monaco');
  return (
    <div className="flex flex-col h-full bg-[#121826] rounded-lg border border-slate-800 overflow-hidden">
      {/* Editor Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-200">Sandbox Code Editor</span>
          
          {/* Dual-Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 ml-2">
            <button
              onClick={() => setEditorMode('monaco')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                editorMode === 'monaco'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              💻 Python
            </button>
            <button
              onClick={() => setEditorMode('blocks')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                editorMode === 'blocks'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>🧩 Blocks</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset Code */}
          <button
            onClick={onResetCode}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Reset Starter Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Solution toggle */}
          <button
            onClick={onLoadSolution}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800 transition"
            title="Load reference solution for testing"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Load Solution</span>
          </button>

          {/* Execute Button */}
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold text-white transition shadow-sm ${
              isRunning
                ? 'bg-blue-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : 'fill-current'}`} />
            <span>{isRunning ? 'Evaluating...' : 'Run Sandbox'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body: Visual Blocks OR Monaco */}
      <div className="flex-1 min-h-[260px] overflow-hidden">
        {editorMode === 'blocks' ? (
          <VisualBlockEditor
            trackId={trackId}
            onCodeGenerated={(generated) => onChange(generated)}
            onSwitchToMonaco={() => setEditorMode('monaco')}
          />
        ) : (
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={onChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: 'Fira Code, monospace',
              tabSize: 4,
              bracketPairColorization: { enabled: true },
              suggestOnTriggerCharacters: true
            }}
          />
        )}
      </div>
    </div>
  );
};
