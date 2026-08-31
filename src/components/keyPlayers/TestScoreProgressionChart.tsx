import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Award, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface ScoreDataPoint {
  testNumber: string;
  score: number;
  testName?: string;
  date?: string;
}

interface TestScoreProgressionChartProps {
  data?: ScoreDataPoint[];
}

const DEFAULT_SCORE_DATA: ScoreDataPoint[] = [
  { testNumber: 'Test #1', score: 62, testName: 'Diagnostic Mechanics Test', date: 'Aug 10' },
  { testNumber: 'Test #2', score: 75, testName: 'Calculus & Vectors Drill', date: 'Aug 15' },
  { testNumber: 'Test #3', score: 84, testName: 'Organic Chemistry MCQ Set', date: 'Aug 20' },
  { testNumber: 'Test #4', score: 92, testName: 'Electrostatics Speed Test', date: 'Aug 25' },
  { testNumber: 'Test #5', score: 100, testName: 'G.C.E. A/L Model Paper #1', date: 'Aug 30' }
];

export const TestScoreProgressionChart: React.FC<TestScoreProgressionChartProps> = ({
  data = DEFAULT_SCORE_DATA
}) => {
  const { language } = useLanguage();

  const chartData = data && data.length > 0 ? data : DEFAULT_SCORE_DATA;
  const latestScore = chartData[chartData.length - 1]?.score ?? 100;
  const initialScore = chartData[0]?.score ?? 60;
  const improvement = latestScore - initialScore;

  return (
    <div
      id="test-score-progression-card"
      className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-blue-500/30 p-6 sm:p-7 shadow-2xl overflow-hidden ring-1 ring-blue-500/20"
    >
      {/* Background Subtle Radial Glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header with Title and Latest Score Badge */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Test Score Progression & Trajectory{' '}
              <span className="text-blue-400 font-bold text-xs sm:text-sm">
                (ලකුණු ප්‍රගති ප්‍රස්තාරය)
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'si'
              ? 'ඔබේ මෑතකාලීන පරීක්ෂණ ලකුණු සහ විභාග ප්‍රගතියේ විශ්ලේෂණ ප්‍රස්තාරය'
              : 'Continuous diagnostic evaluation trajectory across recent sequential test sets'}
          </p>
        </div>

        {/* Top Corner "Latest: [Score%]" Badge */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wide">
              Latest: <span className="text-white text-sm font-extrabold">{latestScore}%</span>
            </span>
          </div>
          {improvement > 0 && (
            <div className="px-3 py-1.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-black flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>+{improvement}% Gain</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Area Chart Container */}
      <div className="relative z-10 mt-6 h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 15, right: 20, left: -20, bottom: 5 }}
          >
            <defs>
              {/* Vibrant Blue Line to Soft Gradient Fill matching image */}
              <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
                <stop offset="60%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="scoreLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.35}
              vertical={false}
            />

            <XAxis
              dataKey="testNumber"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#334155', strokeWidth: 1 }}
              tick={{ fill: '#cbd5e1', fontWeight: 600 }}
              dy={8}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155', strokeWidth: 1 }}
              tick={{ fill: '#94a3b8', fontWeight: 600 }}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ScoreDataPoint;
                  return (
                    <div className="rounded-2xl bg-slate-950/95 border border-blue-500/40 p-3 shadow-2xl backdrop-blur-md">
                      <div className="flex items-center justify-between gap-3 text-xs font-black text-white">
                        <span>{item.testNumber}</span>
                        <span className="text-emerald-400 text-sm font-extrabold">{item.score}%</span>
                      </div>
                      {item.testName && (
                        <p className="text-[11px] text-slate-300 font-medium mt-1">
                          {item.testName}
                        </p>
                      )}
                      {item.date && (
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.date}</p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="url(#scoreLineGradient)"
              strokeWidth={3.5}
              fill="url(#scoreAreaGradient)"
              dot={{
                r: 4.5,
                fill: '#60a5fa',
                stroke: '#1e3a8a',
                strokeWidth: 2
              }}
              activeDot={{
                r: 7,
                fill: '#38bdf8',
                stroke: '#ffffff',
                strokeWidth: 3,
                className: 'animate-pulse'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trajectory Insights Footer */}
      <div className="relative z-10 mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400">Baseline Score</span>
          <div className="text-sm font-black text-slate-200">{initialScore}%</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400">Peak Mastery</span>
          <div className="text-sm font-black text-emerald-400">100% (Island Caliber)</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400">Growth Velocity</span>
          <div className="text-sm font-black text-blue-400">+{((latestScore - initialScore) / (chartData.length - 1)).toFixed(1)}% / Test</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400">Next Target</span>
          <div className="text-sm font-black text-amber-400">Consolidate 100% Rate</div>
        </div>
      </div>
    </div>
  );
};
