// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', (req, res) => {
  const body = req.body;

  if (body.entry?.[0]?.changes?.[0]?.value?.statuses) {
    const status = body.entry[0].changes[0].value.statuses[0];

    console.log("MESSAGE STATUS UPDATE:");
    console.log("ID:", status.id);
    console.log("STATUS:", status.status);
    console.log("TIME:", status.timestamp);
  }

  if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
    console.log("INCOMING MESSAGE:");
    console.log(JSON.stringify(body, null, 2));
  }

  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
