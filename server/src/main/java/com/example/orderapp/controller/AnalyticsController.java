package com.example.orderapp.controller;

import com.example.orderapp.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller to retrieve order analytics from Redis.
 */
@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final RedisService redisService;

    /**
     * Retrieves the current order count from Redis.
     * @return The count of total orders processed.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getOrderCount() {
        Long count = redisService.getOrderCount();
        return ResponseEntity.ok(count);
    }
}
