import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'; // Import cors
import { extractActions } from './nlpProcessor.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use cors middleware

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const transcriptSchema = new mongoose.Schema({
    text: String,
    tasks: [String],
    calendarEvents: [String],
    todoItems: [String],
    summary: String,
});

const Transcript = mongoose.model('Transcript', transcriptSchema);

app.post('/api/process', async (req, res) => {
    const { text } = req.body;
    console.log('Received request with text:', text);

    try {
        const { tasks, calendarEvents, todoItems, summary } = await extractActions(text);

        const newTranscript = new Transcript({ text, tasks, calendarEvents, todoItems, summary });
        await newTranscript.save();

        console.log('Saved transcript:', newTranscript);
        res.json({ tasks, calendarEvents, todoItems, summary });
    } catch (error) {
        console.error('Error processing text:', error);
        res.status(500).json({ error: 'Failed to process text' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});