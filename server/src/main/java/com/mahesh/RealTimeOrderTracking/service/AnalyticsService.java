package com.mahesh.RealTimeOrderTracking.service;

import com.mahesh.RealTimeOrderTracking.dto.AnalyticsResponse;
import com.mahesh.RealTimeOrderTracking.model.Order;
import com.mahesh.RealTimeOrderTracking.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final OrderRepository orderRepository;

    public AnalyticsResponse getPlatformAnalytics() {
        List<Order> allOrders = orderRepository.findAll();
        log.info("Calculating analytics for {} orders", allOrders.size());
        
        long total = allOrders.size();
        if (total == 0) {
            return AnalyticsResponse.builder()
                    .totalOrders(0)
                    .activeOrders(0)
                    .deliveredOrders(0)
                    .averagePrice(0.0)
                    .statusDistribution(Collections.emptyMap())
                    .successRate(0.0)
                    .build();
        }

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

        double successRate = (double) delivered / total * 100.0;

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
