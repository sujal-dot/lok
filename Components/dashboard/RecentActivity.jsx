import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const getPriorityColor = (priority) => {
  const colors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800", 
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800"
  };
  return colors[priority] || colors.medium;
};

const getStatusColor = (status) => {
  const colors = {
    reported: "bg-blue-100 text-blue-800",
    dispatched: "bg-purple-100 text-purple-800",
    in_progress: "bg-amber-100 text-amber-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800"
  };
  return colors[status] || colors.reported;
};

export default function RecentActivity({ incidents }) {
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {incidents.slice(0, 5).map((incident) => (
          <div key={incident.id} className="p-4 border border-slate-100 rounded-lg bg-white hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getPriorityColor(incident.priority)}>
                    {incident.priority}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(incident.status)}>
                    {incident.status.replace('_', ' ')}
                  </Badge>
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{incident.incident_type}</h4>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{incident.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(incident.created_date), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {incidents.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <p>No recent incidents to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}