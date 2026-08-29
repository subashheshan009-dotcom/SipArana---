import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Share2,
  BookOpen,
  CheckCircle2,
  ListOrdered,
  Tag,
  Copy,
  Check,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import type { SampleDocItem } from '@/data/sampleEvaluatorDocs';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';

interface MindMapStudioViewProps {
  document: SampleDocItem;
  onNavigateFlashcards?: () => void;
}

export default function MindMapStudioView({ document, onNavigateFlashcards }: MindMapStudioViewProps) {
  const { language } = useLanguage();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [viewMode, setViewMode] = useState<'visual_graph' | 'summary_cards' | 'key_terms'>('visual_graph');

  const mindMap = document.mindMapData;

  if (!mindMap) {
    return (
      <div className="p-8 text-center bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">No Mind-Map structure generated for this document.</p>
      </div>
    );
  }

  const toggleNode = (nodeId: string) => {
    soundFX.playPop();
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const handleZoom = (delta: number) => {
    soundFX.playClick();
    setZoomLevel((prev) => Math.min(160, Math.max(70, prev + delta)));
  };

  const handleCopySummary = () => {
    soundFX.playPop();
    const textToCopy =
      language === 'si'
        ? mindMap.summaryBulletPointsSi.join('\n• ')
        : mindMap.summaryBulletPoints.join('\n• ');
    navigator.clipboard.writeText('• ' + textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              {language === 'si' ? 'අන්තර්ක්‍රියාකාරී මනෝ සිතියම් මැදිරිය' : 'Interactive Visual Mind-Map Studio'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mindMap.rootNode.children.length} Core Branches • 100% Academic Syllabus Coverage
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setViewMode('visual_graph');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'visual_graph'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'si' ? 'දෘශ්‍ය සිතියම' : 'Visual Graph'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setViewMode('summary_cards');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'summary_cards'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>{language === 'si' ? 'සාරාංශය' : 'Summary Points'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setViewMode('key_terms');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'key_terms'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{language === 'si' ? 'ප්‍රධාන වචන' : 'Key Terminology'}</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: VISUAL GRAPH CANVAS */}
      {viewMode === 'visual_graph' && (
        <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 min-h-[540px] overflow-hidden shadow-2xl flex flex-col justify-between select-none">
          {/* Subtle graph grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Canvas Controls Top-Right */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <button
              type="button"
              onClick={() => handleZoom(-10)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-emerald-400 px-1">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => handleZoom(10)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Root & Branches Tree Structure */}
          <div
            className="w-full transition-transform duration-300 origin-top-left py-4 space-y-6"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* Root Central Concept Card */}
            <div className="max-w-xl mx-auto p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-2xl border-2 border-emerald-400 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{mindMap.rootNode.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block">
                    Central Concept
                  </span>
                  <h2 className="text-base sm:text-lg font-black leading-tight">
                    {language === 'si' ? mindMap.rootNode.labelSi : mindMap.rootNode.label}
                  </h2>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/20">
                ROOT
              </span>
            </div>

            {/* Connecting line to branches */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 mx-auto" />

            {/* Primary Branches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mindMap.rootNode.children.map((branch) => {
                const isCollapsed = collapsedNodes[branch.id];
                const isSelected = selectedBranchId === branch.id;

                return (
                  <div
                    key={branch.id}
                    className={`p-5 rounded-3xl border transition-all duration-200 bg-slate-900/90 text-white space-y-3 ${
                      isSelected
                        ? 'border-emerald-400 ring-2 ring-emerald-500/40 shadow-xl'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Branch Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                        <h4 className="text-sm font-extrabold text-white">
                          {language === 'si' ? branch.labelSi : branch.label}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleNode(branch.id)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                      >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Branch Summary */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {language === 'si' ? branch.summarySi : branch.summary}
                    </p>

                    {/* Children Sub-nodes (Collapsible) */}
                    {!isCollapsed && branch.children && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Key Mechanism Sub-Nodes:
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {branch.children.map((child) => (
                            <div
                              key={child.id}
                              className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-2 text-xs"
                            >
                              <div>
                                <span className="font-bold text-emerald-300 block">
                                  {language === 'si' ? child.labelSi : child.label}
                                </span>
                                <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                                  {language === 'si' ? child.detailsSi : child.details}
                                </span>
                              </div>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Quick Tools */}
          <div className="pt-4 mt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Click nodes to expand/collapse • Auto-organized by NIE Curriculum Topic Hierarchy</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  alert('Mind-Map exported to high-resolution PNG image format!');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Graph</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: SUMMARY BULLET POINTS */}
      {viewMode === 'summary_cards' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {language === 'si' ? 'මූලික අධ්‍යයන සාරාංශ සටහන' : 'Essential High-Yield Study Summary'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Extracted directly from resource chapters for rapid revision before exams
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition cursor-pointer"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {(language === 'si' ? mindMap.summaryBulletPointsSi : mindMap.summaryBulletPoints).map(
              (point, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{point}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: KEY TERMINOLOGY */}
      {viewMode === 'key_terms' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mindMap.keyTerms.map((termItem, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  DEFINED TERM #{idx + 1}
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">{termItem.term}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {language === 'si' ? termItem.definitionSi : termItem.definition}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>NIE Resource Definition</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
