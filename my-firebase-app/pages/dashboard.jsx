import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import Map from "../components/Map"; // Import the Map component

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Reset user state
      router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome, {user?.displayName}</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>

      {/* Render the Map component */}
      <div className="w-full max-w-4xl">
        {user && <Map mapKey={user.uid} />} {/* Use mapKey instead of key */}
      </div>
    </div>
  );
}