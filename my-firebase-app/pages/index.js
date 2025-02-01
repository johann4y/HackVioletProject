import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return null; // This component will redirect automatically
}