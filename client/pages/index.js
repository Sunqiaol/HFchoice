import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/AuthComponent');
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while checking auth state
  }

  return <div>Redirecting...</div>; // Show a redirecting message
}
