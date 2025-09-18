import Image from 'next/image'
import React from 'react'
import { doctorAgent } from './DoctorAgentCard'

type props={
  doctorAgent:doctorAgent,
  setSelectDoctor:any,
  selectedDoctor:doctorAgent,
}

function SuggestDoctor({ doctorAgent, setSelectDoctor, selectedDoctor }: props) {
  return (
    <div
      className={`flex flex-col items-center border rounded-2xl hover:border-blue-500 cursor-pointer shadow-md p-2 ${selectedDoctor?.id === doctorAgent.id ? 'border-blue-500' : ''}`}
      onClick={() => setSelectDoctor(doctorAgent)}
    >
      <Image alt={doctorAgent.specialist} width={70} src={doctorAgent.image} height={70} className='w-[50px] h-[50px] rounded-4xl object-cover' />
      <h2 className='font-bold text-center'>{doctorAgent.specialist}</h2>
      <p className='line-clamp-2 mt-2 text-sm text-gray-500 text-center'>{doctorAgent.description}</p>
    </div>
  )
}

export default SuggestDoctor