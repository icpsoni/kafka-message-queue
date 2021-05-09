import { KafkaClient, kafkaTopic } from "./kafka-config.js";

export const sendMessageToQueue = async (message) => {
  const producer = KafkaClient.producer();
  await producer.connect();
  console.info('Sending Message: ', message);
  await producer.send({
    topic: kafkaTopic,
    messages: [
      {
        value: message // Your message data goes here
      }
    ]
  });
  // Disconnect producer once message sending is done.
  await producer.disconnect();
};
