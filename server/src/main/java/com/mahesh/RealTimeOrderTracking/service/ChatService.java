package com.mahesh.RealTimeOrderTracking.service;

import com.mahesh.RealTimeOrderTracking.entity.ChatMessage;
import com.mahesh.RealTimeOrderTracking.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    private static final String CHAT_TOPIC = "chat-topic";

    public ChatMessage sendMessage(Long orderId, String sender, String message) {
        ChatMessage chatMessage = ChatMessage.builder()
                .orderId(orderId)
                .sender(sender)
                .message(message)
                .build();
        
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
        log.info("Chat message saved for order {}: from {}", orderId, sender);

        // Produce to Kafka: orderId:sender:message
        String kafkaPayload = orderId + ":" + sender + ":" + message;
        kafkaTemplate.send(CHAT_TOPIC, kafkaPayload);

        return savedMessage;
    }

    public List<ChatMessage> getChatHistory(Long orderId) {
        return chatMessageRepository.findByOrderIdOrderByTimestampAsc(orderId);
    }
}
