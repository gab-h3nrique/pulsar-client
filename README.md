# Pulsar-Socket
`pulsar` is a lightweight library for managing WebSocket connections, designed to simplify real-time communication between clients and servers. This library provides an intuitive interface for connecting to a WebSocket server, sending and receiving messages, and managing communication channels.

## Installation

Add the library to your JavaScript project:
```html
<script src="cdn/pulsar-socket.js"></script>
```

Or, if you're using a bundler like Webpack or Rollup, import it directly:
```javascript
import Pulsar from 'pulsar-socket';
```

# Basic Usage
## Creating an Instance
To create a new instance of Pulsar, pass the URL of the WebSocket server:

```javascript
const socket = Pulsar('ws://your-link', 'your-token');
```
## Registering Event Handlers
You can register event handlers for different types of received messages:
```javascript
socket.on('some-event', (data) => { /* your code... */ });
```

## Sending Messages
To send a message, use the emit method and specify the event and data to be sent:
```javascript
socket.emit('some-event', { message: 'hello world!' });
```
or to channel:
```javascript
socket.channel('chat').emit('new-message', { message: 'Hi there!' });
```

# Channels
You can subscribe to different communication channels:
```javascript
socket.channel('chat').join();

socket.channel('chat').leave();
```

# Available Methods
* `on(event, fn)`: Registers an event handler for the specified event.especificado.
* `emit(event, payload)`: Sends a message with the specified event and data.especificados.
* `channel(value)`: Sets the current channel for communication.
* `join()`: Joins the current channel.
* `leave()`: Leaves the current channel.

# License
Distributed under the MIT license. See LICENSE for more details.

console