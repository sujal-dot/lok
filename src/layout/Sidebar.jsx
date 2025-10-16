import React from 'react'
import { Shield, LayoutDashboard, Bell, Users, Briefcase, FileText } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const NavItem = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
        active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} /> <span>{label}</span>
    </Link>
  )
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col gap-4 border-r border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3 px-1">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white">
          <Shield size={20} />
        </div>
        <div>
          <div className="text-sm font-semibold">LokRakshak</div>
          <div className="text-xs text-gray-500">Police Command Center</div>
        </div>
      </div>

      <nav className="mt-2 flex flex-col gap-1">
        <div className="text-xs font-semibold uppercase text-gray-500 px-1 mb-1">Main</div>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/incidents" icon={Bell} label="Incidents" />
        <NavItem to="/officers" icon={Users} label="Officers" />
        <NavItem to="/cases" icon={Briefcase} label="Cases" />
        <NavItem to="/evidence" icon={FileText} label="Evidence" />
      </nav>

      <div className="mt-auto rounded-lg border border-gray-200 p-3">
        <div className="text-xs text-gray-500">Officer on Duty</div>
        <div className="text-sm font-medium">Badge #12345</div>
      </div>
    </aside>
  )
}
