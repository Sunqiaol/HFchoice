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
                router.push('/login'); // Redirect to login page after sign out
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    useEffect(() => {
        const fetchUserDetails = async (uid, email) => {
            try {
                const userCredential = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/getUser`, { uid });
                if(userCredential.data.role == "Viewer"){
                    router.push('/dashboard');
                }
                else if(userCredential.data.role == "Admin"){
                    router.push('/admin')
                }
            } catch (error) {
                // If user not found, add user and try again
                if (error.response && error.response.status === 404) {
                    try {
                        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/addUser`, {
                            firebaseId: uid,
                            email: email,
                            role: 'viewer'
                        });
                        // Try fetching again
                        const userCredential = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/getUser`, { uid });
                        if(userCredential.data.role == "Viewer"){
                            router.push('/dashboard');
                        }
                        else if(userCredential.data.role == "Admin"){
                            router.push('/admin')
                        }
                    } catch (addUserError) {
                        console.error("Error adding user:", addUserError);
                    }
                } else {
                    console.error("Error Fetching : ", error);
                }
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                const email = user.email;
                fetchUserDetails(uid, email);
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
