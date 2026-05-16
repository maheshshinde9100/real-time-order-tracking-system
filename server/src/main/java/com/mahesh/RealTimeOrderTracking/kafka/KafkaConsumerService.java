package com.mahesh.RealTimeOrderTracking.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "test-topic", groupId = "order-group")
    public void consume(String message) {
        System.out.println("### Kafka Message Received -> " + message);
    }
}
