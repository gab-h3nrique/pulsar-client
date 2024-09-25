export function factory(urlParam, tokenParam) {
    "use strict";

    // base url for connection
    let url = urlParam || ''

    // token for auth
    let token = tokenParam || ''

    // socket instance
    let socket

    // stores the callback to execute socket.on(..,()=> console.log('hello'))
    let handler = {}

    let currentChannel = ''

    let interval = setInterval(reconnect, 5000);

    function connect() {

        try {
            
            console.log('Connecting socket...')
    
            socket = new WebSocket(url || '')

            // setTimeout(reconnect, 3000);

            return

        } catch (error) {

            return
            
        }

    }

    function reconnect() {

        if(socket && socket.readyState == 1) return

        connect()

    }

    connect()

    function auth() {

        const event = '__auth'

        const payload = { token: token }

        const STRINGIFIED = JSON.stringify({ event, payload })

        return socket.send(STRINGIFIED)

    }

    socket.addEventListener('open', sk => {

        auth()

    })

    socket.addEventListener('message', ev => {

        const PARSED = JSON.parse(ev.data);

        const { event, payload } = PARSED;

        if(event == 'ping') return respondPing()

        if(!handler[event]) return

        handler[event](payload)

        return

    })

    socket.addEventListener('error', err => {

        console.log('Some error happened')

        socket.close()

    })



    function on(event, fn) {

        // event =  'CLICK'
        // fn = console.log('hello')
        handler = { ...handler, [event]: fn }

    }

    function emit(event, payload) {

        reconnect()

        const STRINGIFIED = JSON.stringify({ event, payload, channel: this.currentChannel })

        return socket.send(STRINGIFIED)

    }

    function channel(value) {

        this.currentChannel = value

        return this

    }

    function join() {

        this.emit('__join', { channel: this.currentChannel })

    }

    function leave() {

        this.emit('__leave', { channel: this.currentChannel })
        
    }

    // unnecessary
    function respondPing() {

        this.emit('__pong', null)

    }

    function close() {

        socket.close()

        clearInterval(interval)

    }

    return { url, token, on, emit, channel, join, leave, connect, close }

}
