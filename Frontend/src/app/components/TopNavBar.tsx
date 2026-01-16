import { Shield, Bell, User } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

interface TopNavBarProps {
  status: string;
  active_alerts: number;
  last_scan_time: string;
}

export function TopNavBar({ status, active_alerts, last_scan_time }: TopNavBarProps) {
  const statusColor = status === 'SYSTEM AT RISK' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50';

  return (
    <nav className="border-b border-white/10 backdrop-blur-xl bg-black/50 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400" strokeWidth={2} />
              <div className="absolute inset-0 blur-lg bg-cyan-400/30" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">ShadowLens</h1>
              <p className="text-xs text-gray-400">Endpoint Security Intelligence</p>
            </div>
          </div>

          {/* Status & Info */}
          <div className="flex items-center gap-6">
            <Badge className={`${statusColor} border font-mono text-xs px-3 py-1.5 shadow-lg`}>
              {status}
            </Badge>
            
            <div className="flex items-center gap-2 text-amber-400">
              <Bell className="w-5 h-5" />
              <span className="font-mono text-sm font-bold">{active_alerts}</span>
              <span className="text-gray-400 text-sm">Active Alerts</span>
            </div>

            <div className="text-sm text-gray-400">
              <span className="text-gray-500">Last Scan:</span>{' '}
              <span className="font-mono text-gray-300">{last_scan_time}</span>
            </div>

            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all">
              <User className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
