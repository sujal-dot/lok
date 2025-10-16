import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard.jsx'
import Incidents from '@/pages/Incidents.jsx'
import Cases from '@/pages/Cases.jsx'
import Evidence from '@/pages/Evidence.jsx'
import Officers from '@/pages/Officers.jsx'
import PublicHome from '@/pages/PublicHome.jsx'
import CrimePrediction from '@/pages/CrimePrediction.jsx'
import CrimeAnalytics from '@/pages/CrimeAnalytics.jsx'
import HotspotMapping from '@/pages/HotspotMapping.jsx'
import PatrolPlanning from '@/pages/PatrolPlanning.jsx'
import FaceRecognition from '@/pages/FaceRecognition.jsx'
import PersonsOfInterest from '@/pages/PersonsOfInterest.jsx'
import ReportSafetyConcern from '@/pages/ReportSafetyConcern.jsx'
import TestPage from '@/pages/TestPage.jsx'
import SimpleTest from '@/pages/SimpleTest.jsx'
import CommunitySafetyPortal from '@/pages/CommunitySafetyPortal.jsx'


export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<CommunitySafetyPortal />} />
      <Route path="/report" element={<ReportSafetyConcern />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/simple" element={<SimpleTest />} />
      <Route path="/safety-portal" element={<CommunitySafetyPortal />} />
      
      {/* Police Command Center Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/incidents" element={<Incidents />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/evidence" element={<Evidence />} />
      <Route path="/officers" element={<Officers />} />
      <Route path="/crime-prediction" element={<CrimePrediction />} />
      <Route path="/crime-analytics" element={<CrimeAnalytics />} />
      <Route path="/hotspot-mapping" element={<HotspotMapping />} />
      <Route path="/patrol-planning" element={<PatrolPlanning />} />
      <Route path="/face-recognition" element={<FaceRecognition />} />
      <Route path="/persons-of-interest" element={<PersonsOfInterest />} />
    </Routes>
  )
}
