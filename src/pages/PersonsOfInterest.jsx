import React, { useState, useEffect } from "react";
import { PersonOfInterest } from "@/entities/PersonOfInterest";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Plus, User, Calendar, ShieldAlert } from "lucide-react";

const getStatusColor = (status) => {
    const colors = {
      "Suspect": "bg-red-100 text-red-800 border-red-200",
      "Missing Person": "bg-amber-100 text-amber-800 border-amber-200",
      "Person of Interest": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Witness": "bg-blue-100 text-blue-800 border-blue-200",
      "Cleared": "bg-green-100 text-green-800 border-green-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
};

export default function PersonsOfInterest() {
    const [persons, setPersons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPersons();
    }, []);

    const loadPersons = async () => {
        setIsLoading(true);
        try {
            const data = await PersonOfInterest.list('-created_date');
            setPersons(data);
        } catch (error) {
            console.error("Error loading persons of interest:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Persons of Interest</h1>
                        <p className="text-slate-600 mt-1">Manage the reference database for identification.</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Person
                    </Button>
                </div>

                <Card className="shadow-md border-0">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-600" />
                            Reference Database ({persons.length} records)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-20 bg-slate-100 rounded animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead className="font-semibold">Photo</TableHead>
                                            <TableHead className="font-semibold">Full Name</TableHead>
                                            <TableHead className="font-semibold">Date of Birth</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold">Related Cases</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {persons.map((person) => (
                                            <TableRow key={person.id} className="hover:bg-slate-50 cursor-pointer">
                                                <TableCell>
                                                    <img 
                                                        src={person.photos?.[0] || `https://ui-avatars.com/api/?name=${person.full_name.replace(' ', '+')}&background=0D8ABC&color=fff`} 
                                                        alt={person.full_name} 
                                                        className="w-12 h-12 rounded-md object-cover border"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <span className="font-medium">{person.full_name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{person.date_of_birth}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`border ${getStatusColor(person.status)}`}>
                                                        {person.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm">{person.related_cases?.join(', ') || 'N/A'}</span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {persons.length === 0 && (
                                    <div className="text-center py-12 text-slate-500">
                                        <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                        <p className="text-lg font-medium mb-2">Database is empty</p>
                                        <p>Click "Add New Person" to populate the reference database.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}