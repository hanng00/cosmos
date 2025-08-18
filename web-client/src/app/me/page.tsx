"use client";

import { useMe } from "@/features/account/hooks";

export default function MePage() {
  const { data, isLoading, error } = useMe();
  if (error) return <div className="p-6">Error: {(error as Error).message}</div>;
  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!data) return <div className="p-6">Signed out</div>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Me</h1>
      <div className="mt-4 space-y-1">
        <div><span className="font-medium">User ID:</span> {data.userId}</div>
        <div><span className="font-medium">Email:</span> {data.email ?? "(none)"}</div>
      </div>
    </div>
  );
}


