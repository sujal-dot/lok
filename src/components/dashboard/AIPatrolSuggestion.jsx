import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, ChevronRight, Shield, AlertTriangle, CheckCircle, ArrowUpRight, Activity, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'

// Function to simulate generating AI patrol suggestions based on crime data
const generateAIPatrolSuggestions = async () => {
  try {
    // In a real application, this would analyze the crime data from CSV
    // and generate patrol suggestions using AI algorithms
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve([
            {
              id: 'PAT-001',
              patrol_area: 'Viviana Mall Area',
              recommended_time: '18:00-22:00',
              patrol_type: 'foot',
              recommended_officers: 2,
              priority: 'high',
              reason: 'High theft probability during evening hours',
              risk_score: 85,
              estimated_effectiveness: 75,
              status: 'pending',
              suggested_routes: [
                { id: 1, from: 'Mall Entrance', to: 'Parking Lot A', distance: '0.5km' },
                { id: 2, from: 'Parking Lot A', to: 'Food Court', distance: '0.3km' },
                { id: 3, from: 'Food Court', to: 'Mall Exit', distance: '0.4km' }
              ],
              related_incidents: 12,
              last_updated: new Date().toISOString()
            },
          {
            id: 'PAT-002',
            patrol_area: 'Thane Station Area',
            recommended_time: '20:00-00:00',
            patrol_type: 'vehicle',
            recommended_officers: 1,
            priority: 'high',
            reason: 'Recent reports of pickpocketing and assault',
            risk_score: 80,
            estimated_effectiveness: 70,
            status: 'pending',
            suggested_routes: [
              { id: 1, from: 'Station Main Gate', to: 'Auto Stand', distance: '0.2km' },
              { id: 2, from: 'Auto Stand', to: 'Rickshaw Stand', distance: '0.3km' },
              { id: 3, from: 'Rickshaw Stand', to: 'Station Back Gate', distance: '0.4km' }
            ],
            related_incidents: 8,
            last_updated: new Date().toISOString()
          },
          {
            id: 'PAT-003',
            patrol_area: 'Wagle Estate Industrial Zone',
            recommended_time: '22:00-04:00',
            patrol_type: 'vehicle',
            recommended_officers: 2,
            priority: 'medium',
            reason: 'Increased break-ins at closed businesses',
            risk_score: 65,
            estimated_effectiveness: 60,
            status: 'pending',
            suggested_routes: [
              { id: 1, from: 'Zone Entry Point A', to: 'Factory Row', distance: '1.2km' },
              { id: 2, from: 'Factory Row', to: 'Warehouse Area', distance: '0.8km' },
              { id: 3, from: 'Warehouse Area', to: 'Zone Exit Point B', distance: '1.0km' }
            ],
            related_incidents: 5,
            last_updated: new Date().toISOString()
          },
          {
            id: 'PAT-004',
            patrol_area: 'Churchgate, Mumbai',
            recommended_time: '17:00-21:00',
            patrol_type: 'foot',
            recommended_officers: 2,
            priority: 'high',
            reason: 'High pedestrian traffic with frequent theft cases',
            risk_score: 88,
            estimated_effectiveness: 80,
            status: 'pending',
            suggested_routes: [
              { id: 1, from: 'Station Exit', to: 'Main Market', distance: '0.3km' },
              { id: 2, from: 'Main Market', to: 'Park Area', distance: '0.4km' },
              { id: 3, from: 'Park Area', to: 'Bus Stand', distance: '0.2km' }
            ],
            related_incidents: 15,
            last_updated: new Date().toISOString()
          },
          {
            id: 'PAT-005',
            patrol_area: 'Andheri Station, Mumbai',
            recommended_time: '19:00-23:00',
            patrol_type: 'foot',
            recommended_officers: 1,
            priority: 'high',
            reason: 'Reported pickpocketing cases in crowded areas',
            risk_score: 84,
            estimated_effectiveness: 76,
            status: 'pending',
            suggested_routes: [
              { id: 1, from: 'East Exit', to: 'Shopping Complex', distance: '0.2km' },
              { id: 2, from: 'Shopping Complex', to: 'Rickshaw Stand', distance: '0.3km' },
              { id: 3, from: 'Rickshaw Stand', to: 'West Exit', distance: '0.4km' }
            ],
            related_incidents: 10,
            last_updated: new Date().toISOString()
          }
        ]);
      }, 800);
    });
  } catch (error) {
    console.error('Error generating AI patrol suggestions:', error);
    return [];
  }
}

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'medium':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPriorityLabel = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'High Priority'
    case 'medium':
      return 'Medium Priority'
    case 'low':
      return 'Low Priority'
    default:
      return priority
  }
}

const getPatrolTypeIcon = (patrolType) => {
  switch (patrolType.toLowerCase()) {
    case 'foot':
      return <User className="h-4 w-4" />
    case 'vehicle':
      return <MapPin className="h-4 w-4" />
    default:
      return <Shield className="h-4 w-4" />
  }
}

export default function AIPatrolSuggestion() {
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSuggestion, setExpandedSuggestion] = useState(null)

  // Fetch AI patrol suggestions based on crime data analysis
  const fetchSuggestions = async () => {
    setIsLoading(true)
    try {
      const suggestionsData = await generateAIPatrolSuggestions();
      setFilteredSuggestions(suggestionsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching patrol suggestions:', error)
      setIsLoading(false)
    }
  }

  // Filter suggestions by priority
  useEffect(() => {
    if (selectedPriority === 'all') {
      // If we're showing all priorities, just call fetchSuggestions again
      fetchSuggestions();
    } else if (filteredSuggestions.length > 0) {
      // Filter the current suggestions if we have data
      setFilteredSuggestions(prevSuggestions => 
        prevSuggestions.filter(s => s.priority.toLowerCase() === selectedPriority.toLowerCase())
      );
    }
  }, [selectedPriority])

  // Fetch initial data on component mount
  useEffect(() => {
    fetchSuggestions();
  }, [])

  // Toggle suggestion expansion
  const toggleSuggestion = (id) => {
    setExpandedSuggestion(expandedSuggestion === id ? null : id)
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              AI Patrol Suggestions
            </CardTitle>
            <CardDescription>Optimized patrolling recommendations based on crime data analysis</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={fetchSuggestions}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Refresh Suggestions'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={selectedPriority === 'all' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedPriority('all')}
            className={selectedPriority === 'all' ? 'bg-blue-600' : ''}
          >
            All Priorities
          </Button>
          <Button 
            variant={selectedPriority === 'high' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedPriority('high')}
            className={selectedPriority === 'high' ? 'bg-red-600' : ''}
          >
            High Priority
          </Button>
          <Button 
            variant={selectedPriority === 'medium' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedPriority('medium')}
            className={selectedPriority === 'medium' ? 'bg-amber-600' : ''}
          >
            Medium Priority
          </Button>
          <Button 
            variant={selectedPriority === 'low' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedPriority('low')}
            className={selectedPriority === 'low' ? 'bg-blue-400' : ''}
          >
            Low Priority
          </Button>
        </div>

        {/* Suggestions List */}
        <div className="space-y-3">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Suggestion Header */}
                <div 
                  className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSuggestion(suggestion.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${suggestion.priority === 'high' ? 'bg-red-100' : suggestion.priority === 'medium' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                      <Shield className={`h-5 w-5 ${suggestion.priority === 'high' ? 'text-red-600' : suggestion.priority === 'medium' ? 'text-amber-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{suggestion.patrol_area}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{suggestion.recommended_time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getPatrolTypeIcon(suggestion.patrol_type)}
                          <span>{suggestion.patrol_type} patrol</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{suggestion.recommended_officers} officers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getPriorityColor(suggestion.priority)}`}>
                      {getPriorityLabel(suggestion.priority)}
                    </Badge>
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-gray-500">Risk Score</div>
                      <div className="font-bold text-lg flex items-center gap-1">
                        <Activity className="h-4 w-4 text-red-500" />
                        {suggestion.risk_score}
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${expandedSuggestion === suggestion.id ? 'transform rotate-90' : ''}`} />
                  </div>
                </div>
                
                {/* Expanded Content */}
                {expandedSuggestion === suggestion.id && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Reason for Patrol</h5>
                        <p className="text-gray-700 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
                          {suggestion.reason}
                        </p>
                        
                        <h5 className="font-medium text-gray-900 mt-4 mb-2">Expected Impact</h5>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${suggestion.estimated_effectiveness}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-sm text-gray-700">{suggestion.estimated_effectiveness}%</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Estimated reduction in incidents</div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Recommended Patrol Route</h5>
                        <div className="space-y-2">
                          {suggestion.suggested_routes.map((route, index) => (
                            <div key={route.id} className="flex items-center gap-2 text-sm">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-100 text-blue-800' : index === suggestion.suggested_routes.length - 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">From {route.from}</div>
                                <div className="text-xs text-gray-500">To {route.to} ({route.distance})</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Accept Suggestion
                          </Button>
                          <Button variant="ghost" className="flex-1 border border-gray-300">
                            Modify Route
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Details */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Related Incidents: {suggestion.related_incidents}
                      </div>
                      <div>Last updated: {formatDate(suggestion.last_updated)}</div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No patrol suggestions available</h3>
              <p className="text-sm text-gray-500">
                Based on current data analysis, there are no high-risk areas requiring additional patrols.
              </p>
            </div>
          )}
        </div>
        
        {/* Additional Actions */}
        {filteredSuggestions.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              View All Suggestions <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Generate New Patrol Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}