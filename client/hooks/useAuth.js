// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { useRouter } from 'next/router';
import { app } from '../firebase'; // Ensure Firebase is correctly configured

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const router = useRouter();
    const auth = getAuth(app);

    useEffect(() => {
        const fetchUserDetails = async (uid) => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/getUser`, { uid });
                setRole(response.data.role);
            } catch (error) {
                console.error("Error fetching user details:", error);
                router.push('/login');
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchUserDetails(user.uid);
            } else {
                router.push('/login');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [auth, router]);

    return { user, role, loading }; // Return loading state
};

export default useAuth;
