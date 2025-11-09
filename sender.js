#!/usr/bin/env node

const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        const queue = "email_notifications_lost_messages";

        channel.assertQueue(queue, {
            durable: false,
            autoDelete: true,
        });

        setInterval(() => {
            const msg = getMessage();
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(`[Producer][Sent] => ${msg.messageId} send to queue: ${queue}`);
        }, 500);
    });
});
let inc = 0;
function getMessage() {
    return {
        messageId: inc++,
        payload: "Some message payload",
        timestamp: new Date().toISOString(),
    };
}

// {
//     messageId: Number,
//     payload: String,
//     dateTime: String
// }
