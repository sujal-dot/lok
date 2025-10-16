import React, { useState, useEffect } from 'react';
import { CrimeHotspot } from '@/entities/CrimeHotspot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Heatmap from '@/components/public/Heatmap';

export default function SafetyHeatmap() {
    const [hotspots, setHotspots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const hotspotData = await CrimeHotspot.list();
                setHotspots(hotspotData);
            } catch (error) {
                console.error("Failed to load hotspot data:", error);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Card className="shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900">Community Safety Heatmap</CardTitle>
                        <CardDescription>
                            This map displays crime hotspots based on recent data analysis. Use it to stay aware of your surroundings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-[60vh] flex items-center justify-center bg-slate-100 rounded-lg">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                <p className="ml-4 text-slate-600">Loading map data...</p>
                            </div>
                        ) : (
                            <div className="h-[60vh] w-full rounded-lg overflow-hidden border border-slate-200">
                                <Heatmap hotspots={hotspots} />
                            </div>
                        )}
                    </CardContent>
                </Card>
                 <div className="mt-6 text-center text-sm text-slate-500">
                    <p><strong>Disclaimer:</strong> This map is for informational purposes only and is not a guarantee of safety. Always be aware of your surroundings.</p>
                </div>
            </div>
        </div>
    );
}