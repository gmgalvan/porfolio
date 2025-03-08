"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/en');
  }, [router]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
