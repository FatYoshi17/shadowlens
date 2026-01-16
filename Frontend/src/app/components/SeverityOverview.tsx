import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface SeverityOverviewProps {
  severity: string;
  confidence: number;
  short_explanation: string;
}

export function SeverityOverview({ severity, confidence, short_explanation }: SeverityOverviewProps) {
  const severityColors = {
    HIGH: { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-red-500/50' },
    MEDIUM: { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-amber-500/50' },
    LOW: { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400', glow: 'shadow-green-500/50' },
  };

  const colors = severityColors[severity as keyof typeof severityColors] || severityColors.MEDIUM;

  // Calculate circle properties
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-xl p-8 shadow-2xl ${colors.glow}`}>
      <div className="flex items-start gap-8">
        {/* Severity Badge */}
        <div className="flex flex-col items-center gap-4">
          <div className={`relative w-32 h-32 rounded-2xl border-2 ${colors.border} ${colors.bg} flex items-center justify-center shadow-2xl`}>
            <ShieldAlert className={`w-12 h-12 ${colors.text}`} strokeWidth={2.5} />
            <div className={`absolute inset-0 rounded-2xl blur-xl ${colors.bg} opacity-50`} />
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${colors.text} tracking-wider`}>{severity}</div>
            <div className="text-xs text-gray-400 mt-1">SEVERITY LEVEL</div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="flex-1 flex items-start gap-6">
          <div className="relative">
            <svg width="160" height="160" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-white/5"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className={colors.text}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-4xl font-bold ${colors.text} font-mono`}>{confidence}%</div>
              <div className="text-xs text-gray-400 mt-1">CONFIDENCE</div>
            </div>
          </div>

          {/* Explanation */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 ${colors.text} mt-1 flex-shrink-0`} />
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Threat Assessment</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{short_explanation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
