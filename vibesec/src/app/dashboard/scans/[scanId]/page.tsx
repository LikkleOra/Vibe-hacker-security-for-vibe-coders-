"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ScanDetailsPage() {
  const params = useParams();
  const scanId = params.scanId as Id<"scans">;
  const scan = useQuery(api.scans.getScanById, { scanId });

  if (!scan) {
    return <div>Scan not found</div>;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Scan Report</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">{scan.url}</h2>
          <p className="text-gray-500 mb-4">Status: {scan.status}</p>

          {scan.report && scan.report.length > 0 ? (
            <div>
              <h3 className="text-lg font-bold mb-2">Vulnerabilities</h3>
              <div className="space-y-4">
                {scan.report.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-2">{item.vulnerability}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Severity:</span> {item.severity}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Description:</span> {item.description}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Proof of Concept:</span> <code>{item.poc}</code>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Fix:</span> {item.fix}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Educational Notes:</span> {item.educationalNotes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No vulnerabilities found.</p>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
