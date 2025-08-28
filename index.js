// index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// CORS: allow your frontend website
app.use(cors({
  origin: 'https://gzcapitaladvisors.com', // replace with your website URL
  methods: ['POST', 'GET', 'OPTIONS'],
}));

app.use(express.json());

app.post('/api/add-tag', async (req, res) => {
  const { contactId } = req.body; // now we expect contactId instead of email
  const tag = process.env.GHL_TAG_NAME;

  if (!contactId) {
    return res.status(400).json({ error: 'contactId is required' });
  }

  if (!process.env.GHL_ACCESS_TOKEN) {
    console.error('No API token found in environment variables');
    return res.status(500).json({ error: 'Server misconfigured: missing API token' });
  }

  try {
    // Add the tag to the contact
    const tagResp = await axios.post(
      `https://services.leadconnectorhq.com/v2/contacts/${contactId}/tags`,
      { tags: [tag] },
      {
        headers: {
          Authorization: `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Tag applied successfully:', tagResp.data);
    res.json({ success: true, data: tagResp.data });

  } catch (error) {
    console.error('Error adding tag:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to add tag', details: error.response?.data });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GHL tagger running on port ${PORT}`);
});
