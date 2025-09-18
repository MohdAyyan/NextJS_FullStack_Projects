import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Billing() {
  return (
    <div className='px-10 mt-4'>
        <h2 className='text-3xl font-bold'>Join Subscription</h2>
        <PricingTable/>

    </div>
  )
}

export default Billing