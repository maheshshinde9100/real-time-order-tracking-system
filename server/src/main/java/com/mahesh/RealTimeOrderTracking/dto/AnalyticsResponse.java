package com.mahesh.RealTimeOrderTracking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private long totalOrders;
    private long activeOrders;
    private long deliveredOrders;
    private double averagePrice;
    private Map<String, Long> statusDistribution;
    private double successRate;
}
