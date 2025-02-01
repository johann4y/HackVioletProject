import { useEffect } from 'react';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';

export default function AuthCheck({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
}