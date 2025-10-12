import React from 'react'
import NextAppointment from './NextAppointment'
import DentalHealthOverview from './DentalHealthOverview'


function ActivityOverview() {
  return (
    <div>
        <DentalHealthOverview />
        <NextAppointment />
    </div>
  )
}

export default ActivityOverview