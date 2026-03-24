package com.example.orderapp.controller;

import com.example.orderapp.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller to retrieve notifications from Redis.
 */
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final RedisService redisService;

    /**
     * Retrieves the latest notifications for a specific user.
     * @param userId The ID of the user.
     * @return List of notification messages.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Object>> getNotifications(@PathVariable Long userId) {
        List<Object> notifications = redisService.getNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
}
