"use client";

import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({children}: {children: React.ReactNode}) => {
  const {session} = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (session) {
      router.push("/");
    }
    setIsLoading(false);
  }, [session, router]);

  // Show nothing while checking session
  if (isLoading) {
    return null;
  }

  // Don't render anything if user is already logged in
  if (session) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      <div className="relative">{children}</div>
    </div>
  );
}

export default Layout;
