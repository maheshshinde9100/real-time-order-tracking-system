package com.example.orderapp.service;

import com.example.orderapp.dto.CreateOrderRequest;
import com.example.orderapp.dto.OrderResponse;
import com.example.orderapp.kafka.OrderProducerService;
import com.example.orderapp.model.Order;
import com.example.orderapp.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service class for handling Order-related business logic.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderProducerService orderProducerService;
    private final RedisService redisService;

    /**
     * Creates a new order and saves it to MongoDB.
     * @param request The order creation request.
     * @return The created order response.
     */
    public OrderResponse createOrder(CreateOrderRequest request) {
        log.info("Creating order for product: {}", request.getProductName());

        Order order = Order.builder()
                .userId(request.getUserId())
                .productName(request.getProductName())
                .amount(request.getAmount())
                .status("CREATED")
                .createdAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);
        log.info("Order saved with ID: {}", savedOrder.getId());

        // Update Analytics Counter in Redis
        redisService.incrementOrderCount();
        
        // Initialize status in Redis to prevent 404 in tracker
        redisService.saveOrderStatus(savedOrder.getId(), "CREATED");

        // Publish event to Kafka
        orderProducerService.publishOrderCreatedEvent(savedOrder);

        return mapToResponse(savedOrder);
    }

    /**
     * Fetches all orders from the database.
     * @return List of order responses.
     */
    public java.util.List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .productName(order.getProductName())
                .amount(order.getAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
