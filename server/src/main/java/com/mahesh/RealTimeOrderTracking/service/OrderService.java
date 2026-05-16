package com.mahesh.RealTimeOrderTracking.service;

import com.mahesh.RealTimeOrderTracking.dto.OrderRequest;
import com.mahesh.RealTimeOrderTracking.dto.OrderResponse;
import com.mahesh.RealTimeOrderTracking.model.Order;
import com.mahesh.RealTimeOrderTracking.repository.OrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String ORDER_TOPIC = "order-status-topic";
    private static final String REDIS_PREFIX = "order:status:";

    public OrderResponse createOrder(OrderRequest request) {
        Order order = Order.builder()
                .product(request.getProduct())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .customerName(request.getCustomerName())
                .restaurantName(request.getRestaurantName())
                .status("PENDING")
                .build();

        Order savedOrder = orderRepository.save(order);
        log.info("Order created with ID: {}", savedOrder.getId());
        
        // Push initial status to Redis
        redisTemplate.opsForValue().set(REDIS_PREFIX + savedOrder.getId(), savedOrder.getStatus());
        
        // Send Kafka event
        kafkaTemplate.send(ORDER_TOPIC, savedOrder.getId().toString() + ":PENDING");
        
        return mapToResponse(savedOrder);
    }

    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        log.info("Order {} status updated to: {}", id, status);

        // Update Redis
        redisTemplate.opsForValue().set(REDIS_PREFIX + id, status);

        // Send Kafka event
        kafkaTemplate.send(ORDER_TOPIC, id.toString() + ":" + status);

        return mapToResponse(updatedOrder);
    }

    public String getOrderStatus(Long id) {
        // Try Redis first
        String status = redisTemplate.opsForValue().get(REDIS_PREFIX + id);
        
        if (status == null) {
            log.info("Cache miss for order {}. Fetching from DB.", id);
            status = orderRepository.findById(id)
                    .map(Order::getStatus)
                    .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
            
            redisTemplate.opsForValue().set(REDIS_PREFIX + id, status);
        } else {
            log.info("Cache hit for order {}: {}", id, status);
        }
        
        return status;
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .product(order.getProduct())
                .quantity(order.getQuantity())
                .price(order.getPrice())
                .customerName(order.getCustomerName())
                .restaurantName(order.getRestaurantName())
                .status(order.getStatus())
                .build();
    }
}
