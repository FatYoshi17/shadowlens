import { CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

interface RecommendedActionsProps {
  recommended_actions: string[];
}

export function RecommendedActions({ recommended_actions }: RecommendedActionsProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleCheck = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-xl p-6 shadow-xl">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-blue-300">Recommended Actions</h3>
        <p className="text-xs text-gray-400 mt-1">Immediate steps to mitigate identified threats</p>
      </div>
      
      <div className="space-y-3">
        {recommended_actions.map((action, index) => (
          <div
            key={index}
            onClick={() => toggleCheck(index)}
            className="flex items-start gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all group"
          >
            {checkedItems.has(index) ? (
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
            )}
            <span className={`text-sm leading-relaxed transition-all ${
              checkedItems.has(index) ? 'text-gray-500 line-through' : 'text-gray-300'
            }`}>
              {action}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            Completed: {checkedItems.size} / {recommended_actions.length}
          </span>
          <button
            onClick={() => setCheckedItems(new Set())}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}
