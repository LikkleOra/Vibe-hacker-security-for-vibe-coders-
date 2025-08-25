
import subprocess
import json

def run_scan(path="."):
    """
    Invokes the Semgrep CLI, captures the JSON output, and parses it.
    """
    try:
        command = ["semgrep", "--config=auto", "--json", path]
        # Using capture_output=True to get stdout/stderr
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,  # Decode stdout/stderr as text
            check=True  # Raise an exception for non-zero exit codes
        )
        return json.loads(result.stdout)
    except FileNotFoundError:
        print("Error: 'semgrep' command not found. Is it installed and in your PATH?")
        return None
    except subprocess.CalledProcessError as e:
        print(f"Semgrep exited with error code {e.returncode}:")
        print(e.stderr)
        return None
    except json.JSONDecodeError:
        print("Error: Failed to parse Semgrep's JSON output.")
        return None

if __name__ == '__main__':
    # Example of how to run the scanner and print the results
    findings = run_scan()
    if findings:
        print(json.dumps(findings, indent=2))
