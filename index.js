"use strict";

function factory(urlParam, tokenParam) {

    // base url for connection
    let url = urlParam || ''

    // token for auth
    let token = tokenParam || ''

    // socket instance
    let socket

    // stores the callback to execute socket.on(..,()=> console.log('hello'))
    let handler = {}

    let currentChannel = ''

    let interval = null;

    let status = 'disconnected' // disconnected | connecting | connected

    // let interval = setInterval(reconnect, 5000)

    function connect() {

        if(status === 'connecting' || status === 'connected') return

        status = 'connecting'

        console.log('🔵 Connecting socket...')

        socket = new WebSocket(`${url}?token=${token}`)

        socket.addEventListener('open', () => {

            console.log('🟢 Connected socket...')

            status = 'connected'

            return

        })

        socket.addEventListener('close', () => {

            socket.close()

            status = 'disconnected'

            return

        })

        socket.addEventListener('error', err => {

            console.log('❌ Socket error, closing...')

            // socket.close()

            return

        })

        socket.addEventListener('message', ev => {

            const PARSED = JSON.parse(ev.data)

            const { event, payload } = PARSED

            if(event == 'ping') return pong()

            if(!handler[event]) return

            handler[event](payload)

            return

        })

        return

    }

    function reconnect() {

        if(socket && socket.readyState == 1) return

        if (status === 'connected' || status === 'connecting') return

        connect()

    }

    interval = setInterval(reconnect, 5000)

    connect()

    // function auth() {

    //     const event = '__auth'

    //     const payload = { token: token }

    //     const STRINGIFIED = JSON.stringify({ event, payload })

    //     return socket.send(STRINGIFIED)

    // }

    function on(event, fn) {

        // event =  'CLICK'
        // fn = console.log('hello')
        handler = { ...handler, [event]: fn }

    }

    function emit(event, payload) {

        const STRINGIFIED = JSON.stringify({ event, payload, channel: currentChannel })

        currentChannel = null

        return socket.send(STRINGIFIED)

    }

    function channel(value) {

        currentChannel = value

        return { emit, join, leave, on }

    }

    function join() {

        emit('__join', { channel: currentChannel })

    }

    function leave() {

        emit('__leave', { channel: currentChannel })

        currentChannel = ''
        
    }

    // unnecessary
    function pong() {

        if(!socket || socket.readyState !== 1) return

        if(status !== 'connecting' || status !== 'connected') return

        // 0x8A = FIN + opcode pong
        const pongFrame = new Uint8Array([0x8A, 0x00]);

        socket.send(pongFrame.buffer); // ou socket.send(pongFrame) dependendo do ambiente

    }

    function close() {

        socket.close()

        clearInterval(interval)

    }

    return { url, token, on, emit, channel, join, leave, connect, close }

}

export { factory as default }
