import { Kafka } from 'kafkajs';
import { sendMessageToQueue } from './producer.js';
import { consumeMessage, consumeMessageBatch } from "./consumer.js";

export const KafkaClient = new Kafka({
    brokers: ['192.168.29.133:9092']
});


// await sendMessageToQueue();
await consumeMessage();
// await consumeMessageBatch();
