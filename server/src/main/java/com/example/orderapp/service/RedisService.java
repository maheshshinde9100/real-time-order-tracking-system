package com.example.orderapp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Service for interfacing with Redis for caching, notifications, and analytics.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    // --- Order Status Cache ---
    private static final String ORDER_STATUS_KEY_PREFIX = "order:";

    public void saveOrderStatus(String orderId, String status) {
        String key = ORDER_STATUS_KEY_PREFIX + orderId;
        log.info("Saving status to Redis cache: Key={}, Status={}", key, status);
        redisTemplate.opsForValue().set(key, status, 1, TimeUnit.HOURS); // Cache for 1 hour
    }

    public String getOrderStatus(String orderId) {
        String key = ORDER_STATUS_KEY_PREFIX + orderId;
        Object status = redisTemplate.opsForValue().get(key);
        return status != null ? status.toString() : null;
    }

    // --- Notifications ---
    private static final String USER_NOTIFICATIONS_KEY_PREFIX = "user:";
    private static final String NOTIFICATIONS_SUFFIX = ":notifications";

    public void addNotification(Long userId, String message) {
        String key = USER_NOTIFICATIONS_KEY_PREFIX + userId + NOTIFICATIONS_SUFFIX;
        log.info("Adding notification to Redis for userId {}: {}", userId, message);
        redisTemplate.opsForList().rightPush(key, message);
    }

    public List<Object> getNotifications(Long userId) {
        String key = USER_NOTIFICATIONS_KEY_PREFIX + userId + NOTIFICATIONS_SUFFIX;
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    // --- Analytics ---
    private static final String ANALYTICS_ORDERS_KEY = "analytics:orders";

    public void incrementOrderCount() {
        log.info("Incrementing analytics:orders counter in Redis");
        redisTemplate.opsForValue().increment(ANALYTICS_ORDERS_KEY);
    }

    public Long getOrderCount() {
        Object count = redisTemplate.opsForValue().get(ANALYTICS_ORDERS_KEY);
        if (count == null) {
            return 0L;
        }
        if (count instanceof Integer) {
            return ((Integer) count).longValue();
        }
        if (count instanceof Long) {
            return (Long) count;
        }
        return Long.parseLong(count.toString());
    }
}
