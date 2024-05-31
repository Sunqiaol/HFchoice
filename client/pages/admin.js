// pages/admin.js
import React, { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import useAuth from '../hooks/useAuth';
import { app } from '../firebase'; // Ensure Firebase is correctly configured

const Admin = () => {
    const router = useRouter();
    const { user, role, loading } = useAuth(); // Destructure loading state
    const auth = getAuth(app);

    const signOutUser = () => {
        signOut(auth)
            .then(() => {
                console.log("User signed out.");
                router.push('/login'); // Redirect to login page after sign out
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    useEffect(() => {
        if (!loading && role !== 'Admin') { // Check loading state
            router.push('/dashboard'); // Redirect to dashboard if not admin
        }
    }, [role, loading, router]); // Include loading in dependency array

    if (loading) {
        return <div>Loading...</div>; // Show loading spinner while loading
    }

    return (
        <div>
            <h1>Welcome To Admin</h1>
            <button onClick={signOutUser}>Sign Out</button>
        </div>
    );
};

export default Admin;
