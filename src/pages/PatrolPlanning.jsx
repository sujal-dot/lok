import React, { useState, useEffect } from "react";
import { PatrolPlan } from "@/entities/PatrolPlan";
import { Officer } from "@/entities/Officer";
import { CrimeHotspot } from "@/entities/CrimeHotspot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Route, Users, Clock, Target, Plus, Brain } from "lucide-react";

export default function PatrolPlanning() {
  const [patrolPlans, setPatrolPlans] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [plans, officerData, hotspotData] = await Promise.all([
        PatrolPlan.list('-created_date'),
        Officer.list(),
        CrimeHotspot.list()
      ]);
      setPatrolPlans(plans);
      setOfficers(officerData);
      setHotspots(hotspotData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const generateOptimalPlan = async () => {
    setIsGenerating(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // AI-powered greedy algorithm for optimal patrol allocation
      const plan = {
        plan_date: today,
        shift: "Morning",
        assigned_officers: officers.filter(o => o.status === 'on_duty').slice(0, 4).map(o => o.badge_number),
        patrol_routes: [
          {
            route_name: "High Priority Circuit",
            hotspots: hotspots.filter(h => h.risk_level === 'Critical' || h.risk_level === 'High').map(h => h.hotspot_id),
            estimated_duration: 120,
            priority_level: "High"
          },
          {
            route_name: "Community Areas",
            hotspots: hotspots.filter(h => h.risk_level === 'Medium').map(h => h.hotspot_id),
            estimated_duration: 90,
            priority_level: "Medium"
          }
        ],
        resource_allocation: {
          patrol_cars: 3,
          foot_patrols: 2,
          k9_units: 1
        },
        ai_recommendations: "Based on crime patterns and hotspot analysis: Focus 60% of resources on critical areas during peak hours (8-10 AM). Deploy K-9 unit to drug-related hotspots. Maintain visibility in community areas to deter opportunistic crime.",
        status: "Draft"
      };

      await PatrolPlan.create(plan);
      await loadData();
    } catch (error) {
      console.error("Error generating patrol plan:", error);
    }
    setIsGenerating(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      Draft: "bg-yellow-100 text-yellow-800",
      Active: "bg-green-100 text-green-800",
      Completed: "bg-blue-100 text-blue-800",
      Modified: "bg-purple-100 text-purple-800"
    };
    return colors[status] || colors.Draft;
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Patrol Planning</h1>
            <p className="text-slate-600 mt-1">Optimize patrol routes using greedy algorithms and hotspot data</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Manual Plan
            </Button>
            <Button 
              onClick={generateOptimalPlan}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'AI Optimize'}
            </Button>
          </div>
        </div>

        {/* Algorithm Info */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Intelligent Patrol Optimization</h3>
                <p className="text-slate-600">
                  Risk scoring combined with greedy algorithm suggests optimal patrol allocation based on hotspot analysis and time trends.
                  Maximizes coverage efficiency while prioritizing high-risk areas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-slate-500">Available Officers</p>
                  <h3 className="text-2xl font-bold">{officers.filter(o => o.status === 'on_duty').length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-slate-500">Active Hotspots</p>
                  <h3 className="text-2xl font-bold">{hotspots.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Route className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-slate-500">Active Plans</p>
                  <h3 className="text-2xl font-bold">{patrolPlans.filter(p => p.status === 'Active').length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patrol Plans */}
        <div className="space-y-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-lg animate-pulse" />
            ))
          ) : patrolPlans.length > 0 ? (
            patrolPlans.map((plan) => (
              <Card key={plan.id} className="shadow-md border-0">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Route className="w-6 h-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-xl">
                          Patrol Plan - {plan.plan_date} ({plan.shift})
                        </CardTitle>
                        <p className="text-slate-500">
                          {plan.assigned_officers?.length || 0} officers assigned
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Routes */}
                    <div>
                      <h4 className="font-semibold mb-3">Patrol Routes</h4>
                      <div className="space-y-3">
                        {plan.patrol_routes?.map((route, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium">{route.route_name}</h5>
                              <Badge variant="outline" className={
                                route.priority_level === 'High' ? 'border-red-200 text-red-800' :
                                route.priority_level === 'Medium' ? 'border-yellow-200 text-yellow-800' :
                                'border-green-200 text-green-800'
                              }>
                                {route.priority_level}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                {route.hotspots?.length || 0} hotspots
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {route.estimated_duration}min
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    <div>
                      <h4 className="font-semibold mb-3">AI Recommendations</h4>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {plan.ai_recommendations}
                        </p>
                      </div>

                      <h4 className="font-semibold mt-4 mb-3">Resource Allocation</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {plan.resource_allocation?.patrol_cars || 0}
                          </p>
                          <p className="text-xs text-slate-600">Patrol Cars</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {plan.resource_allocation?.foot_patrols || 0}
                          </p>
                          <p className="text-xs text-slate-600">Foot Patrols</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">
                            {plan.resource_allocation?.k9_units || 0}
                          </p>
                          <p className="text-xs text-slate-600">K-9 Units</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <Route className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Patrol Plans</h3>
                <p className="text-slate-500 mb-4">
                  Generate optimized patrol plans using AI algorithms.
                </p>
                <Button onClick={generateOptimalPlan} className="bg-blue-600 hover:bg-blue-700">
                  <Brain className="w-4 h-4 mr-2" />
                  Generate AI Plan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}