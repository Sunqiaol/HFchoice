import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Logged in Successfully');
            router.push('/AuthComponent');
        } catch (error) {
            let userErrorMessage = '';

            if (error.code === 'auth/invalid-email') {
                userErrorMessage = 'Invalid Email';
            } else if (error.code === 'auth/missing-password') {
                userErrorMessage = 'Missing Password';
            } else if (error.code === 'auth/wrong-password') {
                userErrorMessage = 'Incorrect Password';
            } else {
                userErrorMessage = 'Incorrect User Credentials';
            }
            setError(userErrorMessage);
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">HF Choice</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type='email'
                        placeholder='Enter Your Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type='password'
                        placeholder='Enter Your Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type='submit'
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>
                {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
                <div className="mt-6 text-center">
                    <Link href='/signup'>
                        <h1 className="text-indigo-600 hover:underline">Don&apos;t have an account? Sign Up</h1>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
