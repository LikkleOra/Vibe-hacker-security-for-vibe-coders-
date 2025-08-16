import { Secret } from '../lib/secrets';

interface IssueCardProps {
  issue: Secret;
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-bold">{issue.type}</h3>
      <p><strong>File:</strong> {issue.file}</p>
      <p><strong>Line:</strong> {issue.line}</p>
      <div className="bg-gray-100 p-2 rounded mt-2">
        <code>{issue.snippet}</code>
      </div>
    </div>
  );
}
