export const secretPatterns = [
  { type: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g },
  { type: 'Google API Key', pattern: /AIza[0-9A-Za-z\\-_]{35}/g },
  { type: 'Private Key', pattern: /-----BEGIN PRIVATE KEY-----/g },
  { type: 'Bearer Token', pattern: /[Bb]earer [A-Za-z0-9\\-\\._~+\\/]+=*/g },
  { type: 'Password', pattern: /[Pp]assword\\s*=\\s*['\"](.*?)['\"]/g },
];
