package com.mahesh.RealTimeOrderTracking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {
    @NotBlank(message = "Product name is required")
    private String product;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Price is required")
    private Double price;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Restaurant name is required")
    private String restaurantName;
}
