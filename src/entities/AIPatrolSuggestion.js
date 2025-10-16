// Entity model for AI Patrol Suggestions in Guardian Shield

class AIPatrolSuggestion {
  constructor(data) {
    this.suggestion_id = data.suggestion_id || `ai_suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.generated_date = data.generated_date || new Date().toISOString();
    this.patrol_date = data.patrol_date || new Date().toISOString().split('T')[0];
    this.shift_period = data.shift_period || 'Morning';
    this.priority_zones = data.priority_zones || [];
    this.confidence_score = data.confidence_score || 0.0;
    this.predicted_crimes = data.predicted_crimes || [];
    this.recommended_officers = data.recommended_officers || 0;
    this.model_version = data.model_version || 'v1.0.0';
    this.data_source = data.data_source || [];
    this.explanation = data.explanation || '';
    this.status = data.status || 'pending'; // 'pending', 'accepted', 'rejected', 'modified', 'implemented'
    this.accepted_by = data.accepted_by || null;
    this.accepted_at = data.accepted_at || null;
    this.modified_by = data.modified_by || null;
    this.modified_at = data.modified_at || null;
    this.feedback = data.feedback || null;
    this.related_patrol_plan = data.related_patrol_plan || null;
    this.validation_metrics = data.validation_metrics || {};
    this.version_history = data.version_history || [];
    this.geo_fencing_info = data.geo_fencing_info || null;
  }

  // Static methods for data operations
  static async create(data) {
    // In a real implementation, this would interact with a database
    // For now, we'll simulate a successful creation
    const newSuggestion = new AIPatrolSuggestion(data);
    return Promise.resolve(newSuggestion);
  }

  static async getById(id) {
    // Mock implementation to get an AI patrol suggestion by ID
    // In a real app, this would query a database
    return Promise.resolve(mockAIPatrolSuggestions.find(suggestion => suggestion.suggestion_id === id) || null);
  }

  static async list(filters = {}) {
    // Mock implementation to list AI patrol suggestions with optional filters
    // In a real app, this would query a database with the provided filters
    let results = [...mockAIPatrolSuggestions];
    
    // Apply filters if provided
    if (filters.patrol_date) {
      results = results.filter(suggestion => suggestion.patrol_date === filters.patrol_date);
    }
    
    if (filters.shift_period) {
      results = results.filter(suggestion => suggestion.shift_period === filters.shift_period);
    }
    
    if (filters.status) {
      results = results.filter(suggestion => suggestion.status === filters.status);
    }
    
    // Sort by generated_date (newest first) by default
    results.sort((a, b) => new Date(b.generated_date) - new Date(a.generated_date));
    
    return Promise.resolve(results);
  }

  static async update(id, updates) {
    // Mock implementation to update an AI patrol suggestion
    const suggestion = await this.getById(id);
    if (!suggestion) {
      throw new Error(`AI Patrol Suggestion with ID ${id} not found`);
    }
    
    // Apply updates
    Object.assign(suggestion, updates);
    
    // If the status is changed to 'accepted', record who and when
    if (updates.status === 'accepted') {
      suggestion.accepted_by = updates.accepted_by || 'system';
      suggestion.accepted_at = new Date().toISOString();
    }
    
    // If the status is changed to 'modified', record who and when
    if (updates.status === 'modified') {
      suggestion.modified_by = updates.modified_by || 'system';
      suggestion.modified_at = new Date().toISOString();
      
      // Add to version history
      if (!suggestion.version_history) suggestion.version_history = [];
      suggestion.version_history.push({
        timestamp: suggestion.modified_at,
        changes: Object.keys(updates),
        modified_by: suggestion.modified_by
      });
    }
    
    return Promise.resolve(suggestion);
  }

  static async accept(id, officerInfo) {
    // Mock implementation to accept an AI patrol suggestion
    return this.update(id, {
      status: 'accepted',
      accepted_by: officerInfo,
      accepted_at: new Date().toISOString()
    });
  }

  static async reject(id, reason, officerInfo) {
    // Mock implementation to reject an AI patrol suggestion
    return this.update(id, {
      status: 'rejected',
      feedback: reason,
      accepted_by: officerInfo,
      accepted_at: new Date().toISOString()
    });
  }

  static async implement(id, patrolPlanId) {
    // Mock implementation to mark a suggestion as implemented
    return this.update(id, {
      status: 'implemented',
      related_patrol_plan: patrolPlanId
    });
  }

  static async delete(id) {
    // Mock implementation to delete an AI patrol suggestion
    return Promise.resolve({ success: true });
  }

  // Helper method to get suggestions by confidence threshold
  static async getByConfidenceThreshold(threshold) {
    const results = mockAIPatrolSuggestions.filter(
      suggestion => suggestion.confidence_score >= threshold
    );
    
    return Promise.resolve(results);
  }

  // Helper method to get suggestion metrics
  static async getMetrics(filters = {}) {
    const suggestions = await this.list(filters);
    
    // Calculate basic metrics
    const metrics = {
      total: suggestions.length,
      accepted: suggestions.filter(s => s.status === 'accepted').length,
      rejected: suggestions.filter(s => s.status === 'rejected').length,
      implemented: suggestions.filter(s => s.status === 'implemented').length,
      avg_confidence_score: suggestions.length > 0 ? 
        suggestions.reduce((sum, s) => sum + s.confidence_score, 0) / suggestions.length : 0
    };
    
    return Promise.resolve(metrics);
  }
}

// Mock data for testing
const mockAIPatrolSuggestions = [
  {
    suggestion_id: 'ai_suggestion_001',
    generated_date: '2023-07-16T20:30:00Z',
    patrol_date: '2023-07-17',
    shift_period: 'Evening',
    priority_zones: [
      {
        zone_name: 'West Central Market Area',
        coordinates: {
          latitude: 19.0760,
          longitude: 72.8777
        },
        risk_level: 'High',
        recommended_patrol_time: '18:00-20:00',
        suggested_officers: 2,
        predicted_incident_types: ['theft', 'assault'],
        confidence_score: 0.89,
        contributing_factors: ['evening crowds', 'recent thefts', 'poor lighting'],
        recommended_actions: ['visible patrols', 'surveillance checks', 'vendor cooperation']
      },
      {
        zone_name: 'North Industrial District',
        coordinates: {
          latitude: 19.0944,
          longitude: 72.8622
        },
        risk_level: 'Medium',
        recommended_patrol_time: '19:00-21:00',
        suggested_officers: 1,
        predicted_incident_types: ['vandalism', 'trespassing'],
        confidence_score: 0.75,
        contributing_factors: ['unattended premises', 'recent vandalism'],
        recommended_actions: ['perimeter checks', 'security system verifications']
      },
      {
        zone_name: 'South Residential Area',
        coordinates: {
          latitude: 19.0579,
          longitude: 72.8822
        },
        risk_level: 'Low',
        recommended_patrol_time: '20:00-22:00',
        suggested_officers: 1,
        predicted_incident_types: ['suspicious activity'],
        confidence_score: 0.62,
        contributing_factors: ['recent reports', 'vacant homes'],
        recommended_actions: ['neighborhood patrols', 'residents awareness']
      }
    ],
    confidence_score: 0.82,
    predicted_crimes: [
      { type: 'theft', probability: 0.78 },
      { type: 'assault', probability: 0.65 },
      { type: 'vandalism', probability: 0.59 },
      { type: 'trespassing', probability: 0.52 }
    ],
    recommended_officers: 4,
    model_version: 'v2.1.0',
    data_source: [
      'past_incident_reports',
      'weather_forecast',
      'local_events_calendar',
      'social_media_analytics',
      'traffic_patterns'
    ],
    explanation: 'Based on historical crime data, current weather conditions, and upcoming local events, there is a high probability of theft and assault in the West Central Market Area during the evening hours. Recent reports show an increase in petty crimes in this area over the past two weeks. Additional patrols are recommended to deter criminal activity and ensure public safety.',
    status: 'accepted',
    accepted_by: {
      id: 'officer_008',
      name: 'Inspector Vijay Desai',
      badge_number: 'TK2468'
    },
    accepted_at: '2023-07-17T09:30:00Z',
    modified_by: null,
    modified_at: null,
    feedback: null,
    related_patrol_plan: 'patrol_001',
    validation_metrics: {
      precision: 0.85,
      recall: 0.79,
      f1_score: 0.82,
      auc_roc: 0.91
    },
    version_history: [],
    geo_fencing_info: {
      enabled: true,
      alert_threshold: 2,
      notification_channel: 'mobile_app'
    }
  },
  {
    suggestion_id: 'ai_suggestion_002',
    generated_date: '2023-07-16T22:15:00Z',
    patrol_date: '2023-07-17',
    shift_period: 'Night',
    priority_zones: [
      {
        zone_name: 'East Nightclub District',
        coordinates: {
          latitude: 19.0826,
          longitude: 72.9006
        },
        risk_level: 'High',
        recommended_patrol_time: '23:00-01:00',
        suggested_officers: 3,
        predicted_incident_types: ['assault', 'drunk and disorderly', 'drug offenses'],
        confidence_score: 0.92,
        contributing_factors: ['weekend crowds', 'holiday weekend', 'recent arrests'],
        recommended_actions: ['foot patrols', 'license checks', 'partner with venue security']
      },
      {
        zone_name: 'Downtown Business Area',
        coordinates: {
          latitude: 19.0760,
          longitude: 72.8777
        },
        risk_level: 'Medium',
        recommended_patrol_time: '01:00-03:00',
        suggested_officers: 1,
        predicted_incident_types: ['break-in', 'vandalism'],
        confidence_score: 0.78,
        contributing_factors: ['after-hours business district', 'recent break-ins'],
        recommended_actions: ['mobile patrols', 'alarm verification']
      }
    ],
    confidence_score: 0.87,
    predicted_crimes: [
      { type: 'assault', probability: 0.89 },
      { type: 'drunk and disorderly', probability: 0.82 },
      { type: 'drug offenses', probability: 0.75 },
      { type: 'break-in', probability: 0.68 }
    ],
    recommended_officers: 4,
    model_version: 'v2.1.0',
    data_source: [
      'past_incident_reports',
      'weather_forecast',
      'local_events_calendar',
      'social_media_analytics',
      'traffic_patterns',
      'venue_capacity_data'
    ],
    explanation: 'The East Nightclub District has shown a significant increase in violent incidents during weekend nights over the past month. Given that this weekend coincides with a local holiday, an above-average turnout is expected, increasing the risk of altercations and related offenses. Additional officer presence is strongly recommended to maintain order and respond quickly to incidents.',
    status: 'pending',
    accepted_by: null,
    accepted_at: null,
    modified_by: null,
    modified_at: null,
    feedback: null,
    related_patrol_plan: null,
    validation_metrics: {
      precision: 0.88,
      recall: 0.82,
      f1_score: 0.85,
      auc_roc: 0.93
    },
    version_history: [],
    geo_fencing_info: {
      enabled: true,
      alert_threshold: 2,
      notification_channel: 'mobile_app'
    }
  },
  {
    suggestion_id: 'ai_suggestion_003',
    generated_date: '2023-07-17T08:45:00Z',
    patrol_date: '2023-07-18',
    shift_period: 'Morning',
    priority_zones: [
      {
        zone_name: 'South School Zone',
        coordinates: {
          latitude: 19.0579,
          longitude: 72.8822
        },
        risk_level: 'Medium',
        recommended_patrol_time: '07:30-09:30',
        suggested_officers: 1,
        predicted_incident_types: ['traffic violations', 'suspicious activity'],
        confidence_score: 0.74,
        contributing_factors: ['school opening day', 'new traffic patterns'],
        recommended_actions: ['traffic control', 'crossing guard support', 'visibility around school']
      },
      {
        zone_name: 'Central Park Area',
        coordinates: {
          latitude: 19.0700,
          longitude: 72.8800
        },
        risk_level: 'Low',
        recommended_patrol_time: '09:30-11:30',
        suggested_officers: 1,
        predicted_incident_types: ['petty theft', 'disorderly conduct'],
        confidence_score: 0.61,
        contributing_factors: ['morning walkers', 'market day'],
        recommended_actions: ['roving patrols', 'vendor check-ins']
      }
    ],
    confidence_score: 0.68,
    predicted_crimes: [
      { type: 'traffic violations', probability: 0.79 },
      { type: 'suspicious activity', probability: 0.65 },
      { type: 'petty theft', probability: 0.57 },
      { type: 'disorderly conduct', probability: 0.52 }
    ],
    recommended_officers: 2,
    model_version: 'v2.1.0',
    data_source: [
      'past_incident_reports',
      'school_calendar',
      'weather_forecast',
      'local_events_calendar',
      'traffic_patterns'
    ],
    explanation: 'The first day of school typically brings increased traffic and congestion around school zones. There is also an elevated risk of suspicious activity as unfamiliar individuals may attempt to exploit the distracted environment. A visible police presence can help maintain order, assist with traffic control, and deter potential criminal activity.',
    status: 'rejected',
    accepted_by: {
      id: 'officer_010',
      name: 'Sub-Inspector Ravi Pawar',
      badge_number: 'TK4680'
    },
    accepted_at: '2023-07-17T10:15:00Z',
    modified_by: null,
    modified_at: null,
    feedback: 'Resources already allocated based on previous planning. Confidence score too low for reallocation.',
    related_patrol_plan: null,
    validation_metrics: {
      precision: 0.72,
      recall: 0.68,
      f1_score: 0.70,
      auc_roc: 0.85
    },
    version_history: [],
    geo_fencing_info: {
      enabled: true,
      alert_threshold: 2,
      notification_channel: 'mobile_app'
    }
  }
];

export { AIPatrolSuggestion };