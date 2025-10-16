import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, MapPin, User, Phone } from "lucide-react";

const INCIDENT_TYPES = [
  "Traffic Violation",
  "Theft", 
  "Assault",
  "Domestic Violence",
  "Drug Related",
  "Vandalism",
  "Burglary",
  "Public Disturbance", 
  "Emergency Response",
  "Wellness Check",
  "Other"
];

const PRIORITIES = [
  { value: "low", label: "Low Priority", color: "text-green-600" },
  { value: "medium", label: "Medium Priority", color: "text-yellow-600" },
  { value: "high", label: "High Priority", color: "text-orange-600" },
  { value: "critical", label: "Critical", color: "text-red-600" }
];

export default function IncidentForm({ onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    incident_number: `INC-${Date.now()}`,
    incident_type: '',
    priority: 'medium',
    location: '',
    description: '',
    reported_by: '',
    reporter_contact: '',
    incident_date: new Date().toISOString().slice(0, 16),
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-6 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <AlertTriangle className="w-6 h-6 text-blue-600" />
          Report New Incident
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Incident Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="incident_number">Incident Number</Label>
              <Input
                id="incident_number"
                value={formData.incident_number}
                onChange={(e) => handleInputChange('incident_number', e.target.value)}
                className="bg-slate-50"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incident_type">Incident Type *</Label>
              <Select value={formData.incident_type} onValueChange={(value) => handleInputChange('incident_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {INCIDENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <span className={priority.color}>{priority.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incident_date">Date & Time *</Label>
              <Input
                id="incident_date"
                type="datetime-local"
                value={formData.incident_date}
                onChange={(e) => handleInputChange('incident_date', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location *
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter incident location address"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide detailed description of the incident"
              className="h-24"
              required
            />
          </div>

          {/* Reporter Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reported_by" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Reported By
              </Label>
              <Input
                id="reported_by"
                value={formData.reported_by}
                onChange={(e) => handleInputChange('reported_by', e.target.value)}
                placeholder="Name of person reporting"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reporter_contact" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Information
              </Label>
              <Input
                id="reporter_contact"
                value={formData.reporter_contact}
                onChange={(e) => handleInputChange('reporter_contact', e.target.value)}
                placeholder="Phone number or email"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information or notes"
              className="h-20"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !formData.incident_type || !formData.location || !formData.description}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              {isSubmitting ? "Submitting..." : "Submit Incident"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}