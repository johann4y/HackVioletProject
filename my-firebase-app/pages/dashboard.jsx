import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import Map from "../components/Map"; // Import the Map component

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Reset user state
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-500">
      {/* Header Section */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
        <div className="flex items-center justify-between p-4">
          {/* Left Title */}
          <div className="text-2xl font-bold underline text-gray-800">
            Athena Spot
          </div>

          {/* Right Profile Section */}
          <div className="relative">
            <img
              src={user?.photoURL || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg">
                <button
                  className="block px-4 py-2 text-left w-full hover:bg-gray-200"
                  onClick={() => alert("Go to Account Page")}
                >
                  Account
                </button>
                <button
                  className="block px-4 py-2 text-left w-full hover:bg-gray-200"
                  onClick={() => alert("Go to Settings Page")}
                >
                  Settings
                </button>
                <button
                  className="block px-4 py-2 text-left w-full hover:bg-gray-200 text-red-500"
                  onClick={handleSignOut}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 w-full max-w-6xl mx-auto p-4">
        {/* Map Section */}
        {user && <Map mapKey={user.uid} />}
      </div>
    </div>
  );
}
