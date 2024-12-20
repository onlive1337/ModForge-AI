const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzePromptWithAI = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
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

    const enhancedPrompt = `You are a Minecraft mod pack expert. Create a modpack based on this request: "${prompt}"

For your response, provide a JSON object with the following format:
{
  "features": [
    "key features requested"
  ],
  "searchTerms": [
    "specific mod names and search terms"
  ],
  "modTypes": [
    "categories of mods needed"
  ],
  "requiredMods": [
    "essential mods for this pack"
  ],
  "resourcePacks": [
    "resource pack terms if requested"
  ],
  "shaders": [
    "shader terms if requested"
  ]
}

Only return the JSON object, no additional text.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const aiResponse = JSON.parse(text);
      return {
        features: aiResponse.features || [],
        searchTerms: aiResponse.searchTerms || [],
        modTypes: aiResponse.modTypes || [],
        requiredMods: aiResponse.requiredMods || [],
        resourcePacks: aiResponse.resourcePacks || [],
        shaders: aiResponse.shaders || []
      };
    } catch (parseError) {
      console.error('JSON Parse error:', parseError);
      console.error('Received text:', text);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    if (error.message.includes('SAFETY')) {
      console.error('Safety error:', error);
      const words = prompt.toLowerCase().split(' ');
      return {
        features: [prompt],
        searchTerms: words,
        modTypes: ['general'],
        requiredMods: [],
        resourcePacks: [],
        shaders: []
      };
    }
    console.error('AI Analysis error:', error);
    throw error;
  }
};

module.exports = { analyzePromptWithAI };