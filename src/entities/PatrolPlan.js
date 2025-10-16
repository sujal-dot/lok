// Entity model for Patrol Plans in Guardian Shield

class PatrolPlan {
  constructor(data) {
    this.id = data.id || `patrol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.plan_date = data.plan_date || new Date().toISOString().split('T')[0];
    this.shift = data.shift || 'Morning';
    this.assigned_officers = data.assigned_officers || [];
    this.patrol_routes = data.patrol_routes || [];
    this.status = data.status || 'draft'; // 'draft', 'finalized', 'in_progress', 'completed', 'cancelled'
    this.created_by = data.created_by || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.approval_status = data.approval_status || 'pending'; // 'pending', 'approved', 'rejected'
    this.approved_by = data.approved_by || null;
    this.approved_at = data.approved_at || null;
    this.comments = data.comments || [];
    this.audit_trail = data.audit_trail || [];
    this.ai_suggestions_used = data.ai_suggestions_used || false;
    this.ai_model_version = data.ai_model_version || null;
  }

  // Static methods for data operations
  static async create(data) {
    // In a real implementation, this would interact with a database
    // For now, we'll simulate a successful creation
    const newPlan = new PatrolPlan(data);
    return Promise.resolve(newPlan);
  }

  static async getById(id) {
    // Mock implementation to get a patrol plan by ID
    // In a real app, this would query a database
    return Promise.resolve(mockPatrolPlans.find(plan => plan.id === id) || null);
  }

  static async list(filters = {}) {
    // Mock implementation to list patrol plans with optional filters
    // In a real app, this would query a database with the provided filters
    let results = [...mockPatrolPlans];
    
    // Apply filters if provided
    if (filters.plan_date) {
      results = results.filter(plan => plan.plan_date === filters.plan_date);
    }
    
    if (filters.shift) {
      results = results.filter(plan => plan.shift === filters.shift);
    }
    
    if (filters.status) {
      results = results.filter(plan => plan.status === filters.status);
    }
    
    if (filters.officer_badge_number) {
      results = results.filter(plan => 
        plan.assigned_officers.includes(filters.officer_badge_number)
      );
    }
    
    // Sort by date and shift by default
    results.sort((a, b) => {
      if (a.plan_date !== b.plan_date) {
        return new Date(a.plan_date) - new Date(b.plan_date);
      }
      
      const shiftOrder = { 'Morning': 1, 'Afternoon': 2, 'Night': 3, 'Late Night': 4 };
      return shiftOrder[a.shift] - shiftOrder[b.shift];
    });
    
    return Promise.resolve(results);
  }

  static async update(id, updates) {
    // Mock implementation to update a patrol plan
    const plan = await this.getById(id);
    if (!plan) {
      throw new Error(`Patrol plan with ID ${id} not found`);
    }
    
    // Apply updates
    Object.assign(plan, updates);
    plan.updated_at = new Date().toISOString();
    
    // Add to audit trail
    if (!plan.audit_trail) plan.audit_trail = [];
    plan.audit_trail.push({
      timestamp: plan.updated_at,
      changes: Object.keys(updates),
      updated_by: updates.updated_by || 'system'
    });
    
    return Promise.resolve(plan);
  }

  static async finalize(id) {
    // Mock implementation to finalize a patrol plan
    return this.update(id, { status: 'finalized' });
  }

  static async approve(id, approverInfo) {
    // Mock implementation to approve a patrol plan
    return this.update(id, {
      approval_status: 'approved',
      approved_by: approverInfo,
      approved_at: new Date().toISOString()
    });
  }

  static async reject(id, reason, approverInfo) {
    // Mock implementation to reject a patrol plan
    return this.update(id, {
      approval_status: 'rejected',
      approved_by: approverInfo,
      approved_at: new Date().toISOString(),
      comments: [...(mockPatrolPlans.find(plan => plan.id === id)?.comments || []), reason]
    });
  }

  static async delete(id) {
    // Mock implementation to delete a patrol plan
    return Promise.resolve({ success: true });
  }
}

// Mock data for testing
const mockPatrolPlans = [
  {
    id: 'patrol_001',
    plan_date: '2023-07-17',
    shift: 'Morning',
    assigned_officers: ['TK1234', 'TK5678', 'TK9012'],
    patrol_routes: [
      {
        route_name: 'West Sector - High Risk',
        hotspots: ['HS-001', 'HS-003'],
        estimated_duration: 180,
        priority_level: 'High',
        start_time: '07:00',
        end_time: '10:00',
        checkpoints: [
          { location: '123 Main Street', time: '07:15' },
          { location: '456 Market Avenue', time: '08:00' },
          { location: '789 Park Road', time: '09:00' }
        ]
      },
      {
        route_name: 'Central Business District',
        hotspots: [],
        estimated_duration: 120,
        priority_level: 'Medium',
        start_time: '10:00',
        end_time: '12:00',
        checkpoints: [
          { location: '101 Business St', time: '10:30' },
          { location: '202 Mall Road', time: '11:15' }
        ]
      }
    ],
    status: 'finalized',
    created_by: {
      id: 'officer_008',
      name: 'Inspector Vijay Desai',
      badge_number: 'TK2468'
    },
    created_at: '2023-07-15T15:30:00Z',
    updated_at: '2023-07-16T10:15:00Z',
    approval_status: 'approved',
    approved_by: {
      id: 'officer_009',
      name: 'ACP Sunil More',
      badge_number: 'TK1357'
    },
    approved_at: '2023-07-16T11:00:00Z',
    comments: [
      'Ensure extra patrols around HS-001 during morning rush hour'
    ],
    audit_trail: [
      {
        timestamp: '2023-07-16T10:15:00Z',
        changes: ['assigned_officers', 'patrol_routes'],
        updated_by: 'TK2468'
      },
      {
        timestamp: '2023-07-16T11:00:00Z',
        changes: ['approval_status'],
        updated_by: 'TK1357'
      }
    ],
    ai_suggestions_used: true,
    ai_model_version: 'v2.1.0'
  },
  {
    id: 'patrol_002',
    plan_date: '2023-07-17',
    shift: 'Night',
    assigned_officers: ['TK3456', 'TK7890', 'TK2468'],
    patrol_routes: [
      {
        route_name: 'East Sector - Critical Zone',
        hotspots: ['HS-002', 'HS-004'],
        estimated_duration: 240,
        priority_level: 'High',
        start_time: '22:00',
        end_time: '02:00',
        checkpoints: [
          { location: '101 Street Road', time: '22:30' },
          { location: '202 Park Avenue', time: '23:45' },
          { location: '303 Night Market', time: '01:00' }
        ]
      },
      {
        route_name: 'Industrial Area Patrol',
        hotspots: [],
        estimated_duration: 90,
        priority_level: 'Low',
        start_time: '02:00',
        end_time: '03:30',
        checkpoints: [
          { location: 'Factory Gate A', time: '02:15' },
          { location: 'Factory Gate B', time: '03:00' }
        ]
      }
    ],
    status: 'draft',
    created_by: {
      id: 'officer_010',
      name: 'Sub-Inspector Ravi Pawar',
      badge_number: 'TK4680'
    },
    created_at: '2023-07-16T14:20:00Z',
    updated_at: '2023-07-16T16:45:00Z',
    approval_status: 'pending',
    approved_by: null,
    approved_at: null,
    comments: [],
    audit_trail: [
      {
        timestamp: '2023-07-16T16:45:00Z',
        changes: ['patrol_routes'],
        updated_by: 'TK4680'
      }
    ],
    ai_suggestions_used: true,
    ai_model_version: 'v2.1.0'
  },
  {
    id: 'patrol_003',
    plan_date: '2023-07-18',
    shift: 'Afternoon',
    assigned_officers: ['TK1234', 'TK3456', 'TK5678'],
    patrol_routes: [
      {
        route_name: 'South Neighborhoods',
        hotspots: ['HS-003'],
        estimated_duration: 150,
        priority_level: 'Medium',
        start_time: '13:00',
        end_time: '15:30',
        checkpoints: [
          { location: 'School Zone', time: '13:30' },
          { location: 'Shopping Center', time: '14:30' }
        ]
      },
      {
        route_name: 'Recreation Areas',
        hotspots: [],
        estimated_duration: 120,
        priority_level: 'Low',
        start_time: '15:30',
        end_time: '17:30',
        checkpoints: [
          { location: 'City Park', time: '16:00' },
          { location: 'Sports Complex', time: '17:00' }
        ]
      }
    ],
    status: 'finalized',
    created_by: {
      id: 'officer_008',
      name: 'Inspector Vijay Desai',
      badge_number: 'TK2468'
    },
    created_at: '2023-07-16T11:00:00Z',
    updated_at: '2023-07-16T13:15:00Z',
    approval_status: 'approved',
    approved_by: {
      id: 'officer_009',
      name: 'ACP Sunil More',
      badge_number: 'TK1357'
    },
    approved_at: '2023-07-16T14:00:00Z',
    comments: [
      'Monitor school dismissal times carefully'
    ],
    audit_trail: [
      {
        timestamp: '2023-07-16T13:15:00Z',
        changes: ['assigned_officers'],
        updated_by: 'TK2468'
      },
      {
        timestamp: '2023-07-16T14:00:00Z',
        changes: ['approval_status'],
        updated_by: 'TK1357'
      }
    ],
    ai_suggestions_used: true,
    ai_model_version: 'v2.1.0'
  }
];

export { PatrolPlan };