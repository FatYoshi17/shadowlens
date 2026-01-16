import json
from pathlib import Path
import pandas as pd
import numpy as np

from detector.rcf_model import RCF
from detector.feature_pipeline import to_vector

BASELINE_CSV = Path("data/baseline/baseline.csv")
MODEL_META = Path("data/models/baseline_meta.json")

def main():
    if not BASELINE_CSV.exists():
        raise FileNotFoundError("Put baseline CSV at data/baseline/baseline.csv")

    df = pd.read_csv(BASELINE_CSV)
    required = [
        "transport_type","ja4_client","ja4_server","cipher_suite","key_exchange_group",
        "leaf_cert_hash","intermediate_chain_hash","handshake_time","resumption_used"
    ]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns in baseline CSV: {missing}")

    rcf = RCF()
    scores = []
    for _, row in df.iterrows():
        x = to_vector(row.to_dict())
        scores.append(rcf.score(x))

    # Choose threshold: 99th percentile of baseline scores
    thr = float(np.quantile(scores, 0.99)) if scores else 0.0

    MODEL_META.parent.mkdir(parents=True, exist_ok=True)
    MODEL_META.write_text(json.dumps({
        "threshold": thr,
        "quantile": 0.99,
        "n_baseline": len(scores),
        "score_mean": float(np.mean(scores)) if scores else 0.0,
        "score_p95": float(np.quantile(scores, 0.95)) if scores else 0.0,
        "features": required
    }, indent=2))

    print(f"✅ Baseline trained from CSV. threshold={thr:.3f} n={len(scores)}")
    print(f"Saved: {MODEL_META}")

if __name__ == "__main__":
    main()
