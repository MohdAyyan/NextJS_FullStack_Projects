import React from 'react'
import ResumeBuilder from './_components/resume-builder'
import { getResume } from '@/actions/resume'

async function ResumePage() {

  // Fetch existing resume data from your backend or database
  const resume = await getResume();
  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  )
}

export default ResumePage