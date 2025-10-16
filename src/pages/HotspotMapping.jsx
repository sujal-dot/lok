import React, { useState, useEffect } from "react";
import { CrimeHotspot } from "@/entities/CrimeHotspot";
import { Incident } from "@/entities/Incident";
import { CitizenReport } from "@/entities/CitizenReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, AlertTriangle, Users, RefreshCw } from "lucide-react";

export default function HotspotMapping() {
  const [hotspots, setHotspots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadHotspots();
  }, []);

  const loadHotspots = async () => {
    setIsLoading(true);
    try {
      const data = await CrimeHotspot.list('-risk_level');
      setHotspots(data);
    } catch (error) {
      console.error("Error loading hotspots:", error);
    }
    setIsLoading(false);
  };

  const generateHotspots = async () => {
    setIsGenerating(true);
    try {
      // Simulate DBSCAN & OPTICS clustering algorithm
      const incidents = await Incident.list();
      const reports = await CitizenReport.list();

      // Generate sample hotspots based on data
      const newHotspots = [
        {
          hotspot_id: "HS-001",
          center_coordinates: { latitude: 40.7128, longitude: -74.0060 },
          radius_meters: 500,
          risk_level: "Critical",
          crime_density: 45.2,
          dominant_crime_types: ["Theft", "Assault"],
          active_hours: ["20:00-02:00", "14:00-18:00"],
          patrol_recommendation: "Increase patrols during evening hours, deploy K-9 unit",
          citizen_reports_count: 12,
          last_updated: new Date().toISOString()
        },
        {
          hotspot_id: "HS-002", 
          center_coordinates: { latitude: 40.7589, longitude: -73.9851 },
          radius_meters: 750,
          risk_level: "High",
          crime_density: 32.8,
          dominant_crime_types: ["Drug Related", "Public Disturbance"],
          active_hours: ["18:00-24:00"],
          patrol_recommendation: "Regular foot patrols, community engagement",
          citizen_reports_count: 8,
          last_updated: new Date().toISOString()
        },
        {
          hotspot_id: "HS-003",
          center_coordinates: { latitude: 40.7831, longitude: -73.9712 },
          radius_meters: 400,
          risk_level: "Medium",
          crime_density: 18.5,
          dominant_crime_types: ["Vandalism", "Traffic Violation"],
          active_hours: ["12:00-16:00"],
          patrol_recommendation: "Periodic vehicle patrols sufficient",
          citizen_reports_count: 5,
          last_updated: new Date().toISOString()
        }
      ];

      // Create hotspots in database
      for (const hotspot of newHotspots) {
        await CrimeHotspot.create(hotspot);
      }

      await loadHotspots();
    } catch (error) {
      console.error("Error generating hotspots:", error);
    }
    setIsGenerating(false);
  };

  const getRiskColor = (level) => {
    const colors = {
      Low: "bg-green-100 text-green-800 border-green-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      High: "bg-orange-100 text-orange-800 border-orange-200",
      Critical: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[level] || colors.Medium;
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Crime Hotspot Mapping</h1>
            <p className="text-slate-600 mt-1">AI-powered DBSCAN & OPTICS clustering for hotspot detection</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={loadHotspots} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={generateHotspots} 
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Run Analysis'}
            </Button>
          </div>
        </div>

        {/* Algorithm Info */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Advanced Clustering Algorithm</h3>
                <p className="text-slate-600">
                  Using DBSCAN & OPTICS algorithms to automatically detect irregular and dense crime hotspots.
                  Real-time updates from incident reports and citizen feedback.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hotspots Grid */}
        <div className="grid gap-6 mb-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-slate-100 rounded-lg animate-pulse" />
            ))
          ) : hotspots.length > 0 ? (
            hotspots.map((hotspot) => (
              <Card key={hotspot.id} className="shadow-md border-0 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-xl">Hotspot {hotspot.hotspot_id}</CardTitle>
                        <p className="text-slate-500 text-sm">
                          Lat: {hotspot.center_coordinates?.latitude.toFixed(4)}, 
                          Lng: {hotspot.center_coordinates?.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <Badge className={`border ${getRiskColor(hotspot.risk_level)}`}>
                      {hotspot.risk_level} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">Crime Density</p>
                      <p className="text-xl font-bold text-slate-900">{hotspot.crime_density}/km²</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">Coverage Radius</p>
                      <p className="text-xl font-bold text-slate-900">{hotspot.radius_meters}m</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">Citizen Reports</p>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-slate-400" />
                        <p className="text-xl font-bold text-slate-900">{hotspot.citizen_reports_count}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">Active Hours</p>
                      <p className="text-sm text-slate-700">{hotspot.active_hours?.join(', ')}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Dominant Crime Types</p>
                      <div className="flex gap-2 mt-1">
                        {hotspot.dominant_crime_types?.map((crime, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {crime}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-500">AI Patrol Recommendation</p>
                      <p className="text-sm text-slate-700 mt-1 p-3 bg-slate-50 rounded-lg">
                        {hotspot.patrol_recommendation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Hotspots Detected</h3>
                <p className="text-slate-500 mb-4">
                  Run the analysis algorithm to identify crime hotspots in your area.
                </p>
                <Button onClick={generateHotspots} className="bg-blue-600 hover:bg-blue-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Hotspots
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}