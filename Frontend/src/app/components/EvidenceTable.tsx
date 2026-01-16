import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Database } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

interface Evidence {
  signal: string;
  observation: string;
  interpretation: string;
  confidence: string;
}

interface EvidenceTableProps {
  evidence: Evidence[];
}

export function EvidenceTable({ evidence }: EvidenceTableProps) {
  const [sortBy, setSortBy] = useState<keyof Evidence | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (column: keyof Evidence) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const getConfidenceBadge = (confidence: string) => {
    const styles = {
      High: 'bg-red-500/20 text-red-400 border-red-500/50',
      Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      Low: 'bg-green-500/20 text-green-400 border-green-500/50',
    };
    return styles[confidence as keyof typeof styles] || styles.Medium;
  };

  const filteredEvidence = evidence.filter(e =>
    Object.values(e).some(val =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedEvidence = [...filteredEvidence].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const comparison = aVal.localeCompare(bVal);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-cyan-400 mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-white">Evidence Analysis</h3>
            <p className="text-xs text-gray-400 mt-1">Detailed signal breakdown and interpretation</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full">
          <thead className="bg-black/40 border-b border-white/10">
            <tr>
              <th className="w-8 px-4 py-3"></th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('signal')}
              >
                <div className="flex items-center gap-2">
                  Signal
                  {sortBy === 'signal' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('observation')}
              >
                <div className="flex items-center gap-2">
                  Observation
                  {sortBy === 'observation' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('confidence')}
              >
                <div className="flex items-center gap-2">
                  Confidence
                  {sortBy === 'confidence' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedEvidence.flatMap((item, index) => [
              <tr
                key={`evidence-main-${index}`}
                className="hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => toggleRow(index)}
              >
                <td className="px-4 py-3">
                  {expandedRows.has(index) ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-cyan-400">{item.signal}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.observation}</td>
                <td className="px-4 py-3">
                  <Badge className={`${getConfidenceBadge(item.confidence)} border text-xs`}>
                    {item.confidence}
                  </Badge>
                </td>
              </tr>,
              ...(expandedRows.has(index) ? [
                <tr key={`evidence-expanded-${index}`} className="bg-black/20">
                  <td colSpan={4} className="px-4 py-4">
                    <div className="ml-12">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Interpretation
                      </div>
                      <div className="text-sm text-gray-300 leading-relaxed">
                        {item.interpretation}
                      </div>
                    </div>
                  </td>
                </tr>
              ] : [])
            ])}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Showing {sortedEvidence.length} of {evidence.length} evidence signals
      </div>
    </div>
  );
}