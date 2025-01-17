"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      router.push('./project1/turning');
    }
  
  }, [router]);

  return null; // or a loading spinner while redirecting
}
