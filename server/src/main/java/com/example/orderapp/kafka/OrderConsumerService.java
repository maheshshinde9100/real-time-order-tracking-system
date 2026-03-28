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
    @KafkaListener(topics = KafkaConfig.ORDER_CREATED_TOPIC)
    public void consumeOrderCreatedEvent(Order order) {
        log.info("Received order-created event for ID: {}", order.getId());
        
        // Journey: PROCESSING -> SHIPPED -> DELIVERED
        updateAndInform(order, "PROCESSING", "Your order is being processed!");
        
        sleep(5000); // 5 seconds processing
        updateAndInform(order, "SHIPPED", "Your order has been shipped!");
        
        sleep(5000); // 5 seconds to deliver
        updateAndInform(order, "DELIVERED", "Success! Your order has been delivered.");

        log.info("Order journey completed for ID: {}", order.getId());
    }

    private void updateAndInform(Order order, String status, String message) {
        order.setStatus(status);
        orderRepository.save(order);
        redisService.saveOrderStatus(order.getId(), status);
        redisService.addNotification(order.getUserId(), message);
        log.info("Status updated: {} for Order ID: {}", status, order.getId());
    }

    private void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }
}
