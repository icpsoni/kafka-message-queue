import { Kafka } from 'kafkajs';

const KafkaClient = new Kafka({
    brokers: ['192.168.29.133:9092']
});

const producer = KafkaClient.producer();

await producer.connect();

await producer.send({
    topic: 'queue',
    messages: [
        { value: 'Hello value'}
    ]
});

await producer.disconnect();

const consumer = KafkaClient.consumer({ groupId: 'queue-group'});

await consumer.connect();
await consumer.subscribe({ topic: 'queue', fromBeginning: true});

await consumer.run({
    eachMessage: async ({ topic, partition, message}) => {
        console.log(topic, partition, message.value.toString());
    }
})
