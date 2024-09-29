'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Updated to use next/navigation

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null;
};

export default RedirectPage;
