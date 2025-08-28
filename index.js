const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// ✅ CORS: allow your website
app.use(cors({
  origin: 'https://gzcapitaladvisors.com',  // replace with your website
  methods: ['POST', 'GET', 'OPTIONS'],
}));

app.use(express.json());

app.post('/api/add-tag', async (req, res) => {
  const { email } = req.body;
  const tag = process.env.GHL_TAG_NAME;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // 1️⃣ Ensure the contact exists in GoHighLevel
    await axios.post(
      'https://rest.gohighlevel.com/v1/contacts/',
      { email },
      {
        headers: {
          Authorization: `Bearer ${process.env.GHL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 2️⃣ Add the tag
    const response = await axios.post(
      'https://rest.gohighlevel.com/v1/contacts/tags',
      { email, tags: [tag] },
      {
        headers: {
          Authorization: `Bearer ${process.env.GHL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('GHL response:', response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error tagging contact:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to tag contact', 
      details: error.response?.data 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GHL tagger running on port ${PORT}`);
});
