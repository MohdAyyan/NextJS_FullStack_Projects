import { AIDoctorAgents } from '@/shared/list'
import React from 'react'
import DoctorAgentCard from './DoctorAgentCard'

function DoctorsAgentList() {
  return (
    <div className='mt-10'>
        <h2 className='font-bold text-xl mb-6'>AI Specialist Doctors Agent</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7'>
            {AIDoctorAgents.map((doctor)=>(
                <div key={doctor.id}>
                    <DoctorAgentCard  doctorAgent={doctor}/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default DoctorsAgentList