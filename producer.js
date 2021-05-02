import { KafkaClient } from './index.js';

export const sendMessageToQueue = async () => {
  const producer = KafkaClient.producer();

  await producer.connect();
  await producer.send({
    topic: 'queue',
    messages: [
      { value: 'Hello value'+ Math.random()}
    ]
  });

  await producer.disconnect();
}
