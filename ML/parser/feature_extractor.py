import json
from pathlib import Path
from collections import defaultdict

INP = Path("data/parsed/tls_packets.jsonl")
OUT = Path("data/parsed/sessions.jsonl")

def _get_field(pkt: dict, key: str):
    """
    tshark JSON packs fields under pkt["_source"]["layers"].
    Some fields are lists; we normalize to a single value.
    """
    try:
        layers = pkt["_source"]["layers"]
    except Exception:
        return None
    v = layers.get(key)
    if isinstance(v, list) and v:
        return v[0]
    return v

def build_sessions(proxy_flag: bool = False):
    """
    Converts parsed TLS handshake packets -> per-connection session rows.
    Writes JSONL to data/parsed/sessions.jsonl
    """
    if not INP.exists():
        raise FileNotFoundError(
            "Missing data/parsed/tls_packets.jsonl. Run parser/tshark_parser.py first."
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)

    groups = defaultdict(list)

    with INP.open() as f:
        for line in f:
            pkt = json.loads(line)

            t = _get_field(pkt, "frame.time_epoch")
            src = _get_field(pkt, "ip.src")
            dst = _get_field(pkt, "ip.dst")
            sport = _get_field(pkt, "tcp.srcport")
            dport = _get_field(pkt, "tcp.dstport")

            hs_type = _get_field(pkt, "tls.handshake.type")
            tls_ver = _get_field(pkt, "tls.handshake.version")
            cs = _get_field(pkt, "tls.handshake.ciphersuite")
            sni = _get_field(pkt, "tls.handshake.extensions_server_name")

            if not (t and src and dst and sport and dport):
                continue

            key = (src, sport, dst, dport)
            groups[key].append({
                "t": float(t),
                "hs_type": str(hs_type) if hs_type is not None else None,
                "tls_ver": str(tls_ver) if tls_ver is not None else None,
                "cipher": str(cs) if cs is not None else None,
                "sni": str(sni) if sni is not None else None,
            })

    with OUT.open("w") as f:
        for (src, sport, dst, dport), events in groups.items():
            events.sort(key=lambda e: e["t"])
            t0 = events[0]["t"]
            t1 = events[-1]["t"]
            dur_ms = max(0.0, (t1 - t0) * 1000.0)

            tls_versions = [e["tls_ver"] for e in events if e["tls_ver"]]
            tls_ver = tls_versions[0] if tls_versions else "unknown"

            cipher_count = len({e["cipher"] for e in events if e["cipher"]})
            sni_present = any(e["sni"] for e in events)

            context = {
                "client_ip": src,
                "server_ip": dst,
                "server_port": int(dport),
                "protocol": "TLS",
                "server_name": "localhost",
            }

            session = {
                "context": context,
                "tuple": {"src": src, "sport": int(sport), "dst": dst, "dport": int(dport)},
                "tls_version": tls_ver,
                "cipher_count": cipher_count,
                "sni_present": int(sni_present),
                "handshake_duration_ms": dur_ms,
                "proxy_flag": int(proxy_flag),
                "event_count": len(events),
                "start_time_epoch": t0,
            }
            f.write(json.dumps(session) + "\n")

    print(f"✅ Built {len(groups)} sessions -> {OUT}")

def to_vector(session: dict):
    """
    Session -> numeric vector for RCF
    """
    v = session.get("tls_version", "unknown")
    if "0x0304" in v or "1.3" in v:
        tls_v = 13.0
    elif "0x0303" in v or "1.2" in v:
        tls_v = 12.0
    else:
        tls_v = 0.0

    return [
        float(session.get("handshake_duration_ms", 0.0)),
        tls_v,
        float(session.get("cipher_count", 0)),
        float(session.get("sni_present", 0)),
    ]

if __name__ == "__main__":
    build_sessions(proxy_flag=False)

