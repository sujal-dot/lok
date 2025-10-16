import React, { useState, useEffect } from 'react'
import { Officer } from '@/entities/Officer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Officers() {
  const [officers, setOfficers] = useState([])

  useEffect(() => {
    setOfficers([
      new Officer({ id: 1, name: 'A. Rao', rank: 'Inspector', station: 'West', status: 'Active' }),
      new Officer({ id: 2, name: 'P. Patel', rank: 'Sub-Inspector', station: 'Central', status: 'On Leave' }),
    ])
  }, [])

  return (
    <div style={{ padding: 20, display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Officers</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        {officers.map(o => (
          <div key={o.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{o.name}</div>
              <div style={{ color: '#6b7280' }}>{o.rank} • {o.station}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge color={o.status === 'Active' ? '#10b981' : '#6b7280'}>{o.status}</Badge>
              <Button variant="outline">View</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
