// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow requests from your website
app.use(cors({
  origin: 'https://gzcapitaladvisors.com', // replace with your website URL
  methods: ['POST', 'GET', 'OPTIONS'],
}));

app.use(express.json());

app.post('/api/add-tag', async (req, res) => {
  const { contactId } = req.body;
  const tag = process.env.GHL_TAG_NAME;

  if (!contactId) {
    return res.status(400).json({ error: 'contactId is required' });
  }

  try {
    const url = `https://services.leadconnectorhq.com/contacts/${contactId}/tags`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ tags: [tag] })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error adding tag:', data);
      return res.status(response.status).json({ error: 'Failed to add tag', details: data });
    }

    console.log('Tag applied successfully:', data);
    res.json({ success: true, data });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GHL tagger running on port ${PORT}`);
});
