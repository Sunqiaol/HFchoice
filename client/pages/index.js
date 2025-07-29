import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import Head from 'next/head';

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
    return (
      <div>
        <Head>
          <title>HFChoice (HungFa) - Premier Marketplace</title>
        </Head>
        <h1>Welcome to HFChoice (HungFa)</h1>
        <p>Your premier marketplace for quality products and services</p>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>HFChoice (HungFa) - Premier Marketplace</title>
      </Head>
      <h1>HFChoice (HungFa)</h1>
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
