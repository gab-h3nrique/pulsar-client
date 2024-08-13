








function SOCKET(urlParam) {
    "use strict";

    // socket instance
    let socket = new WebSocket(urlParam || '')

    socket.headers = null

    // base url for connection
    let url = urlParam || ''

    // name of the event to run socket.on('NAME', ..)
    // this.handler.NAME

    // stores the callback to execute socket.on(..,()=> console.log('hello'))
    // this.handler.NAME = () => console.log('hello')

    // { 'edited-list': (item) => setEditedList(item)  }
    let handler = {}

    let currentChannel = ''

    socket.addEventListener('error', sk => {

        console.log('Some error happened: ', sk)

    })

    socket.addEventListener('open', sk => {

        console.log('Client is connected! ')

    })

    socket.addEventListener('message', (ev) => {

        const PARSED = JSON.parse(ev.data);

        const { event, payload } = PARSED;

        if(event == 'ping') return respondPing()

        if(!handler[event]) return

        handler[event](payload)

        return

    })



    function on(event, fn) {

        // event =  'CLICK'
        // fn = console.log('hello')
        handler = { ...handler, [event]: fn }

    }

    function emit(event, payload) {

        const STRINGIFIED = JSON.stringify({ event, payload, channel: this.currentChannel })

        return socket.send(STRINGIFIED)

    }

    function channel(value) {

        this.currentChannel = value

        return this

    }

    function join() {

        this.emit('join', { channel: this.currentChannel })

    }

    function leave() {

        this.emit('leave', { channel: this.currentChannel })
        
    }

    // unnecessary
    function respondPing() {

        const STRINGIFIED = JSON.stringify({ event: 'pong', payload: null })

        return socket.send(STRINGIFIED)

    }

    return { url, on, emit, channel, join, leave }

}









const socket = SOCKET('ws://localhost:3000')
// const socket = SOCKET('https://odyssey-socket.onrender.com')

socket.on('listening chat......', (data) => console.log('.....', data))

socket.on('click2', (data) => console.log('........', data))

socket.on('all', (data) => console.log('all:........', data))


function connect() {
  
    // socket.connect('ws://localhost:3000')

}

function join() {

    socket.channel('chat').join()

}

function leave() {

    socket.channel('chat').leave()

}

function send() {

    // socket.emit('all', {lastName: 'Henrique'})
    socket.channel('chat').emit('all', { message: 'hello chat!!!!'})

}