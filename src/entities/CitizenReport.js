// CitizenReport Entity Class
// This class represents a safety concern report submitted by a citizen

class CitizenReport {
  constructor(data) {
    this.report_id = data.report_id || this.generateReportId();
    this.report_type = data.report_type;
    this.location = data.location;
    this.description = data.description;
    this.safety_rating = data.safety_rating || null;
    this.urgency_level = data.urgency_level || 'Medium';
    this.photos = data.photos || [];
    this.reporter_contact = data.reporter_contact || null;
    this.verified = data.verified || false;
    this.status = data.status || 'Open';
    this.created_at = data.created_at || new Date().toISOString();
  }

  // Generate a unique report ID
  generateReportId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `REP-${timestamp}-${random}`;
  }

  // Static method to create a new report
  static async create(reportData) {
    // In a real application, this would send data to a backend API
    console.log('Creating new citizen report:', reportData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const report = new CitizenReport(reportData);
    
    // In a real app, you would save to database and return the saved record
    console.log('Report created successfully:', report.report_id);
    
    return report;
  }

  // Static method to fetch reports (for admin/police view)
  static async fetchAll() {
    // In a real application, this would fetch from a backend API
    // Simulating mock data for development
    const mockReports = [
      {
        report_id: 'REP-1724930000001',
        report_type: 'Suspicious Activity',
        location: {
          latitude: 19.2183,
          longitude: 72.9781,
          address: 'Viviana Mall, Ghodbunder Road, Thane'
        },
        description: 'Suspicious individuals loitering around the parking lot',
        safety_rating: 'Unsafe',
        urgency_level: 'Medium',
        status: 'Under Review',
        created_at: '2024-08-29T10:30:00Z'
      },
      {
        report_id: 'REP-1724930000002',
        report_type: 'Safety Concern',
        location: {
          latitude: 19.2283,
          longitude: 72.9681,
          address: 'Upvan Lake, Thane'
        },
        description: 'Poor lighting in the walking path after dark',
        safety_rating: 'Moderate',
        urgency_level: 'Low',
        status: 'Open',
        created_at: '2024-08-29T14:15:00Z'
      }
    ];
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return mockReports.map(report => new CitizenReport(report));
  }

  // Static method to update report status
  static async updateStatus(reportId, newStatus) {
    // In a real application, this would send data to a backend API
    console.log(`Updating report ${reportId} status to: ${newStatus}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return { success: true, message: 'Report status updated' };
  }
}

export { CitizenReport };