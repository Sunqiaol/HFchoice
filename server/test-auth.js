const { verifyFirebaseToken } = require('./middleware/firebaseAuth');

// Simple test to check if Firebase auth is working
const express = require('express');
const app = express();

app.use(express.json());

app.post('/test-auth', verifyFirebaseToken, (req, res) => {
  res.json({ 
    message: 'Auth successful', 
    user: { 
      uid: req.user.uid, 
      email: req.user.email 
    } 
  });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});