import React, { useEffect , useState } from 'react'
import './App.css';
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [mediaLinks, setMediaLinks] = useState([]);
  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');

  useEffect(() => {
    axios.get('/links/sync').then(response => {
      setMediaLinks(response.data);    
    });
  }, []);

  useEffect(() => {
    var pusher = new Pusher('841cf3af54eb2a3f8b5b', {
      cluster: 'us2'
    });

    var channel = pusher.subscribe('links');
    channel.bind("inserted", (data) => {
      setMediaLinks([...mediaLinks, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [mediaLinks]);

  const submitLinks = async (e) => {
    e.preventDefault();

    await axios.post('/links/new', {
      name: name,
      instagram: instagram,
      facebook: facebook,
      twitter: twitter
    });

    setName("");
    setFacebook("");
    setInstagram("");
    setTwitter("");
  }

  return (
    <div className="app">
      <center>
        <h1> MediaLinks </h1> <br /> 
        {mediaLinks.map((link) => ( 
          <div>
            <h3>{link.name}</h3><br />
            <p>{link.instagram}</p><br />
            <p>{link.twitter}</p><br />
            <p>{link.facebook}</p><br />

          </div>
        ))}
        Name: <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type name" type="text" /> <br /> 
        Instagram: <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Type name" type="text" /> <br /> 
        Facebook: <input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="Type name" type="text" /> <br /> 
        Twitter: <input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="Type name" type="text" /> <br /> 
        <button onClick={submitLinks} type="submit">Upload Profile</button>
      </center>
    </div>
  );
}

export default App;
