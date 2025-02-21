import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';
import axios from 'axios';
import './App.css';

const App = () => {
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({ continuous: true });

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    const [tasks, setTasks] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [todoItems, setTodoItems] = useState([]);
    const [summary, setSummary] = useState('');

    const saveAndProcessTranscript = async () => {
      try{

        const response = await axios.post('http://localhost:5000/api/process', { text: transcript });
        console.log("Response received:", response.data); // Debugging

        const { tasks, calendarEvents, todoItems, summary } = response.data;

        setTasks(tasks);
        setCalendarEvents(calendarEvents);
        setTodoItems(todoItems);
        setSummary(summary);

        console.log("Updated state:", { tasks, calendarEvents, todoItems, summary }); // Debugging

        }catch (error) {
            console.error("Error in saveAndProcessTranscript:", error);
        }

    };

    return (
      <div className="container">
        <div className="controls"></div>
          <button onClick={SpeechRecognition.startListening} className="btn start">Start</button>
          <button onClick={SpeechRecognition.stopListening} className="btn stop">Stop</button>
          <button onClick={resetTranscript} className="btn reset">Reset</button>
          <button onClick={saveAndProcessTranscript} className="btn extract">Extract Actions</button>

        <div className="section">
          <h3>Transcription:</h3>
          <p className="transcript">{transcript}</p>
        </div>

        <div className="section">
          <h3>Actionable Tasks:</h3>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>Calendar Events:</h3>
          <ul>
            {calendarEvents.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>Todo Items:</h3>
          <ul>
            {todoItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>Meeting Summary:</h3>
          <ul>
          <li className="summary">{summary}</li>
          </ul>
        </div>
      </div>
    );
};

export default App;