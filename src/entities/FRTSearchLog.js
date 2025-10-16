// Entity model for Face Recognition Technology Search Logs in Guardian Shield

class FRTSearchLog {
  constructor(data) {
    this.id = data.id || `frt_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.officer_badge_number = data.officer_badge_number || '';
    this.officer_name = data.officer_name || '';
    this.search_timestamp = data.search_timestamp || new Date().toISOString();
    this.justification = data.justification || '';
    this.related_case_number = data.related_case_number || null;
    this.probe_image_uri = data.probe_image_uri || '';
    this.search_results = data.search_results || [];
    this.ip_address = data.ip_address || '127.0.0.1';
    this.user_agent = data.user_agent || 'Guardian Shield UI';
    this.search_type = data.search_type || 'face';
    this.search_method = data.search_method || 'manual';
    this.is_audited = data.is_audited || false;
    this.audit_comments = data.audit_comments || null;
    this.audit_timestamp = data.audit_timestamp || null;
  }

  // Static methods for data operations
  static async create(data) {
    // In a real implementation, this would interact with a database
    // For now, we'll simulate a successful creation
    const newLog = new FRTSearchLog(data);
    return Promise.resolve(newLog);
  }

  static async getById(id) {
    // Mock implementation to get a log by ID
    // In a real app, this would query a database
    return Promise.resolve(mockLogs.find(log => log.id === id) || null);
  }

  static async list(filters = {}) {
    // Mock implementation to list logs with optional filters
    // In a real app, this would query a database with the provided filters
    let results = [...mockLogs];
    
    // Apply filters if provided
    if (filters.officer_badge_number) {
      results = results.filter(log => log.officer_badge_number === filters.officer_badge_number);
    }
    
    if (filters.related_case_number) {
      results = results.filter(log => log.related_case_number === filters.related_case_number);
    }
    
    if (filters.start_date && filters.end_date) {
      results = results.filter(log => {
        const logDate = new Date(log.search_timestamp);
        const startDate = new Date(filters.start_date);
        const endDate = new Date(filters.end_date);
        return logDate >= startDate && logDate <= endDate;
      });
    }
    
    return Promise.resolve(results);
  }

  static async markAsAudited(id, auditComments) {
    // Mock implementation to mark a log as audited
    const log = await this.getById(id);
    if (!log) {
      throw new Error(`Search log with ID ${id} not found`);
    }
    
    log.is_audited = true;
    log.audit_comments = auditComments;
    log.audit_timestamp = new Date().toISOString();
    
    return Promise.resolve(log);
  }

  static async delete(id) {
    // Mock implementation to delete a log
    return Promise.resolve({ success: true });
  }

  // Generate statistics about FRT usage
  static async generateStatistics(timeframe = 'month') {
    // Mock implementation to generate usage statistics
    // In a real app, this would aggregate data from the database
    
    let daysToConsider = 30; // Default to 30 days for monthly statistics
    if (timeframe === 'week') daysToConsider = 7;
    if (timeframe === 'year') daysToConsider = 365;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToConsider);
    
    const recentLogs = mockLogs.filter(log => new Date(log.search_timestamp) >= cutoffDate);
    
    // Calculate stats
    const stats = {
      total_searches: recentLogs.length,
      searches_by_officer: {},
      average_results_per_search: 0,
      searches_with_results: 0,
      audits_completed: recentLogs.filter(log => log.is_audited).length,
      timeframe,
      start_date: cutoffDate.toISOString(),
      end_date: new Date().toISOString()
    };
    
    // Calculate average results per search and searches with results
    if (recentLogs.length > 0) {
      let totalResults = 0;
      recentLogs.forEach(log => {
        const resultCount = log.search_results ? log.search_results.length : 0;
        totalResults += resultCount;
        if (resultCount > 0) stats.searches_with_results++;
        
        // Count searches by officer
        if (log.officer_badge_number) {
          if (!stats.searches_by_officer[log.officer_badge_number]) {
            stats.searches_by_officer[log.officer_badge_number] = 0;
          }
          stats.searches_by_officer[log.officer_badge_number]++;
        }
      });
      stats.average_results_per_search = totalResults / recentLogs.length;
    }
    
    return Promise.resolve(stats);
  }
}

// Mock data for testing
const mockLogs = [
  {
    id: 'frt_log_001',
    officer_badge_number: 'TK1234',
    officer_name: 'Inspector Ramesh Kadam',
    search_timestamp: '2023-07-15T10:30:00Z',
    justification: 'Identifying suspect in residential burglary case',
    related_case_number: 'CASE-2023-0045',
    probe_image_uri: 'private://face_recognition/20230715_103000_suspect.jpg',
    search_results: [
      { person_id: 'poi_001', confidence_score: 0.94 },
      { person_id: 'poi_003', confidence_score: 0.78 }
    ],
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    search_type: 'face',
    search_method: 'manual',
    is_audited: true,
    audit_comments: 'Search justified, results properly verified',
    audit_timestamp: '2023-07-16T14:20:00Z'
  },
  {
    id: 'frt_log_002',
    officer_badge_number: 'TK5678',
    officer_name: 'Sub-Inspector Priya Deshmukh',
    search_timestamp: '2023-07-18T14:20:00Z',
    justification: 'Identifying suspect from jewelry store robbery CCTV footage',
    related_case_number: 'CASE-2023-0067',
    probe_image_uri: 'private://face_recognition/20230718_142000_cctv.jpg',
    search_results: [
      { person_id: 'poi_003', confidence_score: 0.97 }
    ],
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    search_type: 'face',
    search_method: 'manual',
    is_audited: false,
    audit_comments: null,
    audit_timestamp: null
  },
  {
    id: 'frt_log_003',
    officer_badge_number: 'TK9012',
    officer_name: 'Inspector Sanjay Patil',
    search_timestamp: '2023-07-20T09:15:00Z',
    justification: 'Confirming identity of financial fraud suspect',
    related_case_number: 'CASE-2023-0078',
    probe_image_uri: 'private://face_recognition/20230720_091500_identity.jpg',
    search_results: [
      { person_id: 'poi_002', confidence_score: 0.99 }
    ],
    ip_address: '192.168.1.102',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/94.0',
    search_type: 'face',
    search_method: 'manual',
    is_audited: true,
    audit_comments: 'Positive identification confirmed',
    audit_timestamp: '2023-07-21T11:30:00Z'
  },
  {
    id: 'frt_log_004',
    officer_badge_number: 'TK3456',
    officer_name: 'ASI Vijay Kumbhar',
    search_timestamp: '2023-07-22T16:45:00Z',
    justification: 'Identifying suspect from assault case witness description',
    related_case_number: 'CASE-2023-0092',
    probe_image_uri: 'private://face_recognition/20230722_164500_composite.jpg',
    search_results: [
      { person_id: 'poi_003', confidence_score: 0.92 },
      { person_id: 'poi_001', confidence_score: 0.75 }
    ],
    ip_address: '192.168.1.103',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1',
    search_type: 'face',
    search_method: 'manual',
    is_audited: false,
    audit_comments: null,
    audit_timestamp: null
  }
];

export { FRTSearchLog };