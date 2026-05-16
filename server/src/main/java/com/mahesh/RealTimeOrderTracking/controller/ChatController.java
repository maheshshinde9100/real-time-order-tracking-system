package com.mahesh.RealTimeOrderTracking.controller;

import com.mahesh.RealTimeOrderTracking.entity.ChatMessage;
import com.mahesh.RealTimeOrderTracking.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/{orderId}")
    public ResponseEntity<ChatMessage> sendMessage(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        String sender = authentication.getName();
        return ResponseEntity.ok(chatService.sendMessage(orderId, sender, request.get("message")));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable Long orderId) {
        return ResponseEntity.ok(chatService.getChatHistory(orderId));
    }
}
