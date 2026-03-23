package com.example.orderapp.kafka;

import com.example.orderapp.config.KafkaConfig;
import com.example.orderapp.model.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Service for producing Kafka events related to Orders.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderProducerService {

    private final KafkaTemplate<String, Order> kafkaTemplate;

    /**
     * Publishes an "order-created" event to Kafka.
     * @param order The order data to publish.
     */
    public void publishOrderCreatedEvent(Order order) {
        log.info("Publishing order-created event for ID: {}", order.getId());
        kafkaTemplate.send(KafkaConfig.ORDER_CREATED_TOPIC, order.getId(), order);
    }
}
