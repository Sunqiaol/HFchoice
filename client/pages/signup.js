import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import Link from 'next/link';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSelector from '../components/ui/LanguageSelector';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();
    const { t } = useTranslation();

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const firebaseId = user.uid;
            const role = 'Viewer';
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/addUser`, { firebaseId, email, role });
                router.push('/AuthComponent');
            } catch (error) {
                console.error('Error signing up:', error.response ? error.response.data : error.message);
                setError('Failed to sign up, please try again.');
            }
        } catch (error) {
            console.error('Error signing up:', error.code, error.message);
            setError('Failed to sign up, please try again.');
        }
    };

    return (
        <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100'>
            <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold text-center flex-grow'>{t('auth.signUp')}</h1>
                    <LanguageSelector />
                </div>
                <form onSubmit={handleSignup} className='space-y-4'>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        placeholder={t('auth.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                    <input
                        type='password'
                        name='password'
                        id='password'
                        placeholder={t('auth.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                    <button
                        type='submit'
                        className='w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200'
                    >
                        {t('auth.signUp')}
                    </button>
                </form>
                {error && <p className='mt-4 text-red-600 text-center'>{error}</p>}
                <div className='mt-6 text-center'>
                    <Link href='/login'>
                        <h1 className='text-indigo-600 hover:underline'>{t('auth.alreadyHaveAccount')} {t('auth.signIn')}</h1>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
