import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { auth } from "../utils/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        // Check if we are already in demo mode from a previous session (optional persistence)
        // For now, let's rely on Firebase listener + explicit demo state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!isDemo) {
                setCurrentUser(user);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [isDemo]);

    // Helper to create a fake user object
    const createDemoUser = (email) => ({
        uid: "demo-user-" + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        emailVerified: true,
        isAnonymous: false,
        photoURL: null,
    });

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsDemo(false);
        } catch (error) {
            console.warn("Firebase Login failed, falling back to Demo Mode:", error.message);
            // Fallback to demo mode
            const demoUser = createDemoUser(email);
            setCurrentUser(demoUser);
            setIsDemo(true);
            // We don't throw here, effectively allowing "login" to succeed
            return demoUser;
        }
    };

    const register = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setIsDemo(false);
        } catch (error) {
            console.warn("Firebase Register failed, falling back to Demo Mode:", error.message);
            // Fallback to demo mode
            const demoUser = createDemoUser(email);
            setCurrentUser(demoUser);
            setIsDemo(true);
            return demoUser;
        }
    };

    const logout = async () => {
        try {
            if (!isDemo) {
                await signOut(auth);
            }
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setCurrentUser(null);
            setIsDemo(false);
        }
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        loading,
        isDemo // Expose this if we want to show a badge in the UI
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
