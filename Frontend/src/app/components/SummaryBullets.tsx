import { AlertCircle } from 'lucide-react';

interface SummaryBulletsProps {
  summary_bullets: string[];
}

export function SummaryBullets({ summary_bullets }: SummaryBulletsProps) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-xl p-6 shadow-xl">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
        <h3 className="text-base font-semibold text-amber-300">Key Findings</h3>
      </div>
      
      <ul className="space-y-3">
        {summary_bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
            <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
            <span className="leading-relaxed">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
