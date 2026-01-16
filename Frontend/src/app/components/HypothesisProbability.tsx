import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Hypothesis {
  type: string;
  probability: number;
}

interface HypothesisProbabilityProps {
  hypotheses: Hypothesis[];
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export function HypothesisProbability({ hypotheses }: HypothesisProbabilityProps) {
  const chartData = hypotheses.map(h => ({
    name: h.type,
    value: h.probability,
  }));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
      <div className="flex items-start gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-cyan-400 mt-0.5" />
        <div>
          <h3 className="text-base font-semibold text-white">Hypothesis Probability Distribution</h3>
          <p className="text-xs text-gray-400 mt-1">Statistical likelihood of threat scenarios</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Donut Chart */}
        <div style={{ width: '256px', height: '256px', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with Bars */}
        <div className="flex-1 space-y-4">
          {hypotheses.map((hypothesis, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{hypothesis.type}</span>
                <span className="font-mono text-sm font-bold text-white">{hypothesis.probability}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${hypothesis.probability}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}