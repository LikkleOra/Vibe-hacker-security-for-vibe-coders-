
import json
import sys

def check_results():
    with open('vibesec/final_coached_results.json') as f:
        results = json.load(f)

    high_severity_issues = []
    for result in results:
        if result.get('severity') == 'HIGH':
            high_severity_issues.append(result)

    if high_severity_issues:
        print(f"Found {len(high_severity_issues)} HIGH severity issues:")
        for issue in high_severity_issues:
            print(f"- {issue.get('description')}")
        sys.exit(1)
    else:
        print("No HIGH severity issues found.")
        sys.exit(0)

if __name__ == "__main__":
    check_results()
