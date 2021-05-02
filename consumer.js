import { KafkaClient } from "./index.js";
import { sendMessageToQueue } from "./producer.js";

export const consumeMessage = async () => {
  const consumer = KafkaClient.consumer({
    groupId: 'queue-group',
    // maxInFlightRequests: 1,
    // heartbeatInterval: 3000
  });

  await consumer.connect();
  await consumer.subscribe({ topic: 'queue', fromBeginning: true});

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message}) => {
      await new Promise(resolve => {
        setTimeout(resolve, 0);
      });
      console.log(topic, partition, message.value.toString());
      // Adding 1 to offset so we don't send 1 message 2 times.
      const offset = +message.offset + 1
      if (offset !== 104) {
        const response = await consumer.commitOffsets([{topic: 'queue', partition:0, offset: offset.toString()}]);
        console.log('OFFSET', ''+offset, response);
      } else {
        console.log('Sending message again');
        await sendMessageToQueue();
      }
    }
  });
};

export const consumeMessageBatch = async () => {
  const consumer = KafkaClient.consumer({
    groupId: 'queue-group',
    maxInFlightRequests: 1
  });

  await consumer.connect();
  await consumer.subscribe({ topic: 'queue', fromBeginning: true});

  await consumer.run({
    eachBatchAutoResolve: false,
    eachBatch: async ({
      batch,
      resolveOffset,
      heartbeat
    }) => {
      for (let message of batch.messages) {
        await new Promise(resolve => {
          setTimeout(resolve, 5000);
        });
        console.log(message.value.toString(), 'OFFSET', message.offset);
        // resolveOffset('75');
        await heartbeat();
      }
    }
    // eachMessage: async ({ topic, partition, message}) => {
    //   await new Promise(resolve => {
    //     setTimeout(resolve, 10000);
    //   })
    //   console.log(topic, partition, message.value.toString())
    // }
  });
};
