import { secretPatterns } from './patterns';

export interface Secret {
  type: string;
  file: string;
  line: number;
  snippet: string;
  ai_coach_notes?: {
    jargon_explanation: string;
    risk_analysis: string;
    suggested_fix: string;
    vibe: string;
  };
}

export function scanForSecrets(fileContent: string, fileName: string): Secret[] {
  const secrets: Secret[] = [];
  const lines = fileContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { type, pattern } of secretPatterns) {
      const matches = line.matchAll(pattern);
      for (const match of matches) {
        secrets.push({
          type,
          file: fileName,
          line: i + 1,
          snippet: maskSecret(line, match[0]),
        });
      }
    }
  }

  return secrets;
}

function maskSecret(line: string, secret: string): string {
  if (secret.length < 4) {
    return line.replace(secret, '****');
  }
  const masked = secret.substring(0, 2) + '****' + secret.substring(secret.length - 2);
  return line.replace(secret, masked);
}
