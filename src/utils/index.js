export function createPageUrl(path = '') {
    const base = '/'
    return `${base}${path.replace(/^\//, '')}`
  }
  