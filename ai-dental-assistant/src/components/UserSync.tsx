"use client"
import { syncUser } from '@/lib/actions/users';
import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'

function UserSync() {
    const {isSignedIn,isLoaded} = useUser();

    useEffect(() => {

        const handleSync = async () => {
            if (isLoaded && isSignedIn) {
                try {
                    await syncUser(); 
                }
                catch(error){
                    console.log("Error syncing user on client:", error);
                }
            };
        };
        handleSync();


    },[isLoaded,isSignedIn])

    return null;
    
}

export default UserSync