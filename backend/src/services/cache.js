const Cache = require('../models/Cache');

const CACHE_DURATION = 24 * 60 * 60 * 1000;

module.exports = {
  async getCached(key) {
    try {
      const cached = await Cache.findOne({ key });
      if (cached && cached.expiresAt > new Date()) {
        return cached.value;
      }
      return null;
    } catch (error) {
      console.warn('Cache get warning:', error);
      return null;
    }
  },

  async setCached(key, value) {
    try {
      const expiresAt = new Date(Date.now() + CACHE_DURATION);
      
      await Cache.findOneAndUpdate(
        { key },
        { 
          key,
          value,
          expiresAt
        },
        { 
          upsert: true, 
          new: true,
          maxTimeMS: 5000,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );
    } catch (error) {
      console.warn('Cache set warning:', error);
    }
  },

  async clearCache(key) {
    try {
      await Cache.deleteOne({ key });
    } catch (error) {
      console.warn('Cache clear warning:', error);
    }
  }
};