// Entity model for Crime Hotspots in Guardian Shield

class CrimeHotspot {
  constructor(data) {
    this.id = data.id || `hotspot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.hotspot_id = data.hotspot_id || `HS-${Math.floor(100 + Math.random() * 900)}`;
    this.center_coordinates = data.center_coordinates || { latitude: 0, longitude: 0 };
    this.radius_meters = data.radius_meters || 500;
    this.risk_level = data.risk_level || 'Medium';
    this.crime_density = data.crime_density || 0;
    this.dominant_crime_types = data.dominant_crime_types || [];
    this.active_hours = data.active_hours || [];
    this.patrol_recommendation = data.patrol_recommendation || '';
    this.citizen_reports_count = data.citizen_reports_count || 0;
    this.last_updated = data.last_updated || new Date().toISOString();
    this.incident_count = data.incident_count || 0;
    this.start_date = data.start_date || null;
    this.end_date = data.end_date || null;
    this.cluster_size = data.cluster_size || 0;
    this.cluster_algorithm = data.cluster_algorithm || 'DBSCAN';
    this.reduction_strategy = data.reduction_strategy || '';
    this.geofence_id = data.geofence_id || null;
    this.alert_threshold = data.alert_threshold || null;
  }

  // Static methods for data operations
  static async create(data) {
    // In a real implementation, this would interact with a database
    // For now, we'll simulate a successful creation
    const newHotspot = new CrimeHotspot(data);
    return Promise.resolve(newHotspot);
  }

  static async getById(id) {
    // Mock implementation to get a hotspot by ID
    // In a real app, this would query a database
    return Promise.resolve(mockHotspots.find(hotspot => hotspot.id === id) || null);
  }

  static async getByHotspotId(hotspotId) {
    // Mock implementation to get a hotspot by hotspot ID
    return Promise.resolve(mockHotspots.find(hotspot => hotspot.hotspot_id === hotspotId) || null);
  }

  static async list(sortBy = null) {
    // Mock implementation to list hotspots with optional sorting
    // In a real app, this would query a database with the provided sorting
    let results = [...mockHotspots];
    
    // Apply sorting if provided
    if (sortBy === 'risk_level') {
      // Sort by risk level (Critical > High > Medium > Low)
      const riskOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      results.sort((a, b) => riskOrder[b.risk_level] - riskOrder[a.risk_level]);
    } else if (sortBy === '-risk_level') {
      // Sort by risk level in reverse order (Low > Medium > High > Critical)
      const riskOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      results.sort((a, b) => riskOrder[a.risk_level] - riskOrder[b.risk_level]);
    } else if (sortBy === 'crime_density') {
      // Sort by crime density in ascending order
      results.sort((a, b) => a.crime_density - b.crime_density);
    } else if (sortBy === '-crime_density') {
      // Sort by crime density in descending order
      results.sort((a, b) => b.crime_density - a.crime_density);
    } else if (sortBy === 'last_updated') {
      // Sort by last updated in ascending order
      results.sort((a, b) => new Date(a.last_updated) - new Date(b.last_updated));
    } else if (sortBy === '-last_updated') {
      // Sort by last updated in descending order
      results.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
    }
    
    return Promise.resolve(results);
  }

  static async update(id, updates) {
    // Mock implementation to update a hotspot
    const hotspot = await this.getById(id);
    if (!hotspot) {
      throw new Error(`Crime hotspot with ID ${id} not found`);
    }
    
    // Apply updates
    Object.assign(hotspot, updates);
    hotspot.last_updated = new Date().toISOString();
    
    return Promise.resolve(hotspot);
  }

  static async delete(id) {
    // Mock implementation to delete a hotspot
    return Promise.resolve({ success: true });
  }

  // Additional method to calculate distance from a point
  static calculateDistance(lat1, lon1, lat2, lon2) {
    // Using Haversine formula to calculate distance between two points
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance * 1000; // Convert to meters
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }
}

// Mock data for testing
const mockHotspots = [
  {
    id: 'hotspot_001',
    hotspot_id: 'HS-001',
    center_coordinates: { latitude: 19.1937, longitude: 72.9739 },
    radius_meters: 500,
    risk_level: 'Critical',
    crime_density: 45.2,
    dominant_crime_types: ['Theft', 'Burglary'],
    active_hours: ['20:00-02:00', '14:00-18:00'],
    patrol_recommendation: 'Increase patrols during evening hours, deploy K-9 unit',
    citizen_reports_count: 12,
    last_updated: '2023-07-16T15:30:00Z',
    incident_count: 18,
    start_date: '2023-06-01T00:00:00Z',
    end_date: '2023-07-16T00:00:00Z',
    cluster_size: 15,
    cluster_algorithm: 'DBSCAN',
    reduction_strategy: 'Increased police presence, community awareness programs',
    geofence_id: 'gf_001',
    alert_threshold: 5
  },
  {
    id: 'hotspot_002',
    hotspot_id: 'HS-002',
    center_coordinates: { latitude: 19.1948, longitude: 72.9756 },
    radius_meters: 750,
    risk_level: 'High',
    crime_density: 32.8,
    dominant_crime_types: ['Drug Related', 'Public Disturbance'],
    active_hours: ['18:00-24:00'],
    patrol_recommendation: 'Regular foot patrols, community engagement',
    citizen_reports_count: 8,
    last_updated: '2023-07-16T14:15:00Z',
    incident_count: 12,
    start_date: '2023-06-15T00:00:00Z',
    end_date: '2023-07-16T00:00:00Z',
    cluster_size: 9,
    cluster_algorithm: 'OPTICS',
    reduction_strategy: 'Undercover operations, surveillance cameras',
    geofence_id: 'gf_002',
    alert_threshold: 4
  },
  {
    id: 'hotspot_003',
    hotspot_id: 'HS-003',
    center_coordinates: { latitude: 19.1965, longitude: 72.9772 },
    radius_meters: 400,
    risk_level: 'Medium',
    crime_density: 18.5,
    dominant_crime_types: ['Vandalism', 'Traffic Violation'],
    active_hours: ['12:00-16:00'],
    patrol_recommendation: 'Periodic vehicle patrols sufficient',
    citizen_reports_count: 5,
    last_updated: '2023-07-16T10:45:00Z',
    incident_count: 7,
    start_date: '2023-07-01T00:00:00Z',
    end_date: '2023-07-16T00:00:00Z',
    cluster_size: 6,
    cluster_algorithm: 'DBSCAN',
    reduction_strategy: 'Increased signage, traffic calming measures',
    geofence_id: 'gf_003',
    alert_threshold: 3
  },
  {
    id: 'hotspot_004',
    hotspot_id: 'HS-004',
    center_coordinates: { latitude: 19.1982, longitude: 72.9787 },
    radius_meters: 600,
    risk_level: 'Medium',
    crime_density: 22.1,
    dominant_crime_types: ['Assault', 'Robbery'],
    active_hours: ['22:00-04:00'],
    patrol_recommendation: 'Increased late-night patrols, taxi stand monitoring',
    citizen_reports_count: 9,
    last_updated: '2023-07-16T08:20:00Z',
    incident_count: 10,
    start_date: '2023-06-20T00:00:00Z',
    end_date: '2023-07-16T00:00:00Z',
    cluster_size: 8,
    cluster_algorithm: 'OPTICS',
    reduction_strategy: 'Lighting improvements, security guard deployment',
    geofence_id: 'gf_004',
    alert_threshold: 4
  }
];

export { CrimeHotspot };