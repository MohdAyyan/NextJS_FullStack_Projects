import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import AdminDashboard from './AdminDashboardClient';
import Navbar from '@/components/Navbar';

export default async function AdminPage() {
  
    const user = await currentUser();
    if(!user) redirect('/');

    const adminEmail = process.env.ADMIN_EMAIL;
    if(user.emailAddresses[0].emailAddress !== adminEmail) redirect('/dashboard');


  
    return (
    <div>
       <AdminDashboard />
    </div>
  )
}
