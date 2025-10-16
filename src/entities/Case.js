// Entity model for Cases in Guardian Shield

class Case {
  constructor(data) {
    this.id = data.id || `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.case_number = data.case_number || `CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'open'; // 'open', 'closed', 'pending', 'archived'
    this.priority = data.priority || 'medium'; // 'low', 'medium', 'high', 'critical'
    this.type = data.type || 'investigation'; // 'investigation', 'incident', 'complaint'
    this.reporting_officer = data.reporting_officer || null;
    this.assigned_officers = data.assigned_officers || [];
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.incident_date = data.incident_date || null;
    this.location = data.location || null;
    this.evidence_items = data.evidence_items || [];
    this.suspects = data.suspects || [];
    this.victims = data.victims || [];
    this.case_notes = data.case_notes || [];
    this.last_update_by = data.last_update_by || null;
  }

  // Static methods for data operations
  static async create(data) {
    // In a real implementation, this would interact with a database
    // For now, we'll simulate a successful creation
    const newCase = new Case(data);
    return Promise.resolve(newCase);
  }

  static async getById(id) {
    // Mock implementation to get a case by ID
    // In a real app, this would query a database
    return Promise.resolve(mockCases.find(c => c.id === id) || null);
  }

  static async getByCaseNumber(caseNumber) {
    // Mock implementation to get a case by case number
    return Promise.resolve(mockCases.find(c => c.case_number === caseNumber) || null);
  }

  static async list(filters = {}) {
    // Mock implementation to list cases with optional filters
    // In a real app, this would query a database with the provided filters
    let results = [...mockCases];
    
    // Apply filters if provided
    if (filters.status) {
      results = results.filter(c => c.status === filters.status);
    }
    
    if (filters.priority) {
      results = results.filter(c => c.priority === filters.priority);
    }
    
    if (filters.type) {
      results = results.filter(c => c.type === filters.type);
    }
    
    return Promise.resolve(results);
  }

  static async update(id, updates) {
    // Mock implementation to update a case
    const caseObj = await this.getById(id);
    if (!caseObj) {
      throw new Error(`Case with ID ${id} not found`);
    }
    
    // Apply updates
    Object.assign(caseObj, updates);
    caseObj.updated_at = new Date().toISOString();
    
    return Promise.resolve(caseObj);
  }

  static async closeCase(id) {
    // Mock implementation to close a case
    return this.update(id, { status: 'closed', closed_at: new Date().toISOString() });
  }

  static async delete(id) {
    // Mock implementation to delete a case
    return Promise.resolve({ success: true });
  }
}

// Mock data for testing
const mockCases = [
  {
    id: 'case_001',
    case_number: 'CASE-2023-0045',
    title: 'Residential Burglary Pattern',
    description: 'Series of burglaries targeting residential areas in Thane West',
    status: 'open',
    priority: 'high',
    type: 'investigation',
    reporting_officer: {
      id: 'officer_001',
      name: 'Inspector Ramesh Kadam',
      badge_number: 'TK1234'
    },
    assigned_officers: ['officer_001', 'officer_002'],
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-07-15T14:20:00Z',
    incident_date: '2023-01-14T22:00:00Z',
    location: {
      address: 'Multiple locations, Thane West',
      latitude: 19.1937,
      longitude: 72.9739
    },
    evidence_items: ['ev_001', 'ev_002', 'ev_003'],
    suspects: ['poi_001'],
    victims: ['victim_001', 'victim_002', 'victim_003'],
    case_notes: [
      { id: 'note_001', content: 'Pattern suggests same perpetrator', created_at: '2023-01-16T11:00:00Z' }
    ],
    last_update_by: 'officer_001'
  },
  {
    id: 'case_002',
    case_number: 'CASE-2023-0067',
    title: 'Commercial Robbery',
    description: 'Armed robbery at a local jewelry store',
    status: 'open',
    priority: 'critical',
    type: 'incident',
    reporting_officer: {
      id: 'officer_003',
      name: 'Sub-Inspector Priya Deshmukh',
      badge_number: 'TK5678'
    },
    assigned_officers: ['officer_003', 'officer_004'],
    created_at: '2023-02-10T09:15:00Z',
    updated_at: '2023-07-20T16:45:00Z',
    incident_date: '2023-02-10T08:30:00Z',
    location: {
      address: '456 Jewelry Street, Thane',
      latitude: 19.1948,
      longitude: 72.9756
    },
    evidence_items: ['ev_004', 'ev_005'],
    suspects: ['poi_003'],
    victims: ['victim_004'],
    case_notes: [
      { id: 'note_002', content: 'CCTV footage available', created_at: '2023-02-10T10:00:00Z' }
    ],
    last_update_by: 'officer_003'
  },
  {
    id: 'case_003',
    case_number: 'CASE-2023-0078',
    title: 'Financial Fraud Scheme',
    description: 'Large-scale online financial fraud affecting multiple victims',
    status: 'closed',
    priority: 'high',
    type: 'investigation',
    reporting_officer: {
      id: 'officer_005',
      name: 'Inspector Sanjay Patil',
      badge_number: 'TK9012'
    },
    assigned_officers: ['officer_005', 'officer_006'],
    created_at: '2023-03-05T16:45:00Z',
    updated_at: '2023-06-15T11:30:00Z',
    incident_date: '2023-02-28T00:00:00Z',
    location: {
      address: 'Virtual/Online',
      latitude: null,
      longitude: null
    },
    evidence_items: ['ev_006', 'ev_007', 'ev_008'],
    suspects: ['poi_002'],
    victims: ['victim_005', 'victim_006', 'victim_007'],
    case_notes: [
      { id: 'note_003', content: 'Suspect in custody, awaiting trial', created_at: '2023-06-15T11:30:00Z' }
    ],
    last_update_by: 'officer_005',
    closed_at: '2023-06-15T11:30:00Z'
  },
  {
    id: 'case_004',
    case_number: 'CASE-2023-0092',
    title: 'Assault and Battery',
    description: 'Physical assault at a local bar',
    status: 'pending',
    priority: 'medium',
    type: 'incident',
    reporting_officer: {
      id: 'officer_007',
      name: 'ASI Vijay Kumbhar',
      badge_number: 'TK3456'
    },
    assigned_officers: ['officer_007'],
    created_at: '2023-04-22T13:20:00Z',
    updated_at: '2023-07-10T09:15:00Z',
    incident_date: '2023-04-22T22:30:00Z',
    location: {
      address: '789 Bar Street, Thane',
      latitude: 19.1965,
      longitude: 72.9772
    },
    evidence_items: ['ev_009', 'ev_010'],
    suspects: ['poi_003'],
    victims: ['victim_008'],
    case_notes: [
      { id: 'note_004', content: 'Witness statements collected', created_at: '2023-04-23T10:00:00Z' }
    ],
    last_update_by: 'officer_007'
  }
];

export { Case };