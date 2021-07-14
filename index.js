const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const messages = [];
const eventStreams = [];

app.get('/api/events', (req, res) => {
    req.socket.setKeepAlive(true);
    req.socket.setNoDelay(true);
    req.socket.setTimeout(0);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');

    res.write('event: tick\ndata: tick\n\n');

    const id = eventStreams.push(res) - 1;

    req.on('close', () => {
        eventStreams.splice(id);
    });
});

app.get('/api/messages', (req, res) => {
    res.send({messages: messages});
});

app.post('/api/messages', (req, res) => {
    messages.push(req.body);
    eventStreams.forEach(stream => {
        const msg = `id: ${messages.length}\nevent:message\ndata: ${JSON.stringify(req.body)}\n\n`;
        console.log(msg);
        stream.write(msg);
    });
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
