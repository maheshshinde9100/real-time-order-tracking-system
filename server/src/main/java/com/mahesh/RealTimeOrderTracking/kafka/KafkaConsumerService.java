package com.mahesh.RealTimeOrderTracking.kafka;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaConsumerService {

    @KafkaListener(topics = "order-status-topic", groupId = "order-group")
    public void consumeStatus(String message) {
        log.info(">>> [EVENT] Order Status Update Received: {}", message);
    }
}
