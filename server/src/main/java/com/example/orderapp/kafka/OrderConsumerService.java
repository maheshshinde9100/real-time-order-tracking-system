package com.example.orderapp.kafka;

import com.example.orderapp.config.KafkaConfig;
import com.example.orderapp.model.Order;
import com.example.orderapp.repository.OrderRepository;
import com.example.orderapp.service.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * Service for consuming Kafka events related to Orders.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderConsumerService {

    private final OrderRepository orderRepository;
    private final RedisService redisService;

    /**
     * Consumes "order-created" events and updates the order status.
     * @param order The order data received from Kafka.
     */
    @KafkaListener(topics = KafkaConfig.ORDER_CREATED_TOPIC, groupId = "order-group")
    public void consumeOrderCreatedEvent(Order order) {
        log.info("Received order-created event for ID: {}", order.getId());
        
        // Update status to PROCESSING
        order.setStatus("PROCESSING");
        orderRepository.save(order);
        
        // Save status in Redis Cache for fast lookup
        redisService.saveOrderStatus(order.getId(), order.getStatus());

        // Notify user about order processing
        redisService.addNotification(order.getUserId(), "Your order is being processed!");

        log.info("Order status updated to PROCESSING and cached for ID: {}", order.getId());
    }
}
