export class Officer {
    constructor({ id, name, rank, station, status = 'Active' }) {
      this.id = id
      this.name = name
      this.rank = rank
      this.station = station
      this.status = status
    }
  }
  