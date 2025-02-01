import { auth } from '../lib/firebase.js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user && router.pathname !== '/login') {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;