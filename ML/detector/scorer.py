import json
from pathlib import Path

from detector.rcf_model import RCF
from detector.baseline import save_threshold, load_threshold
from parser.feature_extractor import to_vector

SESSIONS = Path("data/parsed/sessions.jsonl")
DEFAULT_CONTEXT = "localhost:8443:TLS"

def train_baseline(context_key: str = DEFAULT_CONTEXT):
    if not SESSIONS.exists():
        raise FileNotFoundError("Missing data/parsed/sessions.jsonl. Run parser/feature_extractor first.")

    rcf = RCF()
    scores = []

    with SESSIONS.open() as f:
        for line in f:
            s = json.loads(line)
            x = to_vector(s)
            scores.append(rcf.score(x))

    thr = save_threshold(context_key, scores, q=0.99)
    print(f"✅ Baseline trained: {context_key} threshold={thr:.3f} n={len(scores)}")
    return thr

def score_sessions(context_key: str = DEFAULT_CONTEXT):
    if not SESSIONS.exists():
        raise FileNotFoundError("Missing data/parsed/sessions.jsonl. Run parser/feature_extractor first.")

    thr = load_threshold(context_key)
    if thr is None:
        raise RuntimeError(f"No baseline found for {context_key}. Run baseline first.")

    rcf = RCF()
    results = []

    with SESSIONS.open() as f:
        for line in f:
            s = json.loads(line)
            x = to_vector(s)
            sc = rcf.score(x)
            results.append((s, sc, sc > thr))

    return thr, results

