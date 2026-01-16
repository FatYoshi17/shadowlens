import json
import subprocess
from pathlib import Path

PCAP = Path("data/raw/traffic.pcap")
OUT = Path("data/parsed/tls_packets.jsonl")

def run():
    if not PCAP.exists():
        raise FileNotFoundError("PCAP not found at data/raw/traffic.pcap. Run capture first.")

    OUT.parent.mkdir(parents=True, exist_ok=True)

    display_filter = "tls.handshake && tcp.port == 8443"
    cmd = ["tshark", "-r", str(PCAP), "-Y", display_filter, "-T", "json"]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(res.stderr.strip() or "tshark failed")

    packets = json.loads(res.stdout) if res.stdout.strip() else []
    with OUT.open("w") as f:
        for p in packets:
            f.write(json.dumps(p) + "\n")

    print(f"✅ Parsed {len(packets)} TLS handshake packets -> {OUT}")

if __name__ == "__main__":
    run()
