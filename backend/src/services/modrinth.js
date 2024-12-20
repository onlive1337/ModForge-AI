const axios = require('axios');

class ModrinthService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.modrinth.com/v2',
      headers: {
        'User-Agent': 'ModForge-AI/1.0'
      }
    });
  }

  async searchMods(query, version, limit = 25) {
    try {
      const response = await this.api.get('/search', {
        params: {
          query,
          facets: JSON.stringify([
            ["versions:" + version],
            ["project_type:mod"]
          ]),
          limit
        }
      });

      return response.data.hits;
    } catch (error) {
      console.error('Modrinth search error:', error);
      return [];
    }
  }

  async searchResourcePacks(query, version, limit = 10) {
    try {
      const response = await this.api.get('/search', {
        params: {
          query,
          facets: JSON.stringify([
            ["versions:" + version],
            ["project_type:resourcepack"]
          ]),
          limit
        }
      });

      return response.data.hits;
    } catch (error) {
      console.error('Modrinth search error:', error);
      return [];
    }
  }

  async searchShaders(query, version, limit = 10) {
    try {
      const response = await this.api.get('/search', {
        params: {
          query,
          facets: JSON.stringify([
            ["versions:" + version],
            ["project_type:shader"]
          ]),
          limit
        }
      });

      return response.data.hits;
    } catch (error) {
      console.error('Modrinth search error:', error);
      return [];
    }
  }

  async getModDependencies(modId) {
    try {
      const response = await this.api.get(`/project/${modId}`);
      return response.data.dependencies || [];
    } catch (error) {
      console.error('Error getting mod dependencies:', error);
      return [];
    }
  }
}

module.exports = new ModrinthService();