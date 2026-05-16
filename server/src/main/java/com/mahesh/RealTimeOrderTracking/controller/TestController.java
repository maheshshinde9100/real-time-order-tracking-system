package com.mahesh.RealTimeOrderTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @GetMapping("/redis/set")
    public String setRedis(@RequestParam String key, @RequestParam String value) {
        redisTemplate.opsForValue().set(key, value);
        return "Set " + key + "=" + value + " in Redis";
    }

    @GetMapping("/redis/get")
    public String getRedis(@RequestParam String key) {
        String value = redisTemplate.opsForValue().get(key);
        return "Value for " + key + " is: " + value;
    }

    @GetMapping("/kafka/send")
    public String sendKafka(@RequestParam String message) {
        kafkaTemplate.send("test-topic", message);
        return "Sent message to Kafka: " + message;
    }

    @Autowired
    private com.mahesh.RealTimeOrderTracking.repository.OrderRepository orderRepository;

    @GetMapping("/db/save")
    public String saveOrder(@RequestParam String product) {
        com.mahesh.RealTimeOrderTracking.model.Order order = com.mahesh.RealTimeOrderTracking.model.Order.builder()
                .product(product)
                .quantity(1)
                .status("PENDING")
                .build();
        orderRepository.save(order);
        return "Saved order for " + product + " to MySQL";
    }
}
