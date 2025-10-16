import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PoliceSidebar from "@/components/layout/PoliceSidebar";
import { Loader2 } from "lucide-react";

const ADMIN_PAGES = [
  "Dashboard",
  "Incidents",
  "Officers",
  "Cases",
  "Evidence",
  "FaceRecognition",
  "PersonsOfInterest",
  "CrimeAnalytics",
  "HotspotMapping",
  "PatrolPlanning"
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null); // Not logged in
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [location.key]);

  useEffect(() => {
    if (!isLoading) {
      const isPublicPage = !ADMIN_PAGES.includes(currentPageName);
      if (user?.role === 'admin' && isPublicPage) {
         // If admin is on a public page, let them stay, but default to dashboard.
         // Or redirect? Let's redirect to dashboard if they land on public home.
         if (currentPageName === 'PublicHome') {
            navigate(createPageUrl('Dashboard'));
         }
      } else if (user?.role !== 'admin' && ADMIN_PAGES.includes(currentPageName)) {
        // If non-admin tries to access admin page, redirect to public home
        navigate(createPageUrl('PublicHome'));
      }
    }
  }, [user, isLoading, currentPageName, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const isPoliceUser = user?.role === 'admin';

  return isPoliceUser ? (
    <PoliceSidebar currentPageName={currentPageName}>{children}</PoliceSidebar>
  ) : (
    <PublicNavbar>{children}</PublicNavbar>
  );
}