"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { scanForSecrets, Secret } from '../lib/secrets';
import { IssueCard } from './IssueCard';

export function RepoUpload() {
  const [secrets, setSecrets] = useState<Secret[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const zip = await JSZip.loadAsync(file);
      const allSecrets: Secret[] = [];
      for (const fileName in zip.files) {
        if (!zip.files[fileName].dir) {
          const fileContent = await zip.files[fileName].async('string');
          const foundSecrets = scanForSecrets(fileContent, fileName);
          allSecrets.push(...foundSecrets);
        }
      }
      setSecrets(allSecrets);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const downloadReport = () => {
    let report = '# VibeSec Report\n\n';
    report += `Found ${secrets.length} secrets.\n\n`;
    for (const secret of secrets) {
      report += `## ${secret.type}\n`;
      report += `* File: ${secret.file}\n`;
      report += `* Line: ${secret.line}\n`;
      report += `* Snippet: \`${secret.snippet}\`\n\n`;
    }

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibesec-report.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the ZIP file here ...</p>
        ) : (
          <p>Drag &apos;n&apos; drop a ZIP file here, or click to select a file</p>
        )}
      </div>
      {secrets.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Found Secrets</h2>
            <button onClick={downloadReport} className="bg-blue-500 text-white p-2 rounded">
              Download Report
            </button>
          </div>
          <div className="grid gap-4 mt-4">
            {secrets.map((secret, index) => (
              <IssueCard key={index} issue={secret} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
