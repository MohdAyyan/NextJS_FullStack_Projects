import Navbar from '@/components/Navbar';
import FeatureCards from '@/components/voice/FeatureCard';
import ProPlanRequired from '@/components/voice/ProPlanRequired';
import WelcomeSection from '@/components/voice/WelcomeSection';
import { auth } from '@clerk/nextjs/server';
import React from 'react'

async function VoicePage() {
  
  const {has} = await auth();
    const hasProPlan = has({plan: "ai_basic"}) || has({plan: "ai_pro"})
    if(!hasProPlan) <ProPlanRequired />
  
    return (

         <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
            <WelcomeSection />
            <FeatureCards/>
         </div>
         </div>
        )
    
}

export default VoicePage