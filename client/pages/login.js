import { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSelector from '../components/ui/LanguageSelector';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();
    const { t } = useTranslation();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
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
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/AuthComponent');
        } catch (error) {
            setError('Google sign-in failed. Please try again.');
        }
    };

    return (
        <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-blue-200 p-4'>
            <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h1 className='text-3xl font-extrabold text-center text-indigo-700 tracking-tight flex-grow'>{t('header.title')}</h1>
                    <LanguageSelector />
                </div>
                <p className='text-center text-gray-500 mb-4'>Welcome back! Please login to your account.</p>
                <form onSubmit={handleLogin} className='space-y-4'>
                    <input
                        type='email'
                        placeholder={t('auth.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition'
                    />
                    <input
                        type='password'
                        placeholder={t('auth.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition'
                    />
                    <button
                        type='submit'
                        className='w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow'
                    >
                        {t('auth.signIn')}
                    </button>
                </form>
                <div className='flex items-center my-2'>
                    <div className='flex-grow border-t border-gray-200'></div>
                    <span className='mx-2 text-gray-400 text-sm'>or</span>
                    <div className='flex-grow border-t border-gray-200'></div>
                </div>
                <button
                    onClick={handleGoogleSignIn}
                    className='w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg shadow hover:bg-gray-50 transition font-semibold text-gray-700'
                >
                    <svg className='w-5 h-5' viewBox='0 0 48 48'><g><path fill='#4285F4' d='M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.13 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z'/><path fill='#34A853' d='M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.99 37.09 46.1 31.3 46.1 24.55z'/><path fill='#FBBC05' d='M10.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.99 16.09 0 19.91 0 24c0 4.09.99 7.91 2.69 12.24l7.98-6.2z'/><path fill='#EA4335' d='M24 48c6.13 0 11.64-2.03 15.53-5.53l-7.19-5.59c-2.01 1.35-4.59 2.15-8.34 2.15-6.38 0-11.87-3.59-14.33-8.79l-7.98 6.2C6.71 42.18 14.82 48 24 48z'/><path fill='none' d='M0 0h48v48H0z'/></g></svg>
                    {t('auth.signInWithEmail')}
                </button>
                {error && <p className='mt-2 text-red-600 text-center text-sm'>{error}</p>}
                <div className='mt-4 text-center'>
                    <Link href='/signup'>
                        <span className='text-indigo-600 hover:underline font-medium'>{t('auth.dontHaveAccount')} {t('auth.signUp')}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
