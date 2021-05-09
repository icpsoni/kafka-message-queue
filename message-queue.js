import { sendMessageToQueue } from "./producer.js";
import { KafkaClient, kafkaTopic, kafkaGroupId } from "./kafka-config.js";

export const consumeMessage = async () => {
  // Creating a Consumer Instance
  const consumer = KafkaClient.consumer({
    groupId: kafkaGroupId,
  });

  await consumer.connect();
  // Subscribing to out Kafka topic
  await consumer.subscribe({ topic: kafkaTopic, fromBeginning: true});

  await consumer.run({
    autoCommit: false, // It won't commit message acknowledge to kafka until we don't do manually
    eachMessage: async ({ topic, partition, message}) => {
      const messageData = message.value.toString();
      try {
        // Do the business Logic
        console.info('Received Message', messageData);
      } catch (error) {
        console.error(error);
        // Resending message to kafka queue for redelivery
        await sendMessageToQueue(messageData);
      } finally {
        const offset = +message.offset + 1;
        // Committing the message offset to Kafka
        await consumer.commitOffsets([{topic: kafkaTopic, partition, offset: offset.toString()}]);
      }
    }
  });
};
