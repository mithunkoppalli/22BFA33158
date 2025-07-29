const { nanoid } = require('nanoid');

const urlDB = new Map();

function createShortUrl({ originalUrl, shortcode, validity }) {
  const shortId = shortcode || nanoid(6);

  if (urlDB.has(shortId)) throw new Error('Shortcode already in use');

  const createdAt = new Date();
  const expiryDate = new Date(createdAt.getTime() + (validity || 30) * 60000);

  const record = {
    originalUrl,
    shortId,
    createdAt,
    expiry: expiryDate,
    clicks: 0
  };

  urlDB.set(shortId, record);
  return record;
}

function getUrl(shortId) {
  return urlDB.get(shortId);
}

function incrementClick(shortId) {
  const record = urlDB.get(shortId);
  if (record) record.clicks += 1;
}

module.exports = {
  createShortUrl,
  getUrl,
  incrementClick
};
