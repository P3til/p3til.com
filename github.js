const express = require('express');
const crypto = require('crypto');
const app = express();

const secret = '16BIXWADvuFPetHcfDp7dMs5BT7J7MjkMqbahqiKSomUIDQmukXKby9TYj9JDZ3MJ';

app.use(express.json({ verify: (req, res, buf) => {
  req.rawBody = buf;
}}));

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

  if (signature !== digest) {
    return res.status(403).send('Invalid signature.');
  }

  // Signature is valid — do something
  console.log('✅ Webhook verified');
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000/webhook');
});
