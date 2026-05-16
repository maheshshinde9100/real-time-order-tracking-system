package com.mahesh.RealTimeOrderTracking.service;

import com.mahesh.RealTimeOrderTracking.dto.AnalyticsResponse;
import com.mahesh.RealTimeOrderTracking.model.Order;
import com.mahesh.RealTimeOrderTracking.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;

    public AnalyticsResponse getPlatformAnalytics() {
        List<Order> allOrders = orderRepository.findAll();
        
        long total = allOrders.size();
        if (total == 0) return new AnalyticsResponse();

        long active = allOrders.stream()
                .filter(o -> !"DELIVERED".equals(o.getStatus()))
                .count();

        long delivered = allOrders.stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()))
                .count();

        double avgPrice = allOrders.stream()
                .mapToDouble(Order::getPrice)
                .average()
                .orElse(0.0);

        Map<String, Long> distribution = allOrders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));

        double successRate = (double) delivered / total * 100;

        return AnalyticsResponse.builder()
                .totalOrders(total)
                .activeOrders(active)
                .deliveredOrders(delivered)
                .averagePrice(avgPrice)
                .statusDistribution(distribution)
                .successRate(successRate)
                .build();
    }
}
