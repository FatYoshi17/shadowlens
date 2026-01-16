import { TopNavBar } from '@/app/components/TopNavBar';
import { SeverityOverview } from '@/app/components/SeverityOverview';
import { SummaryBullets } from '@/app/components/SummaryBullets';
import { HypothesisProbability } from '@/app/components/HypothesisProbability';
import { EvidenceTable } from '@/app/components/EvidenceTable';
import { RiskReasoning } from '@/app/components/RiskReasoning';
import { RecommendedActions } from '@/app/components/RecommendedActions';
import { LimitationsDisclaimer } from '@/app/components/LimitationsDisclaimer';
import { MetadataFooter } from '@/app/components/MetadataFooter';

// Mock API data structure - ready for API integration
const mockApiData = {
  // Top Nav Bar Data
  status: 'SYSTEM AT RISK',
  active_alerts: 3,
  last_scan_time: '2026-01-16 13:41 UTC',

  // Severity Overview Data
  severity: 'HIGH',
  confidence: 91,
  short_explanation: 'Strong indicators of TLS interception were detected during handshake analysis. Multiple anomalous signals suggest the presence of an intermediary proxy or MITM device.',

  // Summary Bullets Data
  summary_bullets: [
    'High-risk TLS alert triggered for localhost:8443',
    'Proxy flag explicitly detected in connection metadata',
    'Only one cipher suite offered during handshake',
    'Raw risk score exceeded threshold (91.2 vs 65)',
    'Certificate chain validation shows unexpected intermediate CA',
  ],

  // Hypothesis Probability Data
  hypotheses: [
    { type: 'TLS Interception', probability: 65 },
    { type: 'Benign Proxy', probability: 30 },
    { type: 'Network Variance', probability: 5 },
  ],

  // Evidence Table Data
  evidence: [
    {
      signal: 'proxy_flag',
      observation: 'Proxy flag set to 1',
      interpretation: 'Explicit indication of intermediary presence in connection metadata. This is a direct signal that traffic is being routed through a proxy server.',
      confidence: 'High',
    },
    {
      signal: 'cipher_count',
      observation: 'Only 1 cipher suite offered',
      interpretation: 'Atypical for direct TLS handshake. Standard clients typically offer 10-20 cipher suites for compatibility and security negotiation.',
      confidence: 'Medium',
    },
    {
      signal: 'risk.raw_score',
      observation: '91.2 (threshold 65)',
      interpretation: 'Strong anomaly detected. Raw risk score significantly exceeds baseline threshold, indicating multiple converging risk signals.',
      confidence: 'High',
    },
    {
      signal: 'tls_version',
      observation: 'TLS 1.2 enforced',
      interpretation: 'While TLS 1.2 is acceptable, modern clients prefer TLS 1.3. This could indicate downgrade attack or legacy proxy infrastructure.',
      confidence: 'Medium',
    },
    {
      signal: 'cert_chain_length',
      observation: '4 certificates in chain',
      interpretation: 'Longer than typical 2-3 certificate chains. Additional intermediate CAs suggest corporate SSL inspection appliance.',
      confidence: 'High',
    },
    {
      signal: 'handshake_duration',
      observation: '247ms (expected <100ms)',
      interpretation: 'Increased latency consistent with additional processing layer, potentially indicative of real-time SSL decryption/re-encryption.',
      confidence: 'Medium',
    },
  ],

  // Risk Reasoning Data
  risk_reasoning: {
    why_high_risk: [
      'Proxy behavior detected with explicit metadata flags',
      'Cipher manipulation suspected - single cipher suite offering is highly irregular',
      'Risk score significantly exceeds baseline (91.2 vs 65 threshold)',
      'Certificate chain contains unexpected intermediate authorities',
      'Handshake timing anomalies consistent with active interception',
    ],
    what_is_not_seen: [
      'No certificate mismatch detected between server identity and presented certificate',
      'No invalid TLS versions observed (no SSL 2.0/3.0 usage)',
      'No known malware fingerprints found in connection metadata',
      'No evidence of credential harvesting or data exfiltration patterns',
      'No signature of known APT (Advanced Persistent Threat) activity',
    ],
  },

  // Recommended Actions Data
  recommended_actions: [
    'Investigate proxy configuration on endpoint and network infrastructure',
    'Review TLS inspection devices and their certificate trust chains',
    'Validate trust store integrity on affected systems',
    'Monitor similar alerts across network for pattern identification',
    'Conduct forensic analysis of endpoint memory and process list',
    'Review recent software installations and browser extension changes',
    'Escalate to security operations center for threat hunting procedures',
  ],

  // Limitations Data
  limitations: [
    'Analysis is probabilistic, not definitive - false positives may occur in corporate environments',
    'Network conditions may influence signals - VPNs and enterprise proxies can trigger similar patterns',
    'Further investigation required for confirmation - manual verification recommended',
    'Local security software may interfere with TLS analysis - endpoint detection solutions should be reviewed',
  ],

  // Metadata
  analysis_id: 'SL-2026-0116-0042',
  model: 'Gemini 1.5 Pro',
  analysis_timestamp_utc: '2026-01-16T13:41:22Z',
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Top Navigation */}
      <TopNavBar
        status={mockApiData.status}
        active_alerts={mockApiData.active_alerts}
        last_scan_time={mockApiData.last_scan_time}
      />

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-6">
        {/* Severity Overview */}
        <SeverityOverview
          severity={mockApiData.severity}
          confidence={mockApiData.confidence}
          short_explanation={mockApiData.short_explanation}
        />

        {/* Two Column Layout: Summary + Hypothesis */}
        <div className="grid grid-cols-2 gap-6">
          <SummaryBullets summary_bullets={mockApiData.summary_bullets} />
          <HypothesisProbability hypotheses={mockApiData.hypotheses} />
        </div>

        {/* Evidence Table */}
        <EvidenceTable evidence={mockApiData.evidence} />

        {/* Risk Reasoning */}
        <RiskReasoning risk_reasoning={mockApiData.risk_reasoning} />

        {/* Two Column Layout: Actions + Limitations */}
        <div className="grid grid-cols-2 gap-6">
          <RecommendedActions recommended_actions={mockApiData.recommended_actions} />
          <LimitationsDisclaimer limitations={mockApiData.limitations} />
        </div>

        {/* Metadata Footer */}
        <MetadataFooter
          analysis_id={mockApiData.analysis_id}
          model={mockApiData.model}
          analysis_timestamp_utc={mockApiData.analysis_timestamp_utc}
        />

        {/* Bottom Branding */}
        <div className="text-center py-6 text-xs text-gray-600">
          <p>ShadowLens Endpoint Security Intelligence v2.4.1</p>
          <p className="mt-1">Enterprise Threat Detection & Analysis Platform</p>
        </div>
      </div>
    </div>
  );
}
