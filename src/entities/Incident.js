// Entity model for Incidents in Guardian Shield

class Incident {
  constructor(data) {
    this.id = data.id || `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.incident_number = data.incident_number || `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    this.incident_type = data.incident_type || 'Other';
    this.priority = data.priority || 'medium';
    this.status = data.status || 'reported';
    this.location = data.location || null;
    this.latitude = data.latitude || null;
    this.longitude = data.longitude || null;
    this.description = data.description || '';
    this.reported_by = data.reported_by || null;
    this.reported_at = data.reported_at || new Date().toISOString();
    this.dispatched_at = data.dispatched_at || null;
    this.resolved_at = data.resolved_at || null;
    this.assigned_officers = data.assigned_officers || [];
    this.witnesses = data.witnesses || [];
    this.evidence_items = data.evidence_items || [];
    this.case_reference = data.case_reference || null;
    this.notes = data.notes || [];
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.closed_at = data.closed_at || null;
  }

  // Static methods for data operations
  static async create(data) {
    // In a real implementation, this would interact with a database
    // For now, we'll simulate a successful creation
    const newIncident = new Incident(data);
    return Promise.resolve(newIncident);
  }

  static async getById(id) {
    // Mock implementation to get an incident by ID
    // In a real app, this would query a database
    return Promise.resolve(mockIncidents.find(inc => inc.id === id) || null);
  }

  static async getByIncidentNumber(incidentNumber) {
    // Mock implementation to get an incident by incident number
    return Promise.resolve(mockIncidents.find(inc => inc.incident_number === incidentNumber) || null);
  }

  static async list(filters = {}) {
    // Mock implementation to list incidents with optional filters
    // In a real app, this would query a database with the provided filters
    let results = [...mockIncidents];
    
    // Apply filters if provided
    if (filters.status) {
      results = results.filter(inc => inc.status === filters.status);
    }
    
    if (filters.type) {
      results = results.filter(inc => inc.incident_type === filters.type);
    }
    
    if (filters.priority) {
      results = results.filter(inc => inc.priority === filters.priority);
    }
    
    if (filters.start_date && filters.end_date) {
      results = results.filter(inc => {
        const incidentDate = new Date(inc.reported_at);
        const startDate = new Date(filters.start_date);
        const endDate = new Date(filters.end_date);
        return incidentDate >= startDate && incidentDate <= endDate;
      });
    }
    
    return Promise.resolve(results);
  }

  static async update(id, updates) {
    // Mock implementation to update an incident
    const incident = await this.getById(id);
    if (!incident) {
      throw new Error(`Incident with ID ${id} not found`);
    }
    
    // Apply updates
    Object.assign(incident, updates);
    incident.updated_at = new Date().toISOString();
    
    // Update status timestamps
    if (updates.status === 'dispatched' && !incident.dispatched_at) {
      incident.dispatched_at = new Date().toISOString();
    }
    
    if (updates.status === 'resolved' && !incident.resolved_at) {
      incident.resolved_at = new Date().toISOString();
    }
    
    if (updates.status === 'closed' && !incident.closed_at) {
      incident.closed_at = new Date().toISOString();
    }
    
    return Promise.resolve(incident);
  }

  static async close(id, closingNotes = '') {
    // Mock implementation to close an incident
    return this.update(id, {
      status: 'closed',
      notes: [...(mockIncidents.find(inc => inc.id === id)?.notes || []), closingNotes]
    });
  }

  static async delete(id) {
    // Mock implementation to delete an incident
    return Promise.resolve({ success: true });
  }
}

// Mock data for testing
const mockIncidents = [
  {
    id: 'inc_001',
    incident_number: 'INC-2023-0456',
    incident_type: 'Theft',
    priority: 'high',
    status: 'resolved',
    location: '123 Main Street, Thane West',
    latitude: 19.1937,
    longitude: 72.9739,
    description: 'Residential burglary reported by homeowner. Multiple items stolen including electronics and jewelry.',
    reported_by: {
      id: 'citizen_001',
      name: 'Amit Patel',
      phone: '+91 12345 67890'
    },
    reported_at: '2023-07-15T22:30:00Z',
    dispatched_at: '2023-07-15T23:00:00Z',
    resolved_at: '2023-07-16T02:15:00Z',
    assigned_officers: ['officer_001', 'officer_002'],
    witnesses: [],
    evidence_items: ['ev_001', 'ev_002'],
    case_reference: 'CASE-2023-0045',
    notes: [
      'Responding officers arrived on scene within 30 minutes',
      'Forensic team collected fingerprints and DNA samples'
    ],
    created_at: '2023-07-15T22:30:00Z',
    updated_at: '2023-07-16T02:15:00Z',
    closed_at: null
  },
  {
    id: 'inc_002',
    incident_number: 'INC-2023-0457',
    incident_type: 'Assault',
    priority: 'critical',
    status: 'in_progress',
    location: '456 Market Avenue, Thane',
    latitude: 19.1948,
    longitude: 72.9756,
    description: 'Physical assault reported at a local bar. Victim with serious injuries.',
    reported_by: {
      id: 'citizen_002',
      name: 'Rajesh Sharma',
      phone: '+91 98765 43210'
    },
    reported_at: '2023-07-16T01:15:00Z',
    dispatched_at: '2023-07-16T01:20:00Z',
    resolved_at: null,
    assigned_officers: ['officer_003', 'officer_004'],
    witnesses: ['citizen_003', 'citizen_004'],
    evidence_items: ['ev_003', 'ev_004', 'ev_005'],
    case_reference: 'CASE-2023-0092',
    notes: [
      'Victim transported to hospital via ambulance',
      'Several witnesses interviewed at the scene',
      'Suspect description obtained'
    ],
    created_at: '2023-07-16T01:15:00Z',
    updated_at: '2023-07-16T03:45:00Z',
    closed_at: null
  },
  {
    id: 'inc_003',
    incident_number: 'INC-2023-0458',
    incident_type: 'Traffic Violation',
    priority: 'low',
    status: 'closed',
    location: '789 Road Street, Thane',
    latitude: 19.1965,
    longitude: 72.9772,
    description: 'Speeding violation detected by radar. Driver exceeding speed limit by 20 km/h.',
    reported_by: {
      id: 'officer_005',
      name: 'Inspector Sanjay Patil',
      badge_number: 'TK9012'
    },
    reported_at: '2023-07-16T08:30:00Z',
    dispatched_at: '2023-07-16T08:30:00Z',
    resolved_at: '2023-07-16T08:45:00Z',
    assigned_officers: ['officer_005'],
    witnesses: [],
    evidence_items: ['ev_006'],
    case_reference: null,
    notes: [
      'Traffic ticket issued to driver',
      'Driver cooperative during interaction'
    ],
    created_at: '2023-07-16T08:30:00Z',
    updated_at: '2023-07-16T08:45:00Z',
    closed_at: '2023-07-16T08:45:00Z'
  },
  {
    id: 'inc_004',
    incident_number: 'INC-2023-0459',
    incident_type: 'Drug Related',
    priority: 'medium',
    status: 'dispatched',
    location: '101 Street Road, Thane East',
    latitude: 19.1982,
    longitude: 72.9787,
    description: 'Suspicious activity reported near a local park. Possible drug dealing.',
    reported_by: {
      id: 'citizen_005',
      name: 'Priya Desai',
      phone: '+91 55555 12345'
    },
    reported_at: '2023-07-16T14:20:00Z',
    dispatched_at: '2023-07-16T14:25:00Z',
    resolved_at: null,
    assigned_officers: ['officer_006', 'officer_007'],
    witnesses: [],
    evidence_items: [],
    case_reference: null,
    notes: [
      'Undercover officers en route to location',
      'Surveillance team monitoring area'
    ],
    created_at: '2023-07-16T14:20:00Z',
    updated_at: '2023-07-16T14:25:00Z',
    closed_at: null
  }
];

export { Incident };