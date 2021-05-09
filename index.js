import { sendMessageToQueue } from "./producer.js";
import { consumeMessage } from "./message-queue.js";

// Tip: To Send Object send them as string and parse while consuming

// Sending 10 messages to queue
for (let i = 1; i <= 10; i++) {
    const message = 'Hello Test Message: ' + i;
    await sendMessageToQueue(message);
}

// Consuming the sent messages
await consumeMessage();
