import React, { useState, useEffect } from 'react'
import { MapPin, AlertTriangle, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip } from '@/components/ui/tooltip.jsx'
import { Button } from '@/components/ui/button'

// Function to simulate fetching crime data from CSV
const fetchCrimeDataFromCSV = async () => {
  try {
    // In a real application, this would be an API call to fetch the CSV data
    // For now, we'll simulate this with a timeout and return mock data based on our CSV structure
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve([
            { id: 'HS-001', area_name: 'Viviana Mall Area', coordinates: { latitude: 19.2183, longitude: 72.9781 }, crime_type: 'Theft', severity: 'high', incident_count: 15, last_incident_date: new Date().toISOString(), risk_score: 85, patrol_frequency: 'high' },
          { id: 'HS-002', area_name: 'Teen Hath Naka', coordinates: { latitude: 19.2200, longitude: 72.9750 }, crime_type: 'Traffic Violation', severity: 'medium', incident_count: 10, last_incident_date: new Date().toISOString(), risk_score: 65, patrol_frequency: 'medium' },
          { id: 'HS-003', area_name: 'Hiranandani Estate', coordinates: { latitude: 19.2100, longitude: 72.9850 }, crime_type: 'Assault', severity: 'high', incident_count: 8, last_incident_date: new Date().toISOString(), risk_score: 80, patrol_frequency: 'high' },
          { id: 'HS-004', area_name: 'Wagle Estate', coordinates: { latitude: 19.2050, longitude: 72.9700 }, crime_type: 'Drug Related', severity: 'medium', incident_count: 6, last_incident_date: new Date().toISOString(), risk_score: 70, patrol_frequency: 'medium' },
          { id: 'HS-005', area_name: 'Thane Station', coordinates: { latitude: 19.2250, longitude: 72.9730 }, crime_type: 'Pickpocketing', severity: 'high', incident_count: 12, last_incident_date: new Date().toISOString(), risk_score: 82, patrol_frequency: 'high' },
          { id: 'HS-006', area_name: 'Korum Mall', coordinates: { latitude: 19.2150, longitude: 72.9800 }, crime_type: 'Theft', severity: 'medium', incident_count: 7, last_incident_date: new Date().toISOString(), risk_score: 68, patrol_frequency: 'medium' },
          { id: 'HS-007', area_name: 'Churchgate', coordinates: { latitude: 18.9371, longitude: 72.8358 }, crime_type: 'Theft', severity: 'high', incident_count: 18, last_incident_date: new Date().toISOString(), risk_score: 88, patrol_frequency: 'high' },
          { id: 'HS-008', area_name: 'Andheri Station', coordinates: { latitude: 19.1193, longitude: 72.8310 }, crime_type: 'Pickpocketing', severity: 'high', incident_count: 14, last_incident_date: new Date().toISOString(), risk_score: 84, patrol_frequency: 'high' },
          { id: 'HS-009', area_name: 'Powai', coordinates: { latitude: 19.1199, longitude: 72.9058 }, crime_type: 'Burglary', severity: 'medium', incident_count: 9, last_incident_date: new Date().toISOString(), risk_score: 72, patrol_frequency: 'medium' },
          { id: 'HS-010', area_name: 'Bandra', coordinates: { latitude: 19.0572, longitude: 72.8275 }, crime_type: 'Assault', severity: 'medium', incident_count: 5, last_incident_date: new Date().toISOString(), risk_score: 65, patrol_frequency: 'medium' }
        ]);
      }, 800);
    });
  } catch (error) {
    console.error('Error fetching crime data:', error);
    return [];
  }
}

const getSeverityColor = (severity, opacity = 1) => {
  switch (severity.toLowerCase()) {
    case 'high':
      return `rgba(239, 68, 68, ${opacity})` // Red
    case 'medium':
      return `rgba(245, 158, 11, ${opacity})` // Amber
    case 'low':
      return `rgba(59, 130, 246, ${opacity})` // Blue
    default:
      return `rgba(156, 163, 175, ${opacity})` // Gray
  }
}

const getSeverityLabel = (severity) => {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'High Risk'
    case 'medium':
      return 'Medium Risk'
    case 'low':
      return 'Low Risk'
    default:
      return severity
  }
}

const getMarkerSize = (riskScore) => {
  if (riskScore >= 80) return 24
  if (riskScore >= 60) return 18
  return 14
}

const formatCoordinates = (lat, lng) => {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}

export default function CrimeHeatmap() {
  const [filteredHotspots, setFilteredHotspots] = useState([])
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [hoveredHotspot, setHoveredHotspot] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch hotspots data from our simulated CSV source
  const fetchHotspots = async () => {
    setIsLoading(true)
    try {
      const hotspotsData = await fetchCrimeDataFromCSV();
      setFilteredHotspots(hotspotsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching crime hotspots:', error)
      setIsLoading(false)
    }
  }

  // Filter hotspots by severity
  useEffect(() => {
    if (selectedSeverity === 'all') {
      // If we're showing all severity levels, just call fetchHotspots again
      fetchHotspots();
    } else if (filteredHotspots.length > 0) {
      // Filter the current hotspots if we have data
      setFilteredHotspots(prevHotspots => 
        prevHotspots.filter(h => h.severity.toLowerCase() === selectedSeverity.toLowerCase())
      );
    }
  }, [selectedSeverity])

  // Fetch initial data on component mount
  useEffect(() => {
    fetchHotspots();
  }, [])

  // Generate grid coordinates for the map visualization
  const generateMapGrid = () => {
    const grid = []
    const size = 500
    const cellSize = 20
    
    for (let y = 0; y < size; y += cellSize) {
      for (let x = 0; x < size; x += cellSize) {
        grid.push({ x, y })
      }
    }
    
    return grid
  }

  // Convert real coordinates to map coordinates
  const convertToMapCoordinates = (lat, lng) => {
    // Normalize coordinates to fit within our map container
    // This is a simplified conversion for visualization purposes
    const baseLat = 19.2000
    const baseLng = 72.9700
    
    const x = ((lng - baseLng) * 5000) % 500
    const y = ((lat - baseLat) * 5000) % 500
    
    return { x, y }
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Crime Hotspot Map
            </CardTitle>
            <CardDescription>Visual representation of crime concentration areas</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={fetchHotspots}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={selectedSeverity === 'all' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedSeverity('all')}
            className={selectedSeverity === 'all' ? 'bg-blue-600' : ''}
          >
            All Severities
          </Button>
          <Button 
            variant={selectedSeverity === 'high' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedSeverity('high')}
            className={selectedSeverity === 'high' ? 'bg-red-600' : ''}
          >
            High Risk
          </Button>
          <Button 
            variant={selectedSeverity === 'medium' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedSeverity('medium')}
            className={selectedSeverity === 'medium' ? 'bg-amber-600' : ''}
          >
            Medium Risk
          </Button>
          <Button 
            variant={selectedSeverity === 'low' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedSeverity('low')}
            className={selectedSeverity === 'low' ? 'bg-blue-400' : ''}
          >
            Low Risk
          </Button>
        </div>

        {/* Map Container */}
        <div className="relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 h-[400px] w-full">
          {/* Map Grid (for visualization) */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {generateMapGrid().map((cell, index) => (
              <div 
                key={index} 
                className="absolute border border-gray-300 bg-white/50"
                style={{ 
                  left: `${cell.x}px`, 
                  top: `${cell.y}px`, 
                  width: '20px', 
                  height: '20px' 
                }}
              />
            ))}
          </div>

          {/* Heatmap Circles */}
          {filteredHotspots.map((hotspot) => {
            const mapCoords = convertToMapCoordinates(hotspot.coordinates.latitude, hotspot.coordinates.longitude)
            const size = getMarkerSize(hotspot.risk_score)
            
            return (
              <React.Fragment key={hotspot.id}>
                {/* Heatmap Circle */}
                <div 
                  className={`absolute rounded-full transition-all duration-300 ${hoveredHotspot === hotspot.id ? 'z-20 scale-110' : 'z-10'}`}
                  style={{
                    left: `${mapCoords.x - (size * 2)}px`,
                    top: `${mapCoords.y - (size * 2)}px`,
                    width: `${size * 4}px`,
                    height: `${size * 4}px`,
                    backgroundColor: getSeverityColor(hotspot.severity, 0.2),
                    boxShadow: `0 0 ${size * 2}px ${size}px ${getSeverityColor(hotspot.severity, 0.1)}`
                  }}
                />
                
                {/* Hotspot Marker */}
                <div 
                  className={`absolute cursor-pointer transition-all duration-300 ${hoveredHotspot === hotspot.id ? 'scale-125' : ''}`}
                  style={{ 
                    left: `${mapCoords.x - size/2}px`, 
                    top: `${mapCoords.y - size/2}px`,
                    zIndex: 30
                  }}
                  onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  <div 
                    className="rounded-full flex items-center justify-center shadow-lg animate-pulse"
                    style={{ 
                      width: `${size}px`, 
                      height: `${size}px`,
                      backgroundColor: getSeverityColor(hotspot.severity),
                      border: '2px solid white'
                    }}
                  >
                    <AlertTriangle size={size * 0.5} className="text-white" />
                  </div>
                </div>
                
                {/* Hotspot Tooltip */}
                {hoveredHotspot === hotspot.id && (
                  <div 
                    className="absolute bg-white rounded-lg shadow-xl p-3 border border-gray-200 z-40 w-64 transition-all duration-200 animate-fadeIn"
                    style={{ 
                      left: `${mapCoords.x + 20}px`, 
                      top: `${mapCoords.y - 10}px`,
                      transform: 'translateX(0)',
                    }}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{hotspot.area_name}</div>
                    <div className="text-sm text-gray-600 mb-1">Crime Type: {hotspot.crime_type}</div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="inline-block rounded-full w-2 h-2 mr-1" style={{ backgroundColor: getSeverityColor(hotspot.severity) }}></span>
                      {getSeverityLabel(hotspot.severity)}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Incidents: {hotspot.incident_count}</div>
                    <div className="text-xs text-gray-500">Coordinates: {formatCoordinates(hotspot.coordinates.latitude, hotspot.coordinates.longitude)}</div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
          
          {/* No Data State */}
          {filteredHotspots.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <Info className="h-10 w-10 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No hotspots found</h3>
              <p className="text-sm text-gray-500">
                There are no crime hotspots matching your selected filters.
              </p>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High Risk (80-100)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Medium Risk (60-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span>Low Risk (0-59)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}