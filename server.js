const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas (free tier)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log(err));

// Define schema and model
const messageSchema = new mongoose.Schema({
  message: String,
}, { timestamps: true });
const Message = mongoose.model('Message', messageSchema);

// API routes
app.get('/api/data', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }); // Newest first
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/save', async (req, res) => {
  try {
    const newMessage = new Message({ message: req.body.message });
    await newMessage.save();
    res.json({ status: 'Message saved!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));