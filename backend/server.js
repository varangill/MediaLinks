import express from 'express';
import mongoose from 'mongoose';
import Media from './dbMedia.js';
import Pusher from 'pusher';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1226585",
    key: "841cf3af54eb2a3f8b5b",
    secret: "96bcf30f8ff6671c1894",
    cluster: "us2",
    useTLS: true
  });

app.use(express.json());
app.use(cors());

const connection_url = 'mongodb+srv://admin:Lq2uzJwJztbT43f@cluster0.qodxx.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.once('open', () => {
    console.log('DB connected');

    const linkCollection = db.collection("medialinks");
    const changeStream = linkCollection.watch();
    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const linkDetails = change.fullDocument;
            pusher.trigger('links', 'inserted', {
                name: linkDetails.name,
                instagram: linkDetails.instagram,
                facebook: linkDetails.facebook,
                twitter: linkDetails.twitter
            });
        } else {
            console.log('Error triggering Pusher');
        }
    })
})

app.get("/", (req,res)=>res.status(200).send("hello world"))

app.get("/links/sync", (req, res) => {
    Media.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post("/links/new", (req, res) => {
    const dbMedia = req.body

    Nedia.create(dbMedia, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.listen(port, () => console.log(`Listening on localhost:${port}`))