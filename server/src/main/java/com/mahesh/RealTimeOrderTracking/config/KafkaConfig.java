package com.mahesh.RealTimeOrderTracking.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic orderStatusTopic() {
        return TopicBuilder.name("order-status-topic")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic chatTopic() {
        return TopicBuilder.name("chat-topic")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
