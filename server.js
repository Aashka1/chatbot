const PORT = 8080;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.Google_Gen_ai_key);

app.post('/chatbot', async (req, res) => {
    try {
        console.log(req.body.history);
        console.log(req.body.message);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({ history: req.body.history }); // Uncomment this line
        const msg = req.body.message;
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        const text = response.text();
        res.send(text);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Internal Server Error"); // Send a generic error message to the client
    }
});

app.listen(PORT, () => console.log(`Working on port ${PORT}`));

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});