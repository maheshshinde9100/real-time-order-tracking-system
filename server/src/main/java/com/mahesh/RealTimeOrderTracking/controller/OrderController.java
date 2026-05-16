package com.mahesh.RealTimeOrderTracking.controller;

import com.mahesh.RealTimeOrderTracking.dto.OrderRequest;
import com.mahesh.RealTimeOrderTracking.dto.OrderResponse;
import com.mahesh.RealTimeOrderTracking.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Tracking", description = "Endpoints for placing and tracking food orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private com.mahesh.RealTimeOrderTracking.repository.OrderRepository orderRepository;

    @PostMapping
    @Operation(summary = "Place a new order")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest orderRequest) {
        return ResponseEntity.ok(orderService.createOrder(orderRequest));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get current customer's orders")
    public ResponseEntity<java.util.List<OrderResponse>> getMyOrders(org.springframework.security.core.Authentication auth) {
        return ResponseEntity.ok(orderRepository.findByCustomerNameOrderByCreatedAtDesc(auth.getName()).stream()
                .map(order -> OrderResponse.builder()
                        .id(order.getId())
                        .product(order.getProduct())
                        .quantity(order.getQuantity())
                        .price(order.getPrice())
                        .customerName(order.getCustomerName())
                        .restaurantName(order.getRestaurantName())
                        .status(order.getStatus())
                        .build())
                .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping
    @Operation(summary = "Get all orders (Admin only)")
    public ResponseEntity<java.util.List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll().stream()
                .map(order -> OrderResponse.builder()
                        .id(order.getId())
                        .product(order.getProduct())
                        .quantity(order.getQuantity())
                        .price(order.getPrice())
                        .customerName(order.getCustomerName())
                        .restaurantName(order.getRestaurantName())
                        .status(order.getStatus())
                        .build())
                .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/{id}/status")
    @Operation(summary = "Get current order status")
    public ResponseEntity<String> getStatus(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderStatus(id));
    }
}
