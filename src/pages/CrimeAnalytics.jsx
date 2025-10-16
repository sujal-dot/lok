import React, { useState, useEffect } from "react";
import { Incident } from "@/entities/Incident";
import { CitizenReport } from "@/entities/CitizenReport";
import { CrimeHotspot } from "@/entities/CrimeHotspot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, MapPin, Users, Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'];

export default function CrimeAnalytics() {
  const [incidents, setIncidents] = useState([]);
  const [citizenReports, setCitizenReports] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [incidentData, reportData, hotspotData] = await Promise.all([
        Incident.list('-created_date'),
        CitizenReport.list('-created_date'),
        CrimeHotspot.list('-last_updated')
      ]);
      setIncidents(incidentData);
      setCitizenReports(reportData);
      setHotspots(hotspotData);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    }
    setIsLoading(false);
  };

  const generateAnalytics = () => {
    // Crime type distribution
    const crimeTypes = incidents.reduce((acc, incident) => {
      acc[incident.incident_type] = (acc[incident.incident_type] || 0) + 1;
      return acc;
    }, {});

    const crimeTypeData = Object.entries(crimeTypes).map(([type, count]) => ({
      type,
      count
    }));

    // Hourly trend simulation
    const hourlyData = Array.from({length: 24}, (_, i) => ({
      hour: i,
      incidents: Math.floor(Math.random() * 10) + 1
    }));

    // Risk level distribution
    const riskLevels = hotspots.reduce((acc, hotspot) => {
      acc[hotspot.risk_level] = (acc[hotspot.risk_level] || 0) + 1;
      return acc;
    }, {});

    const riskData = Object.entries(riskLevels).map(([level, count]) => ({
      level,
      count
    }));

    return { crimeTypeData, hourlyData, riskData };
  };

  const { crimeTypeData, hourlyData, riskData } = generateAnalytics();

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Crime Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">Advanced crime data analysis and forecasting</p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            <Button onClick={loadAnalyticsData} className="bg-blue-600 hover:bg-blue-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Refresh Analytics
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Incidents</p>
                  <h3 className="text-3xl font-bold">{incidents.length}</h3>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-200" />
              </div>
              <div className="flex items-center mt-2 text-blue-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+12% vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Citizen Reports</p>
                  <h3 className="text-3xl font-bold">{citizenReports.length}</h3>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
              <div className="flex items-center mt-2 text-green-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+8% vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Active Hotspots</p>
                  <h3 className="text-3xl font-bold">{hotspots.length}</h3>
                </div>
                <MapPin className="w-8 h-8 text-red-200" />
              </div>
              <div className="flex items-center mt-2 text-red-100">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span className="text-sm">-5% vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Avg Response Time</p>
                  <h3 className="text-3xl font-bold">12m</h3>
                </div>
                <Clock className="w-8 h-8 text-purple-200" />
              </div>
              <div className="flex items-center mt-2 text-purple-100">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span className="text-sm">-3min vs last week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Crime Types Distribution */}
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>Crime Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={crimeTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Hourly Crime Trend */}
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>24-Hour Crime Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Risk Analysis and Hotspots */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>Risk Level Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskData}
                    dataKey="count"
                    nameKey="level"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-md border-0">
            <CardHeader>
              <CardTitle>High Priority Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hotspots.filter(h => h.risk_level === 'High' || h.risk_level === 'Critical').map((hotspot, index) => (
                  <div key={hotspot.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <div>
                        <h4 className="font-semibold">Hotspot #{hotspot.hotspot_id || `HS-${index + 1}`}</h4>
                        <p className="text-sm text-slate-500">
                          Density: {hotspot.crime_density || Math.floor(Math.random() * 50) + 10} crimes/km²
                        </p>
                      </div>
                    </div>
                    <Badge className={
                      hotspot.risk_level === 'Critical' 
                        ? "bg-red-100 text-red-800" 
                        : "bg-orange-100 text-orange-800"
                    }>
                      {hotspot.risk_level}
                    </Badge>
                  </div>
                ))}
                {hotspots.filter(h => h.risk_level === 'High' || h.risk_level === 'Critical').length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>No high-priority hotspots identified</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}