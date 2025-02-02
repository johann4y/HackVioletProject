import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from "firebase/auth";
import bluebackground from '../public/bluebackground.jpg';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex">
      <div className='min-h-screen w-full flex flex-col items-center justify-center text-white'
      style={{
        backgroundImage: `url(${bluebackground.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      >
        <h1 className='text-9xl underline'>AthenaSpot</h1>
        <p className='py-10 '>by Gabe and Johann</p>

        <p className='text-2xl'>Our platform helps you report incidents, analyze danger spots, and make safe decisions</p>
        <h1 className="text-4xl font-bold mb-8 text-center px-10">Sign in to stay connected, safe, and aware</h1>
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 text-white text-lg font-bold py-4 px-8 rounded-lg transform transition-transform duration-300 hover:scale-105"
        >
          Google Sign In :)
        </button>

      </div>
      
        
      
    </div>
  );
}