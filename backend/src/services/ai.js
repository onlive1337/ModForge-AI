const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MOD_KNOWLEDGE_BASE = {
  tech: {
    keywords: ['техника', 'технологии', 'индустрия', 'машины', 'автоматизация', 'tech', 'technology', 'industrial', 'machines', 'automation'],
    coreMods: ['mekanism', 'industrialcraft', 'thermal expansion', 'applied energistics', 'refined storage'],
    supportMods: ['cofh core', 'thermal foundation', 'ae2 stuff', 'extra utilities'],
    features: ['энергия', 'механизмы', 'трубы', 'провода', 'автокрафт']
  },
  
  magic: {
    keywords: ['магия', 'волшебство', 'заклинания', 'колдовство', 'magic', 'spells', 'wizardry', 'sorcery'],
    coreMods: ['botania', 'thaumcraft', 'blood magic', 'astral sorcery', 'ars nouveau'],
    supportMods: ['baubles', 'curios', 'patchouli', 'waystones'],
    features: ['мана', 'ритуалы', 'заклинания', 'артефакты', 'алтари']
  },
  
  rpg: {
    keywords: ['рпг', 'приключения', 'квесты', 'прокачка', 'rpg', 'adventure', 'quests', 'leveling'],
    coreMods: ['epic fight', 'iron\'s spells', 'dungeons and dragons', 'mine and slash'],
    supportMods: ['better combat', 'player revive', 'rpg stats', 'scaling health'],
    features: ['уровни', 'навыки', 'классы', 'подземелья', 'боссы']
  },
  
  building: {
    keywords: ['строительство', 'декор', 'блоки', 'дизайн', 'building', 'decoration', 'blocks', 'design'],
    coreMods: ['chisel', 'builders crafts', 'macaw\'s', 'decorative blocks', 'architectury'],
    supportMods: ['connected textures', 'blockcraftery', 'framed blocks'],
    features: ['блоки', 'мебель', 'декорации', 'текстуры']
  },
  
  exploration: {
    keywords: ['исследование', 'биомы', 'измерения', 'путешествия', 'exploration', 'biomes', 'dimensions', 'travel'],
    coreMods: ['biomes o plenty', 'twilight forest', 'the aether', 'blue skies', 'dimensional doors'],
    supportMods: ['natures compass', 'explorers compass', 'journey map'],
    features: ['биомы', 'порталы', 'миры', 'структуры']
  },
  
  survival: {
    keywords: ['выживание', 'хардкор', 'реализм', 'сложность', 'survival', 'hardcore', 'realism', 'difficulty'],
    coreMods: ['tough as nails', 'serene seasons', 'cold sweat', 'spice of life'],
    supportMods: ['campfire', 'sleeping bags', 'first aid'],
    features: ['температура', 'жажда', 'сезоны', 'травмы']
  },
  
  optimization: {
    keywords: ['оптимизация', 'производительность', 'фпс', 'лаги', 'optimization', 'performance', 'fps', 'lag'],
    coreMods: ['sodium', 'optifine', 'rubidium', 'embeddium', 'modernfix'],
    supportMods: ['ferritecore', 'starlight', 'entityculling', 'betterfps'],
    features: ['фпс', 'память', 'чанки', 'рендер']
  }
};

function analyzeUserIntent(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  const detectedCategories = [];
  const specificMods = [];
  const excludedFeatures = [];
  
  const modPattern = /(?:мод[ы]?|mod[s]?)\s*(?:типа|вроде|как|like|such as)?\s*([a-zA-Zа-яА-Я\s\'\-]+?)(?:[,.]|\s(?:и|and)|$)/gi;
  let match;
  while ((match = modPattern.exec(lowerPrompt)) !== null) {
    specificMods.push(match[1].trim());
  }
  
  for (const [category, data] of Object.entries(MOD_KNOWLEDGE_BASE)) {
    for (const keyword of data.keywords) {
      if (lowerPrompt.includes(keyword)) {
        detectedCategories.push(category);
        break;
      }
    }
  }
  
  const excludePattern = /(?:без|кроме|не нужн[оы]|не надо|without|except|no)\s+([a-zA-Zа-яА-Я\s]+?)(?:[,.]|$)/gi;
  while ((match = excludePattern.exec(lowerPrompt)) !== null) {
    excludedFeatures.push(match[1].trim());
  }
  
  const countMatch = lowerPrompt.match(/(\d+)\s*(?:мод|mod)/i);
  const targetCount = countMatch ? parseInt(countMatch[1]) : null;
  
  return {
    categories: detectedCategories,
    specificMods,
    excludedFeatures,
    targetCount,
    originalPrompt: prompt
  };
}

function createPrecisePrompt(userAnalysis) {
  const { categories, specificMods, excludedFeatures, targetCount, originalPrompt } = userAnalysis;
  
  let prompt = `You are a Minecraft modpack expert. Your task is to suggest mods that EXACTLY match the user's request.

User's request: "${originalPrompt}"

CRITICAL RULES:
1. ONLY suggest mods that directly relate to the user's request
2. Do NOT add mods for "balance" or "completeness" unless specifically asked
3. If user asks for specific mods, those MUST be included
4. If user specifies a number, suggest EXACTLY that many mods
5. NEVER add optimization mods unless specifically requested
6. NEVER add library/API mods unless they are required dependencies

Analysis:
- Detected categories: ${categories.join(', ') || 'none'}
- Specific mods requested: ${specificMods.join(', ') || 'none'}
- Features to exclude: ${excludedFeatures.join(', ') || 'none'}
- Target mod count: ${targetCount || 'not specified'}

Based on this analysis, suggest mods that:
1. Directly implement the requested features
2. Are popular and well-maintained
3. Are compatible with each other
4. Match the user's language (suggest Russian names for Russian requests)

For each category detected, prioritize:
${categories.map(cat => `- ${cat}: ${MOD_KNOWLEDGE_BASE[cat].coreMods.slice(0, 3).join(', ')}`).join('\n')}

Return a JSON object with this EXACT structure:
{
  "mods": ["mod name 1", "mod name 2", ...],
  "reasoning": "Brief explanation of why these specific mods were chosen",
  "dependencies": ["required library 1", "required library 2", ...],
  "optionalEnhancements": ["optional mod 1", "optional mod 2", ...],
  "resourcePacks": ["pack 1", "pack 2"] (only if visual enhancement is requested),
  "shaders": ["shader 1", "shader 2"] (only if graphics improvement is requested)
}

Remember: Quality over quantity. Only suggest what the user actually asked for.`;

  return prompt;
}

const analyzePromptWithAI = async (prompt) => {
  try {
    const userAnalysis = analyzeUserIntent(prompt);
    console.log('User intent analysis:', userAnalysis);
    
    const aiPrompt = createPrecisePrompt(userAnalysis);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-preview-05-20",
      generationConfig: {
        temperature: 0.3,
        topK: 10,
        topP: 0.8,
      }
    });

    const result = await model.generateContent(aiPrompt);
    const response = result.response;
    let text = response.text();
    
    let parsed;
    try {
      text = text.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid AI response format');
    }
    
    const validatedResult = validateAndCorrectResult(parsed, userAnalysis);
    
    return {
      features: [validatedResult.reasoning],
      searchTerms: validatedResult.mods || [],
      modTypes: userAnalysis.categories,
      requiredMods: validatedResult.dependencies || [],
      resourcePacks: validatedResult.resourcePacks || [],
      shaders: validatedResult.shaders || []
    };
    
  } catch (error) {
    console.error('AI Analysis error:', error);
    
    const userAnalysis = analyzeUserIntent(prompt);
    const fallbackMods = [];
    
    if (userAnalysis.specificMods.length > 0) {
      fallbackMods.push(...userAnalysis.specificMods);
    }
    
    for (const category of userAnalysis.categories) {
      const categoryData = MOD_KNOWLEDGE_BASE[category];
      if (categoryData) {
        fallbackMods.push(...categoryData.coreMods.slice(0, 3));
      }
    }
    
    const finalMods = userAnalysis.targetCount 
      ? fallbackMods.slice(0, userAnalysis.targetCount)
      : fallbackMods;
    
    return {
      features: [`Подбор модов по запросу: ${prompt}`],
      searchTerms: finalMods.length > 0 ? finalMods : ['optimization'],
      modTypes: userAnalysis.categories.length > 0 ? userAnalysis.categories : ['general'],
      requiredMods: [],
      resourcePacks: [],
      shaders: []
    };
  }
};

function validateAndCorrectResult(aiResult, userAnalysis) {
  const validated = { ...aiResult };
  
  if (userAnalysis.specificMods.length > 0) {
    for (const requestedMod of userAnalysis.specificMods) {
      const found = validated.mods.some(mod => 
        mod.toLowerCase().includes(requestedMod.toLowerCase())
      );
      if (!found) {
        validated.mods.unshift(requestedMod);
      }
    }
  }
  
  if (userAnalysis.excludedFeatures.length > 0) {
    validated.mods = validated.mods.filter(mod => {
      const modLower = mod.toLowerCase();
      return !userAnalysis.excludedFeatures.some(excluded => 
        modLower.includes(excluded.toLowerCase())
      );
    });
  }
  
  if (userAnalysis.targetCount && validated.mods.length !== userAnalysis.targetCount) {
    if (validated.mods.length > userAnalysis.targetCount) {
      const specificMods = validated.mods.filter(mod => 
        userAnalysis.specificMods.some(specific => 
          mod.toLowerCase().includes(specific.toLowerCase())
        )
      );
      const otherMods = validated.mods.filter(mod => 
        !userAnalysis.specificMods.some(specific => 
          mod.toLowerCase().includes(specific.toLowerCase())
        )
      );
      validated.mods = [
        ...specificMods,
        ...otherMods.slice(0, userAnalysis.targetCount - specificMods.length)
      ];
    }
  }
  
  const promptLower = userAnalysis.originalPrompt.toLowerCase();
  if (!promptLower.includes('ресурс') && !promptLower.includes('resource') && 
      !promptLower.includes('текстур') && !promptLower.includes('texture')) {
    validated.resourcePacks = [];
  }
  
  if (!promptLower.includes('шейдер') && !promptLower.includes('shader') && 
      !promptLower.includes('график') && !promptLower.includes('graphic')) {
    validated.shaders = [];
  }
  
  return validated;
}

module.exports = { analyzePromptWithAI };