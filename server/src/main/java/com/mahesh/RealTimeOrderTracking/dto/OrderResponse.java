package com.mahesh.RealTimeOrderTracking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private String product;
    private Integer quantity;
    private Double price;
    private String customerName;
    private String restaurantName;
    private String status;
}
