import { generateCopilotResponse } from '../services/aiService.js';

export const askCopilot = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a business query prompt'
      });
    }

    console.log(`[AI Controller] Invoking Gemini operations prompt: "${prompt}"`);
    const reply = await generateCopilotResponse(prompt);

    res.status(200).json({
      success: true,
      data: {
        reply
      }
    });

  } catch (error) {
    next(error);
  }
};

export default {
  askCopilot
};
