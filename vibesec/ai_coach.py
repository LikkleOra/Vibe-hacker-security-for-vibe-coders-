

import json
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv(".env.local")

# Configure the Gemini API
try:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in .env.local")
    genai.configure(api_key=api_key)
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    # Exit or handle the error as appropriate
    exit(1)

def generate_ai_prompt(finding):
    """
    Takes a Semgrep finding and generates a detailed, on-vibe prompt for an AI coach.
    """
    file_path = finding.get("path")
    start_line = finding.get("start", {}).get("line")
    code_snippet = finding.get("extra", {}).get("lines", "[Code snippet not available]")
    semgrep_message = finding.get("extra", {}).get("message")
    check_id = finding.get("check_id")

    # This would be our Vibe message from the post-processor
    vibe_message = finding.get("extra", {}).get("vibe_message", "")

    prompt = f"""You are \"VibeBot,\" a senior developer and security expert who is also a world-class coach. Your tone is helpful, encouraging, and clear. You are mentoring a developer.

**Context:**
- **File:** {file_path}
- **Line:** {start_line}
- **The Code Snippet:**
```
{code_snippet}
```
- **The Issue:** Semgrep found a \"{check_id}\" issue.
- **The Default Message:** \"{semgrep_message}\"\n- **Our Vibe:** \"{vibe_message}\"\n
**Your Task:**

1.  **Explain the Jargon:** In simple terms, what is this type of issue? Avoid overly technical language.
2.  **Explain the Risk:** Why is this a problem *in this specific code*? What's the \"so what\"?
3.  **Provide a Fix:** Give a clear, actionable code suggestion to resolve the issue. If you can, provide the corrected code snippet.
4.  **Keep the Vibe:** Be encouraging! Start with a positive and collaborative tone.
"""

    return prompt

def get_ai_response(prompt):
    """
    Sends a prompt to the Gemini API and returns the response.
    """
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        # Assuming the response is a JSON string, parse it.
        # If the AI doesn't return perfect JSON, this might need more robust parsing.
        return json.loads(response.text)
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        # Return a default error message or handle it as needed
        return {
            "jargon_explanation": "Could not get AI analysis.",
            "risk_analysis": "There was an error contacting the AI coach.",
            "suggested_fix": "Please check your API key and network connection.",
            "vibe": "The AI coach seems to be unavailable at the moment."
        }

def add_ai_coaching(semgrep_results_with_vibes):
    """
    Takes enriched findings, generates a prompt for each,
    and adds a real AI coaching response.
    """
    if not semgrep_results_with_vibes or "results" not in semgrep_results_with_vibes:
        return semgrep_results_with_vibes

    coached_results = []
    for finding in semgrep_results_with_vibes.get("results", []):
        prompt = generate_ai_prompt(finding)
        ai_response = get_ai_response(prompt)
        finding["extra"]["ai_coach_notes"] = ai_response
        coached_results.append(finding)

    semgrep_results_with_vibes["results"] = coached_results
    return semgrep_results_with_vibes

if __name__ == '__main__':
    # This is a sample finding, taken from our previous semgrep run.
    sample_finding = {
      "check_id": "javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal",
      "path": "vibesec/convex/scans.ts",
      "start": { "line": 14 },
      "extra": {
        "message": "Detected possible user input going into a `path.join` or `path.resolve` function...",
        "lines": "    const filePath = path.join(os.tmpdir(), scan.storageId);",
        "severity": "WARNING",
        "vibe_message": "Vibe check... Heads up! This is worth a look."
      }
    }
    
    sample_results = {"results": [sample_finding]}
    coached_data = add_ai_coaching(sample_results)
    print(json.dumps(coached_data, indent=2))
