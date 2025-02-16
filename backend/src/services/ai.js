const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cleanJsonString(str) {
  try {
    str = str.replace(/```json\n?|\n?```/g, '')
      .replace(/(\w)'(\w)/g, '$1$2')
      .replace(/(\w)'s\s/g, '$1s ')
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const start = str.indexOf('{');
    const end = str.lastIndexOf('}') + 1;
    str = str.slice(start, end);

    JSON.parse(str);
    return str;
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}

const analyzePromptWithAI = async (prompt) => {
  try {
    const modCount = prompt.match(/\d+/)?.[0] || 25;
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
    });

    const enhancedPrompt = `You are a Minecraft modpack expert. Create a coherent modpack with ${modCount} mods based on: "${prompt}"

Consider:
1. Core functionality (10-15% of mods):
   - Essential libraries and APIs
   - Base mods that others depend on
   - Performance optimizations
   - Core mechanics mods

2. Main theme mods (40-50%):
   - Major content mods that work together
   - Primary mechanics that complement each other
   - Main features that define the pack

3. Integration mods (20-30%):
   - Addons that connect main mods
   - Compatibility patches
   - Extensions that enhance main mods

4. Supporting mods (10-20%):
   - Quality of life improvements
   - Interface enhancements
   - Small utilities that complement main features

For each mod category:
- Ensure mods work together and have compatible mechanics
- Consider mod dependencies and required libraries
- Avoid conflicting or redundant functionality
- Focus on stable, well-maintained mods
- Consider load order and performance impact

Return a JSON object in this format:
{
  "features": ["core gameplay features"],
  "searchTerms": ["main content mods"],
  "modTypes": ["mod categories"],
  "requiredMods": ["core/library mods"],
  "resourcePacks": ["matching resource packs"],
  "shaders": ["compatible shaders"]
}

Make sure all features and mods are tightly integrated and support each other to create a cohesive gameplay experience.
IMPORTANT: The sum of searchTerms + requiredMods should be close to ${modCount}.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    let text = response.text();
    
    let parsed;
    try {
      parsed = JSON.parse(cleanJsonString(text));
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid AI response format');
    }

    const totalMods = (parsed.searchTerms?.length || 0) + (parsed.requiredMods?.length || 0);
    const targetMods = parseInt(modCount);
    
    if (totalMods > targetMods) {
      const ratio = parsed.searchTerms.length / totalMods;
      const newSearchTermsCount = Math.floor(targetMods * ratio);
      parsed.searchTerms = parsed.searchTerms.slice(0, newSearchTermsCount);
      parsed.requiredMods = parsed.requiredMods.slice(0, targetMods - newSearchTermsCount);
    } else if (totalMods < targetMods) {
      const remaining = targetMods - totalMods;
      const genericMods = [
        "performance optimization",
        "quality of life",
        "utility",
        "interface enhancement",
        "storage management"
      ];
      
      while (parsed.searchTerms.length < targetMods - parsed.requiredMods.length) {
        parsed.searchTerms.push(genericMods[parsed.searchTerms.length % genericMods.length]);
      }
    }

    return {
      features: parsed.features || [],
      searchTerms: parsed.searchTerms || [],
      modTypes: parsed.modTypes || [],
      requiredMods: parsed.requiredMods || [],
      resourcePacks: parsed.resourcePacks || ["Faithful", "Default Dark"],
      shaders: parsed.shaders || ["BSL", "Complementary"]
    };
  } catch (error) {
    console.error('AI Analysis error:', error);
    
    const defaultCount = parseInt(prompt.match(/\d+/)?.[0] || 25);
    const defaultMods = [
      "optimization",
      "quality of life",
      "utility",
      "storage",
      "interface enhancement"
    ];

    return {
      features: ["Basic gameplay enhancements"],
      searchTerms: Array(Math.max(defaultCount - 2, 3))
        .fill(0)
        .map((_, i) => defaultMods[i % defaultMods.length]),
      modTypes: ["general"],
      requiredMods: ["fabric-api", "architectury-api"],
      resourcePacks: ["Faithful", "Default Dark"],
      shaders: ["BSL", "Complementary"]
    };
  }
};

module.exports = { analyzePromptWithAI };