import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'
import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'

export type doctorAgent={
    id:number,
    specialist:string,
    description:string,
    image:string,
    agentPrompt:string,
    voiceId?:string,
    subscriptionRequired:boolean
}

type props={
  doctorAgent:doctorAgent
}
function DoctorAgentCard({ doctorAgent}:props) {
  
  const {has} = useAuth()
  //@ts-ignore
  const paidUser = doctorAgent.subscriptionRequired && has('pro')
  
  return (
    <div className='relative'>
     {doctorAgent.subscriptionRequired &&
     
     <Badge className='absolute m-2 p-2'>
      Premium
      </Badge>
     }
      
      <Image 
     className='w-full object-cover h-[250px] rounded-2xl'
      src={doctorAgent.image} alt={doctorAgent.specialist} width={200} height={300}/>
      <h2 className='font-bold '>{doctorAgent.specialist}</h2>
      <p className='line-clamp-2 mt-2 text-sm text-gray-500'>{doctorAgent.description}</p>
      <Button className='w-full mt-2 cursor-pointer ' disabled={!paidUser} >Start Consultation <IconArrowRight/> </Button>

      </div>
  )
}

export default DoctorAgentCard