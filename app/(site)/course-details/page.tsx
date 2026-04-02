'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Old route - redirect to /courses
export default function CourseDetailsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/courses');
  }, [router]);
  return null;
}
