import React, { useState } from 'react'
import { AlertTriangle, Plus, MapPin, Clock, Filter } from 'lucide-react'
import { format } from 'date-fns'
import IncidentForm from '@/components/incidents/IncidentForm'

const colors = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444', Critical: '#7c3aed' }

export default function Incidents() {
  const [incidents, setIncidents] = useState([
    { id: 1, title: 'Noise complaint', location: 'Sector 3', priority: 'Low', createdAt: new Date().toISOString() }
  ])

  const add = (data) => {
    setIncidents(prev => [{ id: prev.length + 1, ...data }, ...prev])
  }

  return (
    <div style={{ padding: 20, display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <AlertTriangle size={18} /> Incidents
      </h2>

      <IncidentForm onSubmit={add} />

      <div style={{ display: 'grid', gap: 8 }}>
        {incidents.map((inc) => (
          <div key={inc.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{inc.title}</strong>
              <span style={{ background: colors[inc.priority], color: '#fff', padding: '2px 8px', borderRadius: 999 }}>{inc.priority}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, color: '#6b7280', marginTop: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {inc.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {format(new Date(inc.createdAt), 'PPpp')}</span>
            </div>
          </div>
        ))}
        {incidents.length === 0 && <div>No incidents yet.</div>}
      </div>
    </div>
  )
}
