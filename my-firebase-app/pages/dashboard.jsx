import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import Map from "../components/Map"; 

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);
  const [showDropdown, setShowDropdown] = useState(false); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe(); 
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); 
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-500">
      
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
        <div className="flex items-center justify-between p-4">
         
          <div className="text-2xl font-bold flex gap-10">
            <h1 className="text-gray-800 underline">AthenaSpot</h1>
            <h2 className="text-blue-500">Welcome, {user?.displayName}!</h2>
          </div>
          <div className="relative">
            <button
              className="bg-blue-500 px-5 py-3 cursor-pointer text-white font-bold"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Profile
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-gray-100 rounded-lg shadow-lg">
                
                <button
                  className="block px-4 py-2 text-left w-full hover:bg-gray-200 font-bold text-red-500"
                  onClick={handleSignOut}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

     
      <div className="pt-20 w-full max-w-6xl mx-auto p-4">
        
        {user && <Map mapKey={user.uid} />}
      </div>
    </div>
  );
}
