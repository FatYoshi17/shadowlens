from ai.gemini_client import explain_with_gemini

dummy_alert = {
    "context": {"server_name": "localhost", "server_port": 8443, "protocol": "TLS"},
    "risk": {"raw_score": 91.2, "threshold": 65.0},
    "signals": {
        "handshake_duration_ms": 140,
        "tls_version": "TLS1.3",
        "cipher_count": 1,
        "sni_present": 1,
        "proxy_flag": 1
    }
}

out = explain_with_gemini(dummy_alert)
print(out)
