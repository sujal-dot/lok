
import React, { useState, useEffect } from "react";
import { UploadPrivateFile, CreateFileSignedUrl } from "@/integrations/Core";
import { PersonOfInterest } from "@/entities/PersonOfInterest";
import { Case } from "@/entities/Case";
import { FRTSearchLog } from "@/entities/FRTSearchLog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScanFace, Upload, FileCheck, Search, ShieldAlert, Loader2, Info } from "lucide-react";

// Mock function to simulate face recognition search
const runMockSearch = async (probeImageUrl) => {
    // In a real application, this would call a face recognition API.
    // Here, we simulate it by fetching a few random people and assigning scores.
    const allPersons = await PersonOfInterest.list();
    if (allPersons.length === 0) return [];

    const shuffled = allPersons.sort(() => 0.5 - Math.random());
    const resultsCount = Math.min(3, allPersons.length);
    
    return shuffled.slice(0, resultsCount).map(person => ({
        person,
        confidence: Math.random() * (0.98 - 0.75) + 0.75, // Simulate confidence between 75% and 98%
    }));
};

const EthicalDisclaimer = () => (
    <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
        <ShieldAlert className="h-5 w-5 !text-amber-600" />
        <AlertTitle className="font-bold">Ethical Use & Verification Required</AlertTitle>
        <AlertDescription className="text-sm">
            Face Recognition Technology (FRT) is a tool to generate leads and is not definitive proof of identity.
            All matches require independent verification by a trained officer. Be aware of potential algorithmic bias.
            Use of this system is audited and restricted to authorized personnel for official case-related purposes only.
        </AlertDescription>
    </Alert>
);

const SearchResultCard = ({ result }) => {
    const { person, confidence } = result;
    const [photoUrl, setPhotoUrl] = useState(`https://ui-avatars.com/api/?name=${person.full_name.replace(' ', '+')}&background=0D8ABC&color=fff`);

    useEffect(() => {
        const getUrl = async () => {
            if (person.photo_uris && person.photo_uris[0]) {
                try {
                    const { signed_url } = await CreateFileSignedUrl({ file_uri: person.photo_uris[0] });
                    setPhotoUrl(signed_url);
                } catch (e) {
                    console.error("Could not get signed URL for person photo:", e);
                }
            }
        };
        getUrl();
    }, [person]);

    return (
        <Card className="flex items-center p-4 gap-4 hover:bg-slate-50 transition-colors">
            <img 
                src={photoUrl} 
                alt={person.full_name} 
                className="w-20 h-20 rounded-md object-cover border" 
            />
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg text-slate-800">{person.full_name}</h4>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Confidence</p>
                        <p className="text-xl font-bold text-blue-600">{(confidence * 100).toFixed(2)}%</p>
                    </div>
                </div>
                <p className="text-sm text-slate-600">Status: {person.status}</p>
                <p className="text-sm text-slate-500">DOB: {person.date_of_birth}</p>
            </div>
        </Card>
    );
};

export default function FaceRecognition() {
    const [probeImage, setProbeImage] = useState(null);
    const [probeImageUrl, setProbeImageUrl] = useState('');
    const [justification, setJustification] = useState('');
    const [caseNumber, setCaseNumber] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [cases, setCases] = useState([]);

    useEffect(() => {
        async function fetchCases() {
            const caseData = await Case.list();
            setCases(caseData);
        }
        fetchCases();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProbeImage(file);
            setProbeImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSearch = async () => {
        if (!probeImage || !justification || !caseNumber) {
            setError("Probe image, justification, and case number are required.");
            return;
        }
        setError('');
        setIsLoading(true);
        setSearchResults([]);

        try {
            // 1. Upload the probe image to secure storage
            const { file_uri } = await UploadPrivateFile({ file: probeImage });

            // 2. Run the mock search
            const results = await runMockSearch(file_uri);
            setSearchResults(results);

            // 3. Log the search for auditing
            await FRTSearchLog.create({
                officer_badge_number: "12345", // Placeholder for logged-in user
                search_timestamp: new Date().toISOString(),
                justification,
                related_case_number: caseNumber,
                probe_image_uri: file_uri,
                search_results: results.map(r => ({
                    person_id: r.person.id,
                    confidence_score: r.confidence,
                })),
            });

        } catch (err) {
            console.error("Search failed:", err);
            setError("An error occurred during the search. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Face Recognition Search</h1>
                        <p className="text-slate-600 mt-1">Identify persons of interest from image data.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Search Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="shadow-md border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><ScanFace className="w-5 h-5 text-blue-600" /> New Search</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="probe-image" className="font-semibold">1. Upload Probe Image</Label>
                                    <div className="mt-2 h-48 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 relative">
                                        <Input id="probe-image" type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        {probeImageUrl ? (
                                            <img src={probeImageUrl} alt="Probe" className="h-full w-full object-contain rounded-lg p-1" />
                                        ) : (
                                            <div className="text-center text-slate-500">
                                                <Upload className="mx-auto h-8 w-8" />
                                                <p className="mt-2 text-sm">Click or drag to upload</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="case-number" className="font-semibold">2. Link to Case *</Label>
                                    <select
                                        id="case-number"
                                        value={caseNumber}
                                        onChange={(e) => setCaseNumber(e.target.value)}
                                        className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Select a case...</option>
                                        {cases.map(c => <option key={c.id} value={c.case_number}>{c.case_number}: {c.title}</option>)}
                                    </select>
                                </div>
                                
                                <div>
                                    <Label htmlFor="justification" className="font-semibold">3. Justification *</Label>
                                    <Textarea id="justification" value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Explain the reason for this search..." className="mt-2" />
                                </div>
                                
                                {error && <Alert variant="destructive"><ShieldAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                                <Button onClick={handleSearch} disabled={isLoading || !probeImage || !justification || !caseNumber} className="w-full bg-blue-600 hover:bg-blue-700">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                    {isLoading ? 'Searching...' : 'Perform Search'}
                                </Button>
                            </CardContent>
                        </Card>
                        <EthicalDisclaimer />
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-md border-0 min-h-full">
                            <CardHeader>
                                <CardTitle>Search Results</CardTitle>
                                <CardDescription>Potential matches will be displayed below.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading && (
                                    <div className="text-center py-16">
                                        <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
                                        <p className="mt-4 text-slate-500">Analyzing image and searching database...</p>
                                    </div>
                                )}
                                {!isLoading && searchResults.length > 0 && (
                                    <div className="space-y-4">
                                        <Alert variant="default" className="bg-green-50 border-green-200">
                                            <FileCheck className="h-4 w-4" />
                                            <AlertTitle>Search Complete</AlertTitle>
                                            <AlertDescription>{searchResults.length} potential matches found. Please verify each result independently.</AlertDescription>
                                        </Alert>
                                        {searchResults.map((result) => (
                                            <SearchResultCard key={result.person.id} result={result} />
                                        ))}
                                    </div>
                                )}
                                {!isLoading && searchResults.length === 0 && (
                                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
                                        <Info className="mx-auto h-12 w-12 text-slate-400" />
                                        <p className="mt-4 font-semibold text-slate-600">No results to display</p>
                                        <p className="text-slate-500 text-sm">Perform a search to see potential matches here.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
