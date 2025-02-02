import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { signOut } from "firebase/auth";
import Map from "../components/Map"; // Import the Map component

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/login');
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome, {auth.currentUser?.email}</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>

      {/* Render the Map component */}
      <div className="w-full max-w-4xl">
        <Map />
      </div>
    </div>
  );
}
