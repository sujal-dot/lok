import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

const REPORT_TYPES = ["Safety Concern", "Suspicious Activity", "Crime Witnessed", "Area Feedback", "Emergency"];
const URGENCY_LEVELS = ["Low", "Medium", "High", "Emergency"];

export default function ReportForm({ onSubmit, isSubmitting, error }) {
    const [formData, setFormData] = useState({
        report_type: '',
        location: { address: '' },
        description: '',
        urgency_level: 'Medium',
        reporter_contact: ''
    });

    const handleChange = (field, value) => {
        if (field === 'location.address') {
            setFormData(prev => ({ ...prev, location: { ...prev.location, address: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="report_type">Type of Report *</Label>
                <Select required value={formData.report_type} onValueChange={v => handleChange('report_type', v)}>
                    <SelectTrigger><SelectValue placeholder="Select a report type" /></SelectTrigger>
                    <SelectContent>
                        {REPORT_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="location">Location Address *</Label>
                <Input
                    id="location"
                    required
                    placeholder="E.g., 'Corner of Main St and 2nd Ave' or '123 Maple Dr'"
                    value={formData.location.address}
                    onChange={e => handleChange('location.address', e.target.value)}
                />
                 <p className="text-xs text-slate-500">If you can, please be as specific as possible.</p>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    required
                    placeholder="Describe the situation in detail. What did you see or hear?"
                    className="h-32"
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="urgency_level">Urgency Level</Label>
                    <Select value={formData.urgency_level} onValueChange={v => handleChange('urgency_level', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {URGENCY_LEVELS.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="reporter_contact">Your Contact (Optional)</Label>
                    <Input
                        id="reporter_contact"
                        placeholder="Email or phone number"
                        value={formData.reporter_contact}
                        onChange={e => handleChange('reporter_contact', e.target.value)}
                    />
                    <p className="text-xs text-slate-500">Leave blank to submit anonymously.</p>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
            </div>
        </form>
    );
}