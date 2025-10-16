import React from 'react'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { FileText, Plus, Calendar, User, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

export default function Evidence() {
  const rows = [
    { id: 'E-1', caseId: 'C-1001', type: 'Image', addedBy: 'Officer Rao', link: '#', createdAt: new Date().toISOString() },
    { id: 'E-2', caseId: 'C-1002', type: 'PDF', addedBy: 'Officer Patel', link: '#', createdAt: new Date().toISOString() },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <FileText size={18} /> Evidence
      </h2>
      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Case</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.caseId}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={14} /> {r.addedBy}
                </TableCell>
                <TableCell>
                  <a href={r.link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    Open <ExternalLink size={14} />
                  </a>
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
