import React, { useState } from 'react'
import Page from '@/layout/Page'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { AlertTriangle, Users, Briefcase, FileText, Activity, PlusCircle, Users as UsersIcon, BookOpen, FileCheck, Database, BellRing, TrendingUp, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import CrimeHeatmap from '@/components/dashboard/CrimeHeatmap'
import AIPatrolSuggestion from '@/components/dashboard/AIPatrolSuggestion'

export default function Dashboard() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const stats = [
    { title: 'Active Incidents', value: 9, icon: AlertTriangle, trend: { text: '+3 today', positive: true }, color: 'blue' },
    { title: 'Officers On Duty', value: 12, icon: Users, trend: { text: '85% capacity', positive: true }, color: 'green' },
    { title: 'Open Cases', value: 5, icon: Briefcase, trend: { text: '-2 this week', positive: false }, color: 'amber' },
    { title: 'Evidence Items', value: 6, icon: FileText, trend: { text: '+12 this month', positive: true }, color: 'violet' },
  ]
  
  const items = [
    { title: 'Theft', priority: 'high', priorityColor: 'yellow', status: 'resolved', statusColor: 'green', location: 'Viviana Mall, Ghodbunder Road, Thane West', when: new Date().toISOString() },
    { title: 'Traffic Violation', priority: 'medium', priorityColor: 'yellow', status: 'closed', statusColor: 'gray', location: 'Teen Hath Naka, Thane West', when: new Date().toISOString() },
    { title: 'Assault', priority: 'high', priorityColor: 'red', status: 'active', statusColor: 'yellow', location: 'Hiranandani Estate, Thane', when: new Date().toISOString() },
    { title: 'Drug Related', priority: 'medium', priorityColor: 'blue', status: 'investigating', statusColor: 'blue', location: 'Wagle Estate, Thane', when: new Date().toISOString() },
  ]
  
  const quickActions = [
    { label: 'Report New Incident', icon: PlusCircle, path: '/report', color: 'blue' },
    { label: 'Manage Officers', icon: UsersIcon, path: '/officers', color: 'green' },
    { label: 'View Active Cases', icon: BookOpen, path: '/cases', color: 'amber' },
    { label: 'Evidence Management', icon: FileCheck, path: '/evidence', color: 'violet' },
  ]
  
  const handleActionClick = (path) => {
    navigate(path)
  }
  
  const refreshDashboard = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }
  
  const systemStatus = {
    database: 'Online',
    api: 'Healthy',
    services: 'All Running',
    lastBackup: 'Today 02:30 AM'
  }

  return (
    <Page>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time overview of law enforcement operations</p>
        </div>
        <Button 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-all duration-300"
          onClick={refreshDashboard}
          disabled={isLoading}
        >
          Refresh Dashboard
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group"
          >
            <StatsCard {...stat} />
          </div>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Incidents */}
        <Card className="lg:col-span-2 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Recent Incidents</CardTitle>
                <CardDescription>Latest incidents reported in the area</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => navigate('/incidents')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecentActivity items={items} />
          </CardContent>
        </Card>
        
        {/* Quick Actions and System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Perform essential tasks quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  const colorClasses = {
                    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
                    green: 'bg-green-100 text-green-700 hover:bg-green-200',
                    amber: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
                    violet: 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                  }
                  
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`${colorClasses[action.color]} flex flex-col items-center justify-center p-4 h-24 text-sm font-medium transition-all duration-300 transform hover:scale-105`}
                      onClick={() => handleActionClick(action.path)}
                    >
                      <Icon size={24} className="mb-2" />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* System Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">System Status</CardTitle>
              <CardDescription>Current operational metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(systemStatus).map(([key, value], index) => {
                  const isOnline = key === 'database' || key === 'api' || key === 'services'
                  const isSuccess = key === 'database' || key === 'api' || key === 'services'
                  
                  return (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition-all duration-200 hover:bg-gray-100">
                      <div className="flex items-center gap-2">
                        {key === 'database' && <Database size={16} className="text-blue-600" />}
                        {key === 'api' && <Activity size={16} className="text-green-600" />}
                        {key === 'services' && <BellRing size={16} className="text-amber-600" />}
                        {key === 'lastBackup' && <FileCheck size={16} className="text-violet-600" />}
                        <span className="capitalize text-sm font-medium">{key}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOnline && (
                          <span className={`h-2.5 w-2.5 rounded-full ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        )}
                        <span className="text-sm text-gray-700">{value}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Crime Heatmap Section */}
      <div className="mt-6">
        <CrimeHeatmap />
      </div>
      
      {/* AI Crime Prediction System */}
        <div className="mt-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    AI Crime Prediction System
                  </CardTitle>
                  <CardDescription>Data-driven insights for the next 24 hours based on historical crime patterns</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate('/crime-prediction')}
                >
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Prediction Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Predicted Incidents</h3>
                  <p className="text-2xl font-bold text-blue-900">12</p>
                  <p className="text-xs text-blue-600">+2 compared to yesterday</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <h3 className="text-sm font-medium text-red-800 mb-2">High-Risk Areas</h3>
                  <p className="text-2xl font-bold text-red-900">4</p>
                  <p className="text-xs text-red-600">Viviana Mall, Thane Station, Churchgate, Andheri</p>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Prediction Accuracy</h3>
                  <p className="text-2xl font-bold text-green-900">87%</p>
                  <p className="text-xs text-green-600">Based on last 30 days data analysis</p>
                </div>
              </div>
              
              {/* Area Predictions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-red-100 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-red-600" />
                    </div>
                    <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">High Risk</Badge>
                  </div>
                  <h4 className="text-sm font-medium mb-1">Viviana Mall Area</h4>
                  <p className="text-xs text-gray-600 mb-2">Theft probability: 85%</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-red-600 mt-2">Peak time: 18:00-22:00</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-red-100 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-red-600" />
                    </div>
                    <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">High Risk</Badge>
                  </div>
                  <h4 className="text-sm font-medium mb-1">Churchgate, Mumbai</h4>
                  <p className="text-xs text-gray-600 mb-2">Theft probability: 88%</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <p className="text-xs text-red-600 mt-2">Peak time: 17:00-21:00</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-amber-600" />
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">Medium Risk</Badge>
                  </div>
                  <h4 className="text-sm font-medium mb-1">Teen Hath Naka</h4>
                  <p className="text-xs text-gray-600 mb-2">Traffic violation probability: 65%</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-amber-600 mt-2">Peak time: 08:00-10:00, 18:00-20:00</p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">Low Risk</Badge>
                  </div>
                  <h4 className="text-sm font-medium mb-1">Hiranandani Estate</h4>
                  <p className="text-xs text-gray-600 mb-2">Overall incident probability: 30%</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Normal patrol sufficient</p>
                </div>
              </div>
              
              {/* Prediction Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>AI Analysis:</strong> Based on crime data from Thane and Mumbai regions over the past month, the system predicts increased theft incidents in commercial areas during evening hours. Additional police presence is recommended in high-risk zones. The model accuracy has improved by 5% compared to last week.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Patrol Suggestions Section */}
        <div className="mt-6">
          <AIPatrolSuggestion />
        </div>
    </Page>
  )
}
