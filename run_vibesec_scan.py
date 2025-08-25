import json
import sys
from vibesec.semgrep_runner import run_scan
from vibesec.post_processor import add_vibes_to_findings
from vibesec.ai_coach import add_ai_coaching

def run_full_scan(path_to_scan):
    """
    Runs the full VibeSec pipeline:
    1. Scans with Semgrep.
    2. Adds vibe messages.
    3. Adds AI coaching.
    """
    print(f"Starting VibeSec scan on: {path_to_scan}")

    # Phase 1: Run Semgrep
    print("Phase 1: Running Semgrep scan...")
    semgrep_results = run_scan(path_to_scan)
    if not semgrep_results or "results" not in semgrep_results or not semgrep_results["results"]:
        print("Scan finished with no results.")
        return None
    print(f"Found {len(semgrep_results['results'])} initial findings.")

    # Phase 2: Add Vibe Messages
    print("\nPhase 2: Adding Vibe messages...")
    results_with_vibes = add_vibes_to_findings(semgrep_results)
    print("Vibe messages added.")

    # Phase 3: Add AI Coaching
    print("\nPhase 3: Adding AI coaching (simulated)...")
    coached_results = add_ai_coaching(results_with_vibes)
    print("AI coaching added.")

    return coached_results

if __name__ == "__main__":
    # By default, scan the current directory (project root).
    scan_path = "." 
    if len(sys.argv) > 1:
        scan_path = sys.argv[1]

    final_results = run_full_scan(scan_path)

    if final_results:
        print("\n--- FINAL RESULTS ---")
        output_path = "vibesec/final_coached_results.json"
        with open(output_path, "w") as f:
            json.dump(final_results, f, indent=2)
        print(f"\nResults saved to {output_path}")
