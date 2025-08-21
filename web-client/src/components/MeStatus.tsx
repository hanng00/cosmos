"use client";

import { useMe } from "@/features/auth/useMe";

type Props = {
  className?: string;
};

export function MeStatus({ className }: Props) {
  const { data, isLoading, error } = useMe();

  if (isLoading) return <span className={className}>Loading…</span>;
  if (error) return <span className={className}>Error: {(error as Error).message}</span>;
  if (!data) return <span className={className}>Signed out</span>;
  return (
    <span className={className}>
      {data.email ? data.email : `User ${data.userId}`}
    </span>
  );
}


