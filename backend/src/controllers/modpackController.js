const { analyzePromptWithAI } = require('../services/ai');
const modrinthService = require('../services/modrinth');

exports.generateModpackFromPrompt = async (req, res) => {
  try {
    const { prompt, minecraftVersion = "1.20.1" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const analysis = await analyzePromptWithAI(prompt);
    const result = {
      prompt,
      minecraftVersion,
      analysis: {
        features: analysis.features,
        modTypes: analysis.modTypes
      },
      mods: [],
      resourcePacks: [],
      shaders: [],
      notFound: []
    };

    if (analysis.searchTerms.length > 0) {
      const modsArrays = await Promise.all(
        analysis.searchTerms.map(term => modrinthService.searchMods(term, minecraftVersion))
      );
      const uniqueMods = Array.from(
        new Map(modsArrays.flat().map(mod => [mod.project_id, mod])).values()
      ).sort((a, b) => b.downloads - a.downloads);

      if (uniqueMods.length === 0) {
        result.notFound.push('mods');
      } else {
        result.mods = uniqueMods.map(mod => ({
          name: mod.title,
          description: mod.description,
          downloads: mod.downloads,
          projectId: mod.project_id,
          slug: mod.slug,
          author: mod.author,
          type: 'mod'
        }));
      }
    }

    if (analysis.resourcePacks?.length > 0) {
      const resourceArrays = await Promise.all(
        analysis.resourcePacks.map(term => modrinthService.searchResourcePacks(term, minecraftVersion))
      );
      const uniquePacks = Array.from(
        new Map(resourceArrays.flat().map(pack => [pack.project_id, pack])).values()
      ).sort((a, b) => b.downloads - a.downloads);

      if (uniquePacks.length === 0) {
        result.notFound.push('resourcepacks');
      } else {
        result.resourcePacks = uniquePacks.map(pack => ({
          name: pack.title,
          description: pack.description,
          downloads: pack.downloads,
          projectId: pack.project_id,
          slug: pack.slug,
          author: pack.author,
          type: 'resourcepack'
        }));
      }
    }

    if (analysis.shaders?.length > 0) {
      const shaderArrays = await Promise.all(
        analysis.shaders.map(term => modrinthService.searchShaders(term, minecraftVersion))
      );
      const uniqueShaders = Array.from(
        new Map(shaderArrays.flat().map(shader => [shader.project_id, shader])).values()
      ).sort((a, b) => b.downloads - a.downloads)
      .slice(0, 3);

      if (uniqueShaders.length === 0) {
        result.notFound.push('shaders');
      } else {
        result.shaders = uniqueShaders.map(shader => ({
          name: shader.title,
          description: shader.description,
          downloads: shader.downloads,
          projectId: shader.project_id,
          slug: shader.slug,
          author: shader.author,
          type: 'shader'
        }));
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Error generating modpack:', error);
    res.status(500).json({ 
      error: 'Error generating modpack', 
      details: error.message 
    });
  }
};