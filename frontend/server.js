const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

// Replace with your Azure API key and endpoint
const AZURE_API_KEY = '28MTPo1ecOIdTW0hrVoKf1dF1OUfjRwnu7OYCycCUnPaTJEywrkUJQQJ99ALACYeBjFXJ3w3AAAYACOGpyfi';
const AZURE_ENDPOINT = 'https://eastus.api.cognitive.microsoft.com/';

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Handle preflight requests (OPTIONS)
app.options('*', cors());

app.post('/api/tts', async (req, res) => {
  try {
    const response = await axios.post(
      `${AZURE_ENDPOINT}/cognitiveservices/v1`,
      req.body,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        },
      }
    );
    res.set('Content-Type', 'audio/wav');
    res.send(response.data);
  } catch (error) {
    console.error('Error in Azure TTS Proxy:', error.message);
    res.status(error.response?.status || 500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Azure TTS Proxy running on http://localhost:${PORT}`);
});