import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load .env from project root
ROOT = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=ROOT / ".env")

# IMPORTANT: prevent Gemini calls from going through your MITM proxy env vars
for k in ["HTTPS_PROXY","HTTP_PROXY","ALL_PROXY","https_proxy","http_proxy","all_proxy"]:
    os.environ.pop(k, None)

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def _extract_json(text: str) -> dict:
    """
    Robustly extract JSON from model output.
    Handles:
    - pure JSON
    - ```json ... ```
    - extra text around JSON
    """
    if not text or not text.strip():
        raise ValueError("Empty response.text from Gemini")

    t = text.strip()

    # Remove fenced code blocks if present
    if t.startswith("```"):
        # drop first line ```json or ```
        t = "\n".join(t.splitlines()[1:])
        # drop trailing ```
        if t.rstrip().endswith("```"):
            t = "\n".join(t.rstrip().splitlines()[:-1])
        t = t.strip()

    # Try direct parse
    try:
        return json.loads(t)
    except Exception:
        pass

    # Try to locate the first {...} JSON object
    start = t.find("{")
    end = t.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = t[start:end+1]
        return json.loads(candidate)

    raise ValueError("Could not parse JSON from Gemini response")

def explain_with_gemini(alert_bundle: dict) -> dict:
    prompt = f"""
You are a security analyst assistant for a MITM detection tool.

Rules:
- Use ONLY the metadata provided.
- Do NOT assume decrypted content.
- Do NOT mention payload inspection.
- Be concise and evidence-driven.

Return ONLY valid JSON with these keys:
summary_bullets (array of 3 strings),
evidence (array of objects with signal, observation, why_it_matters),
probabilities (object with tls_interception, benign_proxy, network_variance; values 0..1 summing to 1),
severity (LOW | MEDIUM | HIGH),
next_steps (array of 5 strings).

ALERT METADATA:
{json.dumps(alert_bundle, indent=2)}
""".strip()

    # Ask for JSON explicitly at the API level
    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2
        )
    )

    # Sometimes resp.text can be empty; keep a helpful fallback
    raw = getattr(resp, "text", "") or ""
    try:
        return _extract_json(raw)
    except Exception:
        # Final fallback: return a safe structured response for your demo
        return {
            "summary_bullets": [
                "Anomaly detected: connection behavior deviated from baseline.",
                "Handshake-level indicators suggest interception or proxying.",
                "Review local proxy/certificate configuration."
            ],
            "evidence": [
                {"signal": "gemini_output_parse_failed", "observation": raw[:200], "why_it_matters": "Model output wasn't valid JSON"}
            ],
            "probabilities": {"tls_interception": 0.5, "benign_proxy": 0.3, "network_variance": 0.2},
            "severity": "MEDIUM",
            "next_steps": [
                "Check system/browser proxy settings.",
                "Verify certificate issuer for the connection.",
                "Disable proxy and retry the same requests.",
                "Compare handshake timing on another network.",
                "If persistent, treat as possible interception."
            ]
        }
