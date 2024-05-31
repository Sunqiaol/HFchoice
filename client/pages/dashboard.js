import React from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../firebase'; // Make sure you have configured Firebase correctly

const Dashboard = () => {
    const router = useRouter();

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

    return (
        <div>
            <h1>Welcome To HF</h1>
            <button onClick={signOutUser}>Sign Out</button>
        </div>
    );
};

export default Dashboard;
