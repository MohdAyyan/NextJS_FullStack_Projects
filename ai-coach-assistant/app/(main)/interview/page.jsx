import { getAssessments } from '@/actions/interview';
import React from 'react'
import PerformanceChart from './_components/performance-chart';
import QuizList from './_components/quiz-list';
import StatsCards from './_components/stats-card';

async function InterviewPrepPage() {
  const assessments = await getAssessments();
  return (
    <div>
    <div className="flex items-center justify-between mb-5">
      <h1 className="text-6xl font-bold gradient-title">
        Interview Preparation
      </h1>
    </div>
    <div className="space-y-6">
    <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
        <StatsCards assessments={assessments} />
    </div>
    </div>
  )
}

export default InterviewPrepPage