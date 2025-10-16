import React from 'react'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Briefcase, Plus, Calendar, Users } from 'lucide-react'
import { format } from 'date-fns'

const statusColor = (status) => ({
  Open: '#f59e0b', Closed: '#10b981', Pending: '#3b82f6'
}[status] || '#6b7280')

export default function Cases() {
  const rows = [
    { id: 'C-1001', title: 'Burglary', assigned: 'Team A', status: 'Open', createdAt: new Date().toISOString() },
    { id: 'C-1002', title: 'Vandalism', assigned: 'Team B', status: 'Pending', createdAt: new Date().toISOString() },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Briefcase size={18} /> Cases
      </h2>
      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.title}</TableCell>
                <TableCell style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={14} /> {r.assigned}
                </TableCell>
                <TableCell>
                  <span style={{ background: statusColor(r.status), color: '#fff', padding: '2px 8px', borderRadius: 999 }}>{r.status}</span>
                </TableCell>
                <TableCell style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} /> {format(new Date(r.createdAt), 'PPpp')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
