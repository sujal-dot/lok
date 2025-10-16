import React, { useState } from 'react';
import { CitizenReport } from '@/entities/CitizenReport';
import ReportForm from '@/components/public/ReportForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ReportSafetyConcern() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        setError('');
        setSuccess(false);
        try {
            // Add default location if not provided, for schema compliance
            if (!formData.location?.latitude || !formData.location?.longitude) {
                formData.location = {
                    latitude: 0,
                    longitude: 0,
                    address: formData.location.address || 'Not specified'
                };
            }
            await CitizenReport.create(formData);
            setSuccess(true);
        } catch (err) {
            console.error("Failed to submit report:", err);
            setError("Submission failed. Please check your connection and try again.");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {success ? (
                    <Card className="shadow-lg border-0 text-center p-8">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800">Report Submitted Successfully</h2>
                        <p className="text-slate-600 mt-2">
                            Thank you for your contribution to community safety. Your report has been sent to the police department for review.
                        </p>
                    </Card>
                ) : (
                    <Card className="shadow-lg border-0">
                        <CardHeader className="text-center">
                            <ShieldAlert className="w-10 h-10 mx-auto text-blue-600" />
                            <CardTitle className="text-3xl font-bold text-slate-900 mt-2">Report a Safety Concern</CardTitle>
                            <CardDescription className="mt-2 text-md">
                                Your input is vital for community safety. Please provide as much detail as possible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8">
                            <ReportForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}