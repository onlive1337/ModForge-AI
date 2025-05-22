const axios = require('axios');

class ModrinthService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.modrinth.com/v2',
      headers: {
        'User-Agent': 'ModForge-AI/1.0'
      }
    });
    this.requestDelay = 200;
    this.lastRequestTime = 0;
    this.retryCount = 3;
  }

  async delayRequest() {
    const now = Date.now();
    const timeElapsed = now - this.lastRequestTime;
    if (timeElapsed < this.requestDelay) {
      await new Promise(resolve => setTimeout(resolve, this.requestDelay - timeElapsed));
    }
    this.lastRequestTime = Date.now();
  }

  async retryRequest(fn, retries = this.retryCount) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async searchMods(query, version, loader = "forge", limit = 25) {
    try {
      await this.delayRequest();
      
      const facets = [];
      facets.push(["project_type:mod"]);
      if (version) facets.push([`versions:${version}`]);
      if (loader) facets.push([`categories:${loader.toLowerCase()}`]);

      let enhancedQuery = query;
      
      if (query.length < 3 || query === ' ') {
        enhancedQuery = 'minecraft mod';
      }
      
      enhancedQuery = enhancedQuery
        .replace(/[^\w\s\-а-яА-Я]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const searchParams = {
        query: enhancedQuery,
        facets: JSON.stringify(facets),
        limit: Math.min(limit, 100),
        index: 'relevance'
      };

      console.log('Search params:', searchParams);

      const response = await this.retryRequest(() => 
        this.api.get('/search', { params: searchParams })
      );

      const results = (response.data.hits || []).filter(hit => {
        const isLibrary = hit.categories?.includes('library') || 
                         hit.title.toLowerCase().includes('api') ||
                         hit.title.toLowerCase().includes('lib');
        
        if (isLibrary && !query.toLowerCase().includes('api') && 
            !query.toLowerCase().includes('library')) {
          return false;
        }
        
        return true;
      });

      return results.map(hit => ({
        ...hit,
        type: 'mod'
      }));
    } catch (error) {
      console.error('Modrinth search error:', error.message, error.response?.data);
      return [];
    }
  }

  async searchResourcePacks(query, version, limit = 10) {
    try {
      await this.delayRequest();
      
      const facets = [];
      facets.push(["project_type:resourcepack"]);
      if (version) facets.push([`versions:${version}`]);

      const response = await this.retryRequest(() =>
        this.api.get('/search', {
          params: {
            query: query || ' ',
            facets: JSON.stringify(facets),
            limit: Math.min(limit, 100)
          }
        })
      );

      return (response.data.hits || []).map(hit => ({
        ...hit,
        type: 'resourcepack'
      }));
    } catch (error) {
      console.error('Modrinth resource pack search error:', error.message, error.response?.data);
      return [];
    }
  }

  async searchShaders(query, version, limit = 10) {
    try {
      await this.delayRequest();
      
      const facets = [];
      facets.push(["project_type:shader"]);
      if (version) facets.push([`versions:${version}`]);

      const response = await this.retryRequest(() =>
        this.api.get('/search', {
          params: {
            query: query || ' ',
            facets: JSON.stringify(facets),
            limit: Math.min(limit, 100)
          }
        })
      );

      return (response.data.hits || []).map(hit => ({
        ...hit,
        type: 'shader'
      }));
    } catch (error) {
      console.error('Modrinth shader search error:', error.message, error.response?.data);
      return [];
    }
  }

  async getModDependencies(modId) {
    try {
      await this.delayRequest();
      const response = await this.retryRequest(() =>
        this.api.get(`/project/${modId}`)
      );
      return response.data.dependencies || [];
    } catch (error) {
      console.error('Modrinth dependencies error:', error.message);
      return [];
    }
  }

  async getVersionInfo(modId, gameVersion, loader) {
    try {
      await this.delayRequest();
      const response = await this.retryRequest(() =>
        this.api.get(`/project/${modId}/version`, {
          params: {
            game_versions: [gameVersion],
            loaders: [loader]
          }
        })
      );
      return response.data[0] || null;
    } catch (error) {
      console.error('Modrinth version info error:', error.message);
      return null;
    }
  }
}

module.exports = new ModrinthService();