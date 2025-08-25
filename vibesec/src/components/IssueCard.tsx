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
      {issue.ai_coach_notes && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-md font-bold">VibeBot&apos;s Coaching</h4>
          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
            <p className='italic'>&quot;{issue.ai_coach_notes.vibe}&quot;</p>
          </div>
          <div className="mt-2">
            <p><strong>The Jargon:</strong> {issue.ai_coach_notes.jargon_explanation}</p>
            <p><strong>The Risk:</strong> {issue.ai_coach_notes.risk_analysis}</p>
            <p><strong>The Fix:</strong></p>
            <div className="bg-gray-100 p-2 rounded mt-1">
              <code>
                {issue.ai_coach_notes.suggested_fix}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}