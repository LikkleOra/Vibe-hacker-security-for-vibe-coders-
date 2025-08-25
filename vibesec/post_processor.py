import json

def get_vibe_message(finding):
    """
    Adds a custom "vibe" message based on the finding's severity.
    """
    severity = finding.get("extra", {}).get("severity")
    check_id = finding.get("check_id")
    vibe = "Vibe check... "

    if severity == "WARNING":
        vibe += "Heads up! This is worth a look. We've seen this pattern cause trouble before."
    elif severity == "ERROR":
        vibe += "Whoa, take a moment here. This is a high-priority issue that needs your attention."
    else:
        vibe += "Just a friendly note on code style or a potential improvement."

    # Custom message for a specific check
    if "path-traversal" in check_id:
        vibe += "\nSpecifically, this looks like a path traversal risk. Make sure any user input used for file paths is sanitized. Never trust input!"

    return vibe

def add_vibes_to_findings(semgrep_results):
    """
    Takes Semgrep findings as a dictionary, adds a vibe message to each,
    and returns the enriched data.
    """
    if not semgrep_results or "results" not in semgrep_results:
        return semgrep_results

    enriched_results = []
    for finding in semgrep_results.get("results", []):
        finding["extra"]["vibe_message"] = get_vibe_message(finding)
        enriched_results.append(finding)

    semgrep_results["results"] = enriched_results
    return semgrep_results

if __name__ == "__main__":
    # This allows the script to be run directly for testing purposes.
    # It assumes results.json is in the parent directory.
    try:
        with open("../results.json", 'r') as f:
            data = json.load(f)
        enriched_data = add_vibes_to_findings(data)
        if enriched_data:
            print(json.dumps(enriched_data, indent=2))
    except FileNotFoundError:
        print("Error: The file ../results.json was not found. Run semgrep first.")
    except json.JSONDecodeError:
        print("Error: Could not decode JSON from ../results.json.")