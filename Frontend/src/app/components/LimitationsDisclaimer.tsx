import { Info } from 'lucide-react';

interface LimitationsDisclaimerProps {
  limitations: string[];
}

export function LimitationsDisclaimer({ limitations }: LimitationsDisclaimerProps) {
  return (
    <div className="rounded-2xl border border-gray-500/30 bg-gray-500/5 backdrop-blur-xl p-6 shadow-xl">
      <div className="flex items-start gap-3 mb-4">
        <Info className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <h3 className="text-base font-semibold text-gray-300">Limitations & Disclaimer</h3>
          <p className="text-xs text-gray-500 mt-1">Important considerations for this analysis</p>
        </div>
      </div>
      
      <ul className="space-y-2">
        {limitations.map((limitation, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-gray-400">
            <span className="text-gray-500 mt-1 flex-shrink-0">•</span>
            <span className="leading-relaxed">{limitation}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
