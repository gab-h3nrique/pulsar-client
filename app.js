import { client } from "./core/pulsar-client";

const Pulsar = { 
    Client: client,
    Server: null
}

module.exports =  Pulsar;