package com.example.orderapp.repository;

import com.example.orderapp.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for MongoDB operations on Orders.
 */
@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
}
