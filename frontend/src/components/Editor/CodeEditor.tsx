import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Sparkles, Code2 } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onRunCode: () => void;
  onResetCode: () => void;
  onLoadSolution: () => void;
  isRunning: boolean;
  language?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRunCode,
  onResetCode,
  onLoadSolution,
  isRunning,
  language = "python"
}) => {
  return (
    <div className="flex flex-col h-full bg-[#121826] rounded-lg border border-slate-800 overflow-hidden">
      {/* Editor Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-200">Integrated Sandbox Code Editor</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
            {language.toUpperCase()} • Pyodide Wasm
          </span>
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

      {/* Monaco Code Editor Canvas */}
      <div className="flex-1 min-h-[260px]">
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
      </div>
    </div>
  );
};
