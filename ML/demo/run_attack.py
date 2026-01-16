import json
import subprocess

import pathfix  # noqa: F401  (adds project root to sys.path)

from parser.tshark_parser import run as parse_pcap
from parser.feature_extractor import build_sessions
from detector.scorer import score_sessions
from ai.gemini_client import explain_with_gemini
from ui.console_dashboard import show


def build_alert_bundle(session: dict, score: float, threshold: float) -> dict:
    # This is the exact metadata packet we send to Gemini (no payload)
    return {
        "project": "ShadowLens",
        "context": session.get("context", {}),
        "risk": {
            "raw_score": score,
            "threshold": threshold
        },
        "signals": {
            "handshake_duration_ms": session.get("handshake_duration_ms"),
            "tls_version": session.get("tls_version"),
            "cipher_count": session.get("cipher_count"),
            "sni_present": session.get("sni_present"),
            "proxy_flag": session.get("proxy_flag"),
            "event_count": session.get("event_count"),
            "start_time_epoch": session.get("start_time_epoch"),
        }
    }


def main():
    print("\n=== ATTACK PHASE (MITM / PROXY ON) ===")
    print("Tip: If using a proxy, set HTTPS_PROXY in this shell before running.\n")

    # Generate traffic (your browser can also be used; this just makes it repeatable)
    subprocess.run(["python3", "server/test_requests.py"], check=True)

    # Parse capture & build sessions for scoring
    parse_pcap()
    build_sessions(proxy_flag=True)

    # Score sessions
    threshold, results = score_sessions()
    show(threshold, results)

    # Pick the highest anomaly above threshold
    alerts = [(s, sc) for (s, sc, is_alert) in results if is_alert]
    if not alerts:
        print("\nNo alerts above threshold. Try more requests or re-capture a cleaner attack PCAP.\n")
        return

    session, score = max(alerts, key=lambda x: x[1])
    alert_bundle = build_alert_bundle(session, score, threshold)

    # Gemini explanation
    print("\n🧠 Gemini Analysis (metadata-only)\n")
    explanation = explain_with_gemini(alert_bundle)
    print(json.dumps(explanation, indent=2))


if __name__ == "__main__":
    main()

