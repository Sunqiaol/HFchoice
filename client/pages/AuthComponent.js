import React, { useEffect, useState } from 'react';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import axios from 'axios';
import { app } from '../firebase'; // Ensure Firebase is correctly configured

const AuthComponent = () => {
    const router = useRouter();
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
        const fetchUserDetails = async (uid) => {
            try {
                const userCredential = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/getUser`, { uid });
                console.log(userCredential.data.role);
                if(userCredential.data.role == "Viewer"){
                    router.push('/dashboard');
                }
                else if(userCredential.data.role == "Admin"){
                    router.push('/admin')
                }
            } catch (error) {
                console.error("Error Fetching : ", error);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                console.log(uid);
                fetchUserDetails(uid);
            } else {
                router.push('/login');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [auth, router]);

    return (
        <div>
            <h1>Welcome To HF</h1>
            <button onClick={signOutUser}>Sign Out</button>
        </div>
    );
};

export default AuthComponent;
