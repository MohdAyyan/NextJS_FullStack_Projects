"use client"
import React, { useEffect } from 'react'
import axios from 'axios'

import { useUser } from '@clerk/nextjs';
import UserDetailContext from '@/context/UserDetailContext';




function Provider ({children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const {user} = useUser()
  const [userDetail, setUserDetail] = React.useState<any>() 
   useEffect(() => {
    createUser()
  },[user])

  const createUser = async () => {
    try {
      const response = await axios.post('/api/users');
      setUserDetail(response.data); // <-- set the user detail here
      console.log(response.data);
      setUserDetail(response.data);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create user');
    }
  };

  
    return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      {children}
      </UserDetailContext.Provider>
  )
}

export default Provider

 