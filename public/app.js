const app = document.querySelector('#app');
const eventSource = new EventSource('/api/events');

const usernameInput = document.querySelector('#username-input');
const msgInput = document.querySelector('#msg-input');
const sendButton = document.querySelector('#send-button');
const msgLog = document.querySelector('#chat-log');

const appendMessageToLog = (msg) => {
    const msgElement = document.createElement('li');
    const msgText = document.createTextNode(msg);
    msgElement.appendChild(msgText);
    msgLog.appendChild(msgElement);
}

fetch('/api/messages')
    .then(response => response.json())
    .then(data => {
        data.messages.forEach(messageData => {
            appendMessageToLog(messageData.msg);
        });
    });

sendButton.onclick = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ msg: `${usernameInput.value} -> ${msgInput.value}` }),
    });
}

eventSource.onopen = () => {
    console.log('Connected to server');
};

eventSource.addEventListener('message', (event) => {
    const msgData = JSON.parse(event.data);
    appendMessageToLog(msgData.msg);
});

eventSource.addEventListener('tick', (event) => {
    console.log('tick');
});
