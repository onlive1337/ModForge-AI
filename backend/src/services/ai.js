const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractModCount(prompt) {
  const patterns = [
    /(\d+)\s*(mods?|модов|мода|модa)/i,
    /модов\s*:\s*(\d+)/i,
    /mods\s*:\s*(\d+)/i,
    /количество\s*модов\s*:\s*(\d+)/i,
    /number\s*of\s*mods\s*:\s*(\d+)/i
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match && match[1]) {
      const count = parseInt(match[1]);
      if (!isNaN(count) && count > 0) {
        return count;
      }
    }
  }

  return null;
}

const analyzePromptWithAI = async (prompt) => {
  try {
    const requestedModCount = extractModCount(prompt);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE',
        },
      ],
    });

    const enhancedPrompt = `You are a Minecraft modpack expert creating cohesive, well-balanced modpacks. 
    Analyze this request: "${prompt}"
    ${requestedModCount ? `The user requested ${requestedModCount} mods, try to stick to this number.` : ''}

    Create a modpack where mods work together to create a cohesive experience.
    Consider:
    1. Core gameplay mechanics and how mods enhance each other
    2. Balance between different mods
    3. Common mod combinations that work well together
    4. Required dependencies and core mods for the theme
    5. Potential conflicts and compatibility
    6. Performance impact

    For your response, provide a JSON object with:
    {
      "requestedModCount": ${requestedModCount || "null"},
      "theme": "Main theme/focus of the modpack",
      "features": [
        "Key gameplay features and mechanics"
      ],
      "coreMods": [
        "Essential mods that form the base of the pack (around 30% of total mods)"
      ],
      "supportMods": [
        "Mods that enhance and support the core mods"
      ],
      "utilityMods": [
        "Performance and quality of life mods"
      ],
      "searchTerms": {
        "required": ["Specific search terms for required mods"],
        "optional": ["Search terms for optional content"]
      },
      "resourcePacks": [
        "Specific resource packs that match the theme"
      ],
      "shaders": [
        "Recommended shaders that fit the style"
      ]
    }

    Only return the JSON object, no additional text.
    Focus on creating a coherent experience where mods complement each other.
    ${requestedModCount ? `Try to provide enough search terms to find approximately ${requestedModCount} mods in total.` : ''}`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const aiResponse = JSON.parse(text);
      return {
        requestedModCount: aiResponse.requestedModCount || null,
        features: aiResponse.features || [],
        searchTerms: [
          ...(aiResponse.coreMods || []),
          ...(aiResponse.supportMods || []),
          ...(aiResponse.utilityMods || [])
        ],
        modTypes: [aiResponse.theme || 'general'],
        requiredMods: aiResponse.coreMods || [],
        resourcePacks: aiResponse.resourcePacks || [],
        shaders: aiResponse.shaders || []
      };
    } catch (parseError) {
      console.error('JSON Parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw error;
  }
};

module.exports = { analyzePromptWithAI };