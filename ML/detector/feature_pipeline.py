import hashlib

def _hash_to_unit_interval(s: str) -> float:
    """
    Stable hash -> float in [0, 1).
    Works for strings like JA4, cert hashes, ciphers, etc.
    """
    if s is None:
        s = ""
    s = str(s)
    h = hashlib.sha256(s.encode("utf-8")).digest()
    # take first 8 bytes as int
    n = int.from_bytes(h[:8], "big")
    return (n % 10_000_000) / 10_000_000.0

def _transport_encode(t: str) -> float:
    t = (t or "").strip().upper()
    if t == "QUIC":
        return 1.0
    return 0.0  # default TCP

def _bool_encode(x) -> float:
    if isinstance(x, str):
        x = x.strip().lower()
        return 1.0 if x in ("1", "true", "yes", "y") else 0.0
    return 1.0 if bool(x) else 0.0

def to_vector(row: dict) -> list:
    """
    row keys expected:
    transport_type, ja4_client, ja4_server, cipher_suite, key_exchange_group,
    leaf_cert_hash, intermediate_chain_hash, handshake_time, resumption_used
    """
    return [
        _transport_encode(row.get("transport_type")),
        _hash_to_unit_interval(row.get("ja4_client")),
        _hash_to_unit_interval(row.get("ja4_server")),
        _hash_to_unit_interval(row.get("cipher_suite")),
        _hash_to_unit_interval(row.get("key_exchange_group")),
        _hash_to_unit_interval(row.get("leaf_cert_hash")),
        _hash_to_unit_interval(row.get("intermediate_chain_hash")),
        float(row.get("handshake_time") or 0.0),
        _bool_encode(row.get("resumption_used")),
    ]
