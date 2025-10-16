// Entity model for Persons of Interest in Guardian Shield

class PersonOfInterest {
  constructor(data) {
    this.id = data.id || `poi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.full_name = data.full_name || '';
    this.aliases = data.aliases || [];
    this.date_of_birth = data.date_of_birth || '';
    this.gender = data.gender || '';
    this.nationality = data.nationality || '';
    this.status = data.status || 'unknown'; // 'unknown', 'sought', 'detained', 'cleared'
    this.photo_uris = data.photo_uris || [];
    this.description = data.description || '';
    this.last_known_location = data.last_known_location || null;
    this.associated_crimes = data.associated_crimes || [];
    this.case_references = data.case_references || [];
    this.notes = data.notes || '';
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.risk_level = data.risk_level || 'medium'; // 'low', 'medium', 'high'
  }

  // Static methods for data operations
  static async create(data) {
    // In a real implementation, this would interact with a database
    // For now, we'll simulate a successful creation
    const newPerson = new PersonOfInterest(data);
    return Promise.resolve(newPerson);
  }

  static async getById(id) {
    // Mock implementation to get a person by ID
    // In a real app, this would query a database
    return Promise.resolve(mockPersons.find(p => p.id === id) || null);
  }

  static async list(filters = {}) {
    // Mock implementation to list persons with optional filters
    // In a real app, this would query a database with the provided filters
    let results = [...mockPersons];
    
    // Apply filters if provided
    if (filters.status) {
      results = results.filter(p => p.status === filters.status);
    }
    
    if (filters.risk_level) {
      results = results.filter(p => p.risk_level === filters.risk_level);
    }
    
    return Promise.resolve(results);
  }

  static async update(id, updates) {
    // Mock implementation to update a person
    const person = await this.getById(id);
    if (!person) {
      throw new Error(`Person of interest with ID ${id} not found`);
    }
    
    // Apply updates
    Object.assign(person, updates);
    person.updated_at = new Date().toISOString();
    
    return Promise.resolve(person);
  }

  static async delete(id) {
    // Mock implementation to delete a person
    return Promise.resolve({ success: true });
  }
}

// Mock data for testing
const mockPersons = [
  {
    id: 'poi_001',
    full_name: 'Rajesh Sharma',
    aliases: ['Raj', 'Sharma Ji'],
    date_of_birth: '1985-03-15',
    gender: 'Male',
    nationality: 'Indian',
    status: 'sought',
    photo_uris: ['person_photos/rajesh_sharma.jpg'],
    description: 'Height: 5\'10", Weight: 75kg, Scar on left cheek',
    last_known_location: {
      address: '123 Main Street, Thane',
      latitude: 19.1937,
      longitude: 72.9739
    },
    associated_crimes: ['Theft', 'Burglary'],
    case_references: ['CASE-2023-0045', 'CASE-2023-0067'],
    notes: 'Suspected of multiple residential burglaries in Thane area',
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-05-20T14:20:00Z',
    risk_level: 'high'
  },
  {
    id: 'poi_002',
    full_name: 'Priya Patel',
    aliases: ['PP', 'Patel'],
    date_of_birth: '1990-08-22',
    gender: 'Female',
    nationality: 'Indian',
    status: 'detained',
    photo_uris: ['person_photos/priya_patel.jpg'],
    description: 'Height: 5\'4", Weight: 55kg, Tattoo on right arm',
    last_known_location: null,
    associated_crimes: ['Fraud', 'Forgery'],
    case_references: ['CASE-2023-0078'],
    notes: 'In custody for financial fraud',
    created_at: '2023-02-10T09:15:00Z',
    updated_at: '2023-06-10T11:30:00Z',
    risk_level: 'medium'
  },
  {
    id: 'poi_003',
    full_name: 'Vikram Singh',
    aliases: ['Vicky', 'Singh'],
    date_of_birth: '1978-11-30',
    gender: 'Male',
    nationality: 'Indian',
    status: 'sought',
    photo_uris: ['person_photos/vikram_singh.jpg'],
    description: 'Height: 6\'1", Weight: 85kg, Bald head',
    last_known_location: {
      address: '456 Market Avenue, Thane',
      latitude: 19.1948,
      longitude: 72.9756
    },
    associated_crimes: ['Assault', 'Extortion'],
    case_references: ['CASE-2023-0092', 'CASE-2023-0105'],
    notes: 'Known associate of local criminal network',
    created_at: '2023-03-05T16:45:00Z',
    updated_at: '2023-07-02T08:15:00Z',
    risk_level: 'high'
  },
  {
    id: 'poi_004',
    full_name: 'Anita Desai',
    aliases: ['Nita', 'Desai'],
    date_of_birth: '1992-05-18',
    gender: 'Female',
    nationality: 'Indian',
    status: 'unknown',
    photo_uris: ['person_photos/anita_desai.jpg'],
    description: 'Height: 5\'5", Weight: 60kg, Glasses',
    last_known_location: null,
    associated_crimes: ['Drug Trafficking'],
    case_references: ['CASE-2023-0118'],
    notes: 'Under investigation for involvement in drug network',
    created_at: '2023-04-22T13:20:00Z',
    updated_at: '2023-04-22T13:20:00Z',
    risk_level: 'medium'
  }
];

export { PersonOfInterest };