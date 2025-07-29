const express = require('express');
const { createShortUrl, getUrl, incrementClick } = require('../models/urlStore');

const router = express.Router();

// POST /shorten
router.post('/shorten', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Valid URL is required' });
  }

  try {
    const { shortId, expiry } = createShortUrl({ originalUrl: url, validity, shortcode });

    const shortLink = `${req.protocol}://${req.get('host')}/${shortId}`;

    return res.status(201).json({
      shortLink,
      expiry: expiry.toISOString()
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// GET /:id
router.get('/:id', (req, res) => {
  const record = getUrl(req.params.id);

  if (!record) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  if (new Date() > record.expiry) {
    return res.status(410).json({ error: 'Short URL expired' });
  }

  incrementClick(req.params.id);
  return res.redirect(record.originalUrl);
});

// GET /:id/stats (optional)
router.get('/:id/stats', (req, res) => {
  const record = getUrl(req.params.id);

  if (!record) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  res.json({
    originalUrl: record.originalUrl,
    shortId: record.shortId,
    totalClicks: record.clicks,
    createdAt: record.createdAt,
    expiry: record.expiry
  });
});

module.exports = router;
