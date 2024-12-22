const modrinthService = require('./modrinth');

class CompatibilityService {
  constructor() {
    this.knownConflicts = new Map();
    this.requiredDependencies = new Map();
  }

  async checkModCompatibility(mods) {
    const issues = [];
    const requiredMods = new Set();

    for (const mod of mods) {
      try {
        const dependencies = await this.getModDependencies(mod.project_id);
        
        for (const dep of dependencies) {
          if (dep.dependency_type === 'required') {
            requiredMods.add(dep.project_id);
          }
        }
      } catch (error) {
        console.warn(`Failed to get dependencies for mod ${mod.title}:`, error);
      }
    }

    for (let i = 0; i < mods.length; i++) {
      for (let j = i + 1; j < mods.length; j++) {
        const conflict = await this.checkPairCompatibility(mods[i], mods[j]);
        if (conflict) {
          issues.push(conflict);
        }
      }
    }

    return {
      issues,
      requiredMods: Array.from(requiredMods)
    };
  }

  async checkPairCompatibility(mod1, mod2) {
    const cacheKey = `${mod1.project_id}:${mod2.project_id}`;
    
    if (this.knownConflicts.has(cacheKey)) {
      return this.knownConflicts.get(cacheKey);
    }

    return null;
  }

  async getModDependencies(modId) {
    if (this.requiredDependencies.has(modId)) {
      return this.requiredDependencies.get(modId);
    }

    try {
      const dependencies = await modrinthService.getModDependencies(modId);
      this.requiredDependencies.set(modId, dependencies);
      return dependencies;
    } catch (error) {
      console.error(`Error getting dependencies for mod ${modId}:`, error);
      return [];
    }
  }
}

module.exports = new CompatibilityService();