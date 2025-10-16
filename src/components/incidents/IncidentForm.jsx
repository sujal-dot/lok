import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function IncidentForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [priority, setPriority] = useState('Medium')

  const submit = (e) => {
    e.preventDefault()
    onSubmit?.({ title, location, priority, createdAt: new Date().toISOString() })
    setTitle('')
    setLocation('')
    setPriority('Medium')
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Critical</option>
      </select>
      <Button type="submit">Add Incident</Button>
    </form>
  )
}
