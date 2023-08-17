const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid URL parameter' });
  }

  const start = Date.now();
  const promises = urls.map(async (url) => {
    try {
      const response = await axios.get(url, { timeout: 500 });
      return response.data.numbers || [];
    } catch (error) {
      return [];
    }
  });

  try {
    const results = await Promise.all(promises);
    const allNumbers = results.reduce((acc, numbers) => acc.concat(numbers), []);
    const uniqueSortedNumbers = [...new Set(allNumbers)].sort((a, b) => a - b);

    const elapsed = Date.now() - start;
    if (elapsed <= 500) {
      res.json({ numbers: uniqueSortedNumbers });
    } else {
      res.status(500).json({ error: 'Response time exceeded 500 milliseconds' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
