"use client";

import { useEffect, useState } from "react";

export function ClientOnlyTimestamp({ timestamp }: { timestamp: number }) {
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // This ensures that the date is formatted in the user's locale
    // without causing a hydration mismatch.
    setDateString(new Date(timestamp).toLocaleString());
  }, [timestamp]);

  // Render a placeholder on the server and during the initial client render.
  if (!dateString) {
    return null;
  }

  return <>{dateString}</>;
}
