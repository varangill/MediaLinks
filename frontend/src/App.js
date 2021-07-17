import React, { useEffect , useState } from 'react'
import './App.css';
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('/messages/sync').then(response => {
      setMessages(response.data);    
    });
  }, []);

  useEffect(() => {
    var pusher = new Pusher('841cf3af54eb2a3f8b5b', {
      cluster: 'us2'
    });

    var channel = pusher.subscribe('links');
    channel.bind("inserted", (data) => {
      setMessages([...messages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);

  return (
    <div className="app">
      Hello world
    </div>
  );
}

export default App;
