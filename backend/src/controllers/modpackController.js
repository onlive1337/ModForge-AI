const { analyzePromptWithAI } = require('../services/ai');
const modrinthService = require('../services/modrinth');
const TelegramLogger = require('../services/telegram');

const telegram = new TelegramLogger();

// Функция для расчета релевантности мода
function calculateRelevance(mod, analysis, userPrompt) {
  let score = 0;
  const modTitle = mod.title.toLowerCase();
  const modDesc = mod.description.toLowerCase();
  const promptLower = userPrompt.toLowerCase();
  
  // Точное совпадение с поисковыми терминами
  analysis.searchTerms.forEach(term => {
    const termLower = term.toLowerCase();
    if (modTitle.includes(termLower)) score += 3;
    if (modDesc.includes(termLower)) score += 1;
  });
  
  // Совпадение с исходным запросом
  const promptWords = promptLower.split(/\s+/).filter(w => w.length > 3);
  promptWords.forEach(word => {
    if (modTitle.includes(word)) score += 2;
    if (modDesc.includes(word)) score += 0.5;
  });
  
  // Совпадение с типами модов
  analysis.modTypes.forEach(type => {
    if (modTitle.includes(type) || modDesc.includes(type)) score += 1.5;
  });
  
  // Штраф за нерелевантные моды
  const irrelevantKeywords = ['optimization', 'performance', 'fps', 'library', 'api', 'core'];
  irrelevantKeywords.forEach(keyword => {
    if (!promptLower.includes(keyword) && (modTitle.includes(keyword) || modDesc.includes(keyword))) {
      score -= 2;
    }
  });
  
  // Бонус за популярность (небольшой)
  score += Math.log10(mod.downloads + 1) * 0.1;
  
  return Math.max(0, score);
}

exports.generateModpackFromPrompt = async (req, res) => {
  try {
    const { prompt, minecraftVersion = "1.20.1", modLoader = "forge" } = req.body;

    if (!prompt) {
      await telegram.logGeneration('Error', 'No prompt provided');
      await telegram.sendFinalLog();
      return res.status(400).json({ error: 'Prompt is required' });
    }

    await telegram.logGeneration('Request', `
Prompt: ${prompt}
Version: ${minecraftVersion}
Loader: ${modLoader}`);

    let analysis;
    try {
      analysis = await analyzePromptWithAI(prompt);
      await telegram.logGeneration('AI Analysis', `Found ${analysis.searchTerms.length + analysis.requiredMods.length} total mods`);
    } catch (error) {
      await telegram.logGeneration('Error', `AI Analysis failed: ${error.message}`);
      analysis = {
        features: ["Basic gameplay enhancements"],
        searchTerms: ["optimization", "utility", "storage"],
        modTypes: ["general"],
        requiredMods: ["fabric-api"],
        resourcePacks: ["Faithful"],
        shaders: ["BSL"]
      };
    }

    await telegram.logGeneration('Mod Search', 'Starting mod search...');
    const searchPromises = analysis.searchTerms.map(async term => {
      try {
        const mods = await modrinthService.searchMods(term, minecraftVersion, modLoader, 10);
        await telegram.logGeneration('Search Result', `Found ${mods.length} mods for "${term}"`);
        return mods;
      } catch (error) {
        await telegram.logGeneration('Warning', `Search failed for term "${term}": ${error.message}`);
        return [];
      }
    });

    const allMods = await Promise.all(searchPromises);
    const foundMods = allMods.flat();

    const uniqueMods = Array.from(
      new Map(foundMods.map(mod => [mod.project_id, mod])).values()
    );
    await telegram.logGeneration('Processing', `Found ${uniqueMods.length} unique mods`);

    const promptLower = prompt.toLowerCase();
    const relevantMods = uniqueMods.filter(mod => {
      const modTitle = mod.title.toLowerCase();
      const modDesc = mod.description.toLowerCase();
      
      const matchesSearch = analysis.searchTerms.some(term => 
        modTitle.includes(term.toLowerCase()) || 
        modDesc.includes(term.toLowerCase())
      );
      
      const isOptimization = modTitle.includes('optim') || modTitle.includes('performance') || 
                           modTitle.includes('fps') || modDesc.includes('performance');
      const isLibrary = modTitle.includes('api') || modTitle.includes('library') || 
                       modTitle.includes('core') || modDesc.includes('library');
      
      if (!promptLower.includes('оптимиз') && !promptLower.includes('optim') && 
          !promptLower.includes('произв') && !promptLower.includes('performance') && 
          !promptLower.includes('фпс') && !promptLower.includes('fps') && 
          (isOptimization || isLibrary)) {
        return false;
      }
      
      return matchesSearch;
    });

    await telegram.logGeneration('Dependencies', 'Checking mod dependencies...');
    const modsWithDependencies = await Promise.all(
      relevantMods.map(async (mod) => {
        try {
          const versionInfo = await modrinthService.getVersionInfo(mod.project_id, minecraftVersion, modLoader);
          
          if (!versionInfo) {
            await telegram.logGeneration('Warning', `No version info found for mod: ${mod.title}`);
            return null;
          }

          const dependencies = await modrinthService.getModDependencies(mod.project_id);
          
          const relevanceScore = calculateRelevance(mod, analysis, prompt);
          
          return {
            name: mod.title,
            description: mod.description,
            downloads: mod.downloads,
            projectId: mod.project_id,
            slug: mod.slug,
            author: mod.author,
            type: 'mod',
            version: versionInfo?.version_number,
            relevanceScore,
            dependencies: dependencies.map(dep => ({
              name: dep.project_name || dep.dependency_id,
              slug: dep.project_id,
              required: dep.dependency_type === 'required'
            }))
          };
        } catch (error) {
          await telegram.logGeneration('Warning', `Error processing mod ${mod.title}: ${error.message}`);
          return null;
        }
      })
    );

    const validMods = modsWithDependencies
      .filter(mod => mod !== null)
      .sort((a, b) => {
        if (Math.abs(a.relevanceScore - b.relevanceScore) > 0.1) {
          return b.relevanceScore - a.relevanceScore;
        }
        return b.downloads - a.downloads;
      })
      .map(({ relevanceScore, ...mod }) => mod);

    await telegram.logGeneration('Mods', `Successfully processed ${validMods.length} mods`);

    let resourcePacks = [];
    if (analysis.resourcePacks?.length > 0) {
      await telegram.logGeneration('Resource Packs', 'Searching for resource packs...');
      const resourcePackPromises = analysis.resourcePacks.map(term => 
        modrinthService.searchResourcePacks(term, minecraftVersion)
      );

      const resourcePackResults = await Promise.all(resourcePackPromises);
      resourcePacks = Array.from(
        new Map(
          resourcePackResults
            .flat()
            .map(pack => [
              pack.project_id,
              {
                name: pack.title,
                description: pack.description,
                downloads: pack.downloads,
                projectId: pack.project_id,
                slug: pack.slug,
                author: pack.author,
                type: 'resourcepack'
              }
            ])
        ).values()
      ).sort((a, b) => b.downloads - a.downloads)
       .slice(0, 5);
      
      await telegram.logGeneration('Resource Packs', `Found ${resourcePacks.length} resource packs`);
    }

    let shaders = [];
    if (analysis.shaders?.length > 0) {
      await telegram.logGeneration('Shaders', 'Searching for shaders...');
      const shaderPromises = analysis.shaders.map(term => 
        modrinthService.searchShaders(term, minecraftVersion)
      );

      const shaderResults = await Promise.all(shaderPromises);
      shaders = Array.from(
        new Map(
          shaderResults
            .flat()
            .map(shader => [
              shader.project_id,
              {
                name: shader.title,
                description: shader.description,
                downloads: shader.downloads,
                projectId: shader.project_id,
                slug: shader.slug,
                author: shader.author,
                type: 'shader'
              }
            ])
        ).values()
      ).sort((a, b) => b.downloads - a.downloads)
       .slice(0, 3);
      
      await telegram.logGeneration('Shaders', `Found ${shaders.length} shaders`);
    }

    const notFound = [];
    if (validMods.length === 0) notFound.push('mods');
    if (analysis.resourcePacks?.length > 0 && resourcePacks.length === 0) notFound.push('resourcepacks');
    if (analysis.shaders?.length > 0 && shaders.length === 0) notFound.push('shaders');

    const result = {
      prompt,
      minecraftVersion,
      modLoader,
      analysis: {
        features: analysis.features,
        theme: analysis.modTypes[0]
      },
      mods: validMods,
      resourcePacks,
      shaders,
      notFound
    };

    await telegram.logGeneration('Result', `
✅ Generation completed
Mods: ${validMods.length}
Resource Packs: ${resourcePacks.length}
Shaders: ${shaders.length}
${notFound.length > 0 ? `\nNot found: ${notFound.join(', ')}` : ''}`);

    await telegram.sendFinalLog();
    res.json(result);

  } catch (error) {
    await telegram.sendError(error);
    res.status(500).json({ 
      error: 'Error generating modpack', 
      message: error.message 
    });
  }
};