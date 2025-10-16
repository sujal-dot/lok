import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { User } from '@/entities/User';

const publicNavItems = [
    { title: 'Home', page: 'PublicHome' },
    { title: 'Safety Map', page: 'SafetyHeatmap' },
    { title: 'Report a Concern', page: 'ReportSafetyConcern' }
];

export default function PublicNavbar({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const handleLogin = async () => {
        await User.login();
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to={createPageUrl('PublicHome')} className="flex-shrink-0 flex items-center gap-2">
                                <ShieldCheck className="h-8 w-8 text-blue-600" />
                                <span className="font-bold text-xl text-slate-800">Guardian Shield</span>
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {publicNavItems.map((item) => (
                                    <Link
                                        key={item.title}
                                        to={createPageUrl(item.page)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            location.pathname === createPageUrl(item.page)
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Button onClick={handleLogin}>Police Login</Button>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {publicNavItems.map((item) => (
                                <Link
                                    key={item.title}
                                    to={createPageUrl(item.page)}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        location.pathname === createPageUrl(item.page)
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                        <div className="pt-4 pb-3 border-t border-slate-200">
                             <div className="px-2">
                                <Button onClick={handleLogin} className="w-full">Police Login</Button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
            <main className="flex-1">{children}</main>
            <footer className="bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Guardian Shield Initiative. All rights reserved.
                </div>
            </footer>
        </div>
    );
}