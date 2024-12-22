const { analyzePromptWithAI } = require('../services/ai');
const modrinthService = require('../services/modrinth');

exports.generateModpackFromPrompt = async (req, res) => {
  try {
    const { prompt, minecraftVersion = "1.20.1", modLoader = "forge" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const analysis = await analyzePromptWithAI(prompt);
    const requestedModCount = analysis.requestedModCount;

    const fetchMods = async (terms, limit) => {
      const modsArrays = await Promise.all(
        terms.map(term => modrinthService.searchMods(term, minecraftVersion, modLoader, limit))
      );
      
      const uniqueMods = Array.from(
        new Map(modsArrays.flat().map(mod => [mod.project_id, mod])).values()
      );

      return uniqueMods;
    };


    let modsLimit = 25;
    if (requestedModCount) {
      modsLimit = Math.ceil(requestedModCount / analysis.searchTerms.length);
    }

    const allMods = await fetchMods(analysis.searchTerms, modsLimit);

    let finalMods = allMods;
    if (requestedModCount) {
      finalMods = allMods.slice(0, requestedModCount);
    }

    const modsWithDependencies = await Promise.all(
      finalMods.map(async (mod) => {
        try {
          const versionInfo = await modrinthService.getVersionInfo(mod.project_id, minecraftVersion, modLoader);
          const dependencies = await modrinthService.getModDependencies(mod.project_id);
          
          return {
            name: mod.title,
            description: mod.description,
            downloads: mod.downloads,
            projectId: mod.project_id,
            slug: mod.slug,
            author: mod.author,
            type: 'mod',
            version: versionInfo?.version_number,
            dependencies: dependencies.map(dep => ({
              name: dep.project_name || dep.dependency_id,
              slug: dep.project_id,
              required: dep.dependency_type === 'required'
            }))
          };
        } catch (error) {
          console.error(`Error processing mod ${mod.title}:`, error);
          return null;
        }
      })
    );

    const result = {
      prompt,
      minecraftVersion,
      modLoader,
      requestedModCount,
      analysis: {
        features: analysis.features,
        theme: analysis.modTypes[0]
      },
      mods: modsWithDependencies.filter(Boolean).sort((a, b) => b.downloads - a.downloads),
      resourcePacks: [],
      shaders: [],
      notFound: []
    };

    if (analysis.resourcePacks?.length > 0) {
      const packs = await Promise.all(
        analysis.resourcePacks.map(term => 
          modrinthService.searchResourcePacks(term, minecraftVersion)
        )
      );
      result.resourcePacks = packs.flat()
        .map(pack => ({
          name: pack.title,
          description: pack.description,
          downloads: pack.downloads,
          projectId: pack.project_id,
          slug: pack.slug,
          author: pack.author,
          type: 'resourcepack'
        }))
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 5);
    }

    if (analysis.shaders?.length > 0) {
      const shaders = await Promise.all(
        analysis.shaders.map(term => 
          modrinthService.searchShaders(term, minecraftVersion)
        )
      );
      result.shaders = shaders.flat()
        .map(shader => ({
          name: shader.title,
          description: shader.description,
          downloads: shader.downloads,
          projectId: shader.project_id,
          slug: shader.slug,
          author: shader.author,
          type: 'shader'
        }))
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 3);
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