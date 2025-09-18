import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function AppHeader() {
    const menuOptions = [
        { id: 1, name: 'Home', path: '/dashboard' }, // typo fixed from /dadhboard
        { id: 2, name: 'History', path: '/history' },
        { id: 3, name: 'Profile', path: '/profile' },
        { id: 4, name: 'Pricing', path: '/pricing' },
    ]

    return (
        <div className="flex items-center justify-between p-4 shadow md:px-20 lg:px-40">
            <Image src="/logo.svg" alt="logo" width={154} height={34} />
            <div className="flex flex-row items-center justify-center gap-x-10 gap-y-2 mt-4 font-semibold">
                {menuOptions.map((option) => (
                    <Link key={option.id} href={option.path}>
                        <div className="flex flex-row items-center gap-x-2 hover:bg-gray-200 rounded-md p-2 cursor-pointer">
                            <h2>{option.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
            <UserButton />
        </div>
    )
}

export default AppHeader
