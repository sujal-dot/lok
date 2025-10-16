// Entity model for Crime Predictions in Guardian Shield

class CrimePrediction {
  constructor(data) {
    this.prediction_id = data.prediction_id || `prediction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.location = data.location || {
      latitude: 0,
      longitude: 0,
      area_name: ''
    };
    this.prediction_date = data.prediction_date || new Date().toISOString().split('T')[0];
    this.prediction_time_window = data.prediction_time_window || '06:00-12:00';
    this.predicted_crime_types = data.predicted_crime_types || [];
    this.risk_score = data.risk_score || 0.0;
    this.confidence_level = data.confidence_level || 0.0;
    this.model_version = data.model_version || 'v1.0.0';
    this.generated_at = data.generated_at || new Date().toISOString();
    this.data_sources = data.data_sources || [];
    this.contributing_factors = data.contributing_factors || [];
    this.status = data.status || 'active'; // 'active', 'expired', 'archived', 'superseded'
    this.related_incidents = data.related_incidents || [];
    this.recommendations = data.recommendations || [];
    this.validation_results = data.validation_results || {};
    this.last_updated = data.last_updated || new Date().toISOString();
    this.version = data.version || 1;
    this.is_anomaly = data.is_anomaly || false;
  }

  // Static methods for data operations
  static async create(data) {
    // In a real implementation, this would interact with a database
    // For now, we'll simulate a successful creation
    const newPrediction = new CrimePrediction(data);
    return Promise.resolve(newPrediction);
  }

  static async getById(id) {
    // Mock implementation to get a crime prediction by ID
    // In a real app, this would query a database
    return Promise.resolve(mockCrimePredictions.find(prediction => prediction.prediction_id === id) || null);
  }

  static async list(filters = {}) {
    // Mock implementation to list crime predictions with optional filters
    // In a real app, this would query a database with the provided filters
    let results = [...mockCrimePredictions];
    
    // Apply filters if provided
    if (filters.prediction_date) {
      results = results.filter(prediction => prediction.prediction_date === filters.prediction_date);
    }
    
    if (filters.prediction_time_window) {
      results = results.filter(prediction => prediction.prediction_time_window === filters.prediction_time_window);
    }
    
    if (filters.status) {
      results = results.filter(prediction => prediction.status === filters.status);
    }
    
    if (filters.min_risk_score) {
      results = results.filter(prediction => prediction.risk_score >= filters.min_risk_score);
    }
    
    // Sort by risk_score (highest first) by default
    results.sort((a, b) => b.risk_score - a.risk_score);
    
    return Promise.resolve(results);
  }

  static async update(id, updates) {
    // Mock implementation to update a crime prediction
    const prediction = await this.getById(id);
    if (!prediction) {
      throw new Error(`Crime Prediction with ID ${id} not found`);
    }
    
    // Apply updates
    Object.assign(prediction, updates);
    prediction.last_updated = new Date().toISOString();
    prediction.version += 1;
    
    return Promise.resolve(prediction);
  }

  static async archive(id) {
    // Mock implementation to archive a crime prediction
    return this.update(id, {
      status: 'archived',
      last_updated: new Date().toISOString()
    });
  }

  static async expire(id) {
    // Mock implementation to expire a crime prediction
    return this.update(id, {
      status: 'expired',
      last_updated: new Date().toISOString()
    });
  }

  static async delete(id) {
    // Mock implementation to delete a crime prediction
    return Promise.resolve({ success: true });
  }

  // Helper method to get high risk predictions
  static async getHighRiskPredictions(minRiskScore = 0.7, date = null) {
    const filters = { min_risk_score: minRiskScore };
    if (date) {
      filters.prediction_date = date;
    }
    
    const results = await this.list(filters);
    return Promise.resolve(results);
  }

  // Helper method to get predictions by area
  static async getByArea(areaName) {
    const results = mockCrimePredictions.filter(
      prediction => prediction.location.area_name.toLowerCase() === areaName.toLowerCase()
    );
    
    return Promise.resolve(results);
  }

  // Helper method to get summary statistics
  static async getStatistics(dateRange = {}) {
    const predictions = await this.list(dateRange);
    
    if (predictions.length === 0) {
      return Promise.resolve({
        total_predictions: 0,
        average_risk_score: 0,
        high_risk_count: 0,
        medium_risk_count: 0,
        low_risk_count: 0,
        most_common_crime_type: null,
        most_risk_area: null
      });
    }
    
    // Calculate statistics
    const totalRiskScore = predictions.reduce((sum, p) => sum + p.risk_score, 0);
    const averageRiskScore = totalRiskScore / predictions.length;
    
    const highRiskCount = predictions.filter(p => p.risk_score >= 0.7).length;
    const mediumRiskCount = predictions.filter(p => p.risk_score >= 0.4 && p.risk_score < 0.7).length;
    const lowRiskCount = predictions.filter(p => p.risk_score < 0.4).length;
    
    // Count crime types
    const crimeTypeCount = {};
    predictions.forEach(p => {
      p.predicted_crime_types.forEach(crime => {
        if (!crimeTypeCount[crime.crime_type]) {
          crimeTypeCount[crime.crime_type] = 0;
        }
        crimeTypeCount[crime.crime_type] += crime.expected_incidents || 1;
      });
    });
    
    // Find most common crime type
    let mostCommonCrimeType = null;
    let maxCrimeCount = 0;
    Object.entries(crimeTypeCount).forEach(([type, count]) => {
      if (count > maxCrimeCount) {
        maxCrimeCount = count;
        mostCommonCrimeType = type;
      }
    });
    
    // Find most risky area
    let mostRiskArea = null;
    let highestRiskScore = -1;
    predictions.forEach(p => {
      if (p.risk_score > highestRiskScore) {
        highestRiskScore = p.risk_score;
        mostRiskArea = p.location.area_name;
      }
    });
    
    return Promise.resolve({
      total_predictions: predictions.length,
      average_risk_score: parseFloat(averageRiskScore.toFixed(2)),
      high_risk_count: highRiskCount,
      medium_risk_count: mediumRiskCount,
      low_risk_count: lowRiskCount,
      most_common_crime_type: mostCommonCrimeType,
      most_risk_area: mostRiskArea
    });
  }
}

// Mock data for testing
const mockCrimePredictions = [
  {
    prediction_id: 'prediction_001',
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      area_name: 'West Central Market Area'
    },
    prediction_date: '2023-07-17',
    prediction_time_window: '18:00-24:00',
    predicted_crime_types: [
      {
        crime_type: 'Theft',
        probability: 0.85,
        expected_incidents: 4,
        description: 'Petty theft, pickpocketing, and shoplifting expected in crowded areas',
        risk_level: 'High',
        historical_data: {
          past_week: 3,
          past_month: 12,
          trend: 'increasing'
        }
      },
      {
        crime_type: 'Assault',
        probability: 0.72,
        expected_incidents: 2,
        description: 'Altercations between individuals, potential for violence',
        risk_level: 'Medium',
        historical_data: {
          past_week: 1,
          past_month: 5,
          trend: 'stable'
        }
      },
      {
        crime_type: 'Vandalism',
        probability: 0.58,
        expected_incidents: 1,
        description: 'Property damage in less supervised areas',
        risk_level: 'Medium',
        historical_data: {
          past_week: 2,
          past_month: 7,
          trend: 'increasing'
        }
      }
    ],
    risk_score: 0.82,
    confidence_level: 0.89,
    model_version: 'v2.2.1',
    generated_at: '2023-07-16T15:30:00Z',
    data_sources: [
      'past_incident_reports',
      'weather_forecast',
      'local_events_calendar',
      'social_media_analytics',
      'traffic_patterns',
      'demographic_data'
    ],
    contributing_factors: [
      'Evening crowds',
      'Recent increase in theft reports',
      'Upcoming local festival',
      'Poor lighting in certain areas',
      'Reduced police presence due to other incidents'
    ],
    status: 'active',
    related_incidents: ['incident_123', 'incident_456', 'incident_789'],
    recommendations: [
      'Increase foot patrols in market area',
      'Deploy plainclothes officers',
      'Enhance surveillance monitoring',
      'Coordinate with local vendors for increased awareness',
      'Improve lighting in identified problem areas'
    ],
    validation_results: {
      precision: 0.87,
      recall: 0.83,
      f1_score: 0.85,
      auc_roc: 0.92
    },
    last_updated: '2023-07-17T09:15:00Z',
    version: 2,
    is_anomaly: false
  },
  {
    prediction_id: 'prediction_002',
    location: {
      latitude: 19.0826,
      longitude: 72.9006,
      area_name: 'East Nightclub District'
    },
    prediction_date: '2023-07-17',
    prediction_time_window: '22:00-04:00',
    predicted_crime_types: [
      {
        crime_type: 'Assault',
        probability: 0.91,
        expected_incidents: 5,
        description: 'Physical altercations, potential for serious violence',
        risk_level: 'High',
        historical_data: {
          past_week: 4,
          past_month: 18,
          trend: 'increasing'
        }
      },
      {
        crime_type: 'Drunk and Disorderly Conduct',
        probability: 0.88,
        expected_incidents: 8,
        description: 'Public intoxication, verbal altercations',
        risk_level: 'High',
        historical_data: {
          past_week: 7,
          past_month: 25,
          trend: 'stable'
        }
      },
      {
        crime_type: 'Drug Offenses',
        probability: 0.76,
        expected_incidents: 3,
        description: 'Possession, distribution, and use of controlled substances',
        risk_level: 'Medium',
        historical_data: {
          past_week: 2,
          past_month: 9,
          trend: 'decreasing'
        }
      }
    ],
    risk_score: 0.90,
    confidence_level: 0.93,
    model_version: 'v2.2.1',
    generated_at: '2023-07-16T18:45:00Z',
    data_sources: [
      'past_incident_reports',
      'weather_forecast',
      'local_events_calendar',
      'social_media_analytics',
      'venue_capacity_data',
      'alcohol_sales_data'
    ],
    contributing_factors: [
      'Weekend nightlife',
      'Holiday weekend',
      'Live music events',
      'Recent increase in alcohol-related incidents',
      'Large expected crowds'
    ],
    status: 'active',
    related_incidents: ['incident_234', 'incident_567', 'incident_890', 'incident_101'],
    recommendations: [
      'Increase uniformed presence in the district',
      'Deploy additional units for crowd control',
      'Coordinate with venue security',
      'Implement sobriety checkpoints',
      'Establish a dedicated response team'
    ],
    validation_results: {
      precision: 0.90,
      recall: 0.87,
      f1_score: 0.88,
      auc_roc: 0.95
    },
    last_updated: '2023-07-17T11:30:00Z',
    version: 1,
    is_anomaly: false
  },
  {
    prediction_id: 'prediction_003',
    location: {
      latitude: 19.0579,
      longitude: 72.8822,
      area_name: 'South School Zone'
    },
    prediction_date: '2023-07-18',
    prediction_time_window: '06:00-12:00',
    predicted_crime_types: [
      {
        crime_type: 'Traffic Violations',
        probability: 0.83,
        expected_incidents: 12,
        description: 'Speeding, illegal parking, failure to yield',
        risk_level: 'Medium',
        historical_data: {
          past_week: 10,
          past_month: 42,
          trend: 'stable'
        }
      },
      {
        crime_type: 'Suspicious Activity',
        probability: 0.65,
        expected_incidents: 3,
        description: 'Unusual behavior around school perimeter',
        risk_level: 'Medium',
        historical_data: {
          past_week: 2,
          past_month: 8,
          trend: 'increasing'
        }
      }
    ],
    risk_score: 0.68,
    confidence_level: 0.74,
    model_version: 'v2.2.1',
    generated_at: '2023-07-17T08:00:00Z',
    data_sources: [
      'past_incident_reports',
      'school_calendar',
      'weather_forecast',
      'traffic_patterns',
      'demographic_data'
    ],
    contributing_factors: [
      'First day of school',
      'New traffic patterns',
      'Increased parent drop-off/pick-up traffic',
      'New school security measures',
      'Recent reports of suspicious individuals'
    ],
    status: 'active',
    related_incidents: ['incident_345', 'incident_678'],
    recommendations: [
      'Deploy traffic officers during peak hours',
      'Increase visible patrols around school perimeter',
      'Coordinate with school security',
      'Set up temporary speed monitoring',
      'Educate parents about new traffic rules'
    ],
    validation_results: {
      precision: 0.72,
      recall: 0.68,
      f1_score: 0.70,
      auc_roc: 0.85
    },
    last_updated: '2023-07-17T10:00:00Z',
    version: 1,
    is_anomaly: false
  },
  {
    prediction_id: 'prediction_004',
    location: {
      latitude: 19.0944,
      longitude: 72.8622,
      area_name: 'North Industrial District'
    },
    prediction_date: '2023-07-17',
    prediction_time_window: '00:00-06:00',
    predicted_crime_types: [
      {
        crime_type: 'Break-in',
        probability: 0.79,
        expected_incidents: 2,
        description: 'Attempted break-ins at industrial facilities',
        risk_level: 'Medium',
        historical_data: {
          past_week: 1,
          past_month: 6,
          trend: 'increasing'
        }
      },
      {
        crime_type: 'Vandalism',
        probability: 0.72,
        expected_incidents: 3,
        description: 'Property damage to industrial equipment and buildings',
        risk_level: 'Medium',
        historical_data: {
          past_week: 2,
          past_month: 9,
          trend: 'stable'
        }
      },
      {
        crime_type: 'Trespassing',
        probability: 0.68,
        expected_incidents: 4,
        description: 'Unauthorized individuals on industrial property',
        risk_level: 'Low',
        historical_data: {
          past_week: 3,
          past_month: 11,
          trend: 'increasing'
        }
      }
    ],
    risk_score: 0.73,
    confidence_level: 0.78,
    model_version: 'v2.2.1',
    generated_at: '2023-07-16T23:15:00Z',
    data_sources: [
      'past_incident_reports',
      'weather_forecast',
      'security_system_data',
      'local_events_calendar',
      'economic_indicators'
    ],
    contributing_factors: [
      'Reduced security staff during night hours',
      'Recent equipment thefts',
      'Unattended premises',
      'Poor lighting in some areas',
      'Economic downturn affecting the area'
    ],
    status: 'active',
    related_incidents: ['incident_456', 'incident_789', 'incident_012'],
    recommendations: [
      'Increase patrols in the industrial area',
      'Advise businesses to enhance security measures',
      'Check and repair lighting in problem areas',
      'Establish a business watch program',
      'Consider deploying mobile surveillance units'
    ],
    validation_results: {
      precision: 0.76,
      recall: 0.73,
      f1_score: 0.74,
      auc_roc: 0.87
    },
    last_updated: '2023-07-17T07:45:00Z',
    version: 1,
    is_anomaly: false
  }
];

export { CrimePrediction };