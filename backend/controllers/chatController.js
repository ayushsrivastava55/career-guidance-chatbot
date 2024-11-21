const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');
const College = require('../models/College');
const Branch = require('../models/Branch');

// Initialize Gemini AI with safety settings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generatePrompt = async (userInput) => {
  try {
    console.log('Generating prompt for input:', userInput);
    
    // Check if the query is about specific college or branch
    const colleges = await College.find({});
    const branches = await Branch.find({}).populate('college');

    let contextInfo = '';

    // Add college information if mentioned
    for (const college of colleges) {
      if (userInput.toLowerCase().includes(college.name.toLowerCase())) {
        contextInfo += `Information about ${college.name}:\n`;
        contextInfo += `Location: ${college.location}\n`;
        contextInfo += `Ranking: ${college.ranking}\n`;
        contextInfo += `Available Branches: ${college.branches.join(', ')}\n\n`;
      }
    }

    // Add branch information if mentioned
    for (const branch of branches) {
      if (userInput.toLowerCase().includes(branch.name.toLowerCase())) {
        contextInfo += `Information about ${branch.name}:\n`;
        contextInfo += `Description: ${branch.description}\n`;
        contextInfo += `Career Prospects: ${branch.careerProspects}\n`;
        contextInfo += `Required Skills: ${branch.requiredSkills.join(', ')}\n\n`;
      }
    }

    const prompt = {
      content: `You are a career guidance counselor helping students choose engineering branches and colleges.
      Use this context information if relevant:
      ${contextInfo}
      
      Student Query: ${userInput}
      
      Provide a helpful, informative response focusing on career guidance.`
    };

    console.log('Generated prompt:', prompt);
    return prompt;
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw error;
  }
};

exports.chat = async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const { message, sessionId } = req.body;

    if (!message) {
      console.error('Missing message in request');
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!sessionId) {
      console.error('Missing sessionId in request');
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Get the chat model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate the prompt with context
    const prompt = await generatePrompt(message);

    try {
      console.log('Sending prompt to Gemini:', prompt.content);
      
      // Generate content with error handling
      const result = await model.generateContent(prompt.content);
      const response = await result.response;
      const botResponse = response.text();

      console.log('Received response from Gemini:', botResponse);

      if (!botResponse) {
        throw new Error('Empty response from Gemini');
      }

      // Save chat history
      const chat = new Chat({
        sessionId,
        userInput: message,
        botResponse
      });
      await chat.save();
      console.log('Saved chat to database:', chat);

      const responseData = {
        message: botResponse,
        sessionId
      };
      console.log('Sending response to client:', responseData);
      res.json(responseData);
    } catch (error) {
      console.error('Gemini API error:', error);
      res.status(500).json({ 
        error: 'Failed to generate response',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chats = await Chat.find({ sessionId }).sort({ timestamp: 1 });
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};
