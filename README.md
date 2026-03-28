# Real-Time Order Tracking System

A robust, event-driven order processing and tracking system built with Spring Boot, Apache Kafka, and Redis.

## Overview

This project demonstrates a high-performance architecture for handling order lifecycles in real-time. By leveraging asynchronous messaging and caching, the system ensures low latency and high scalability.

### Core Features

- **Event-Driven Architecture**: Uses Apache Kafka to decouple order creation from processing.
- **Real-Time Lifecycle Simulation**: Simulates a complete order journey (Created -> Processing -> Shipped -> Delivered) with automated status updates.
- **Instant Status Caching**: Utilizes Redis to provide sub-millisecond status lookups for active tracking.
- **Micro-Notification System**: Implements a Redis-backed notification store for real-time user updates.
- **Modern Dashboard**: A glassmorphic React frontend providing live analytics and an event stream.

## Technology Stack

### Backend
- **Java 17 / Spring Boot 3**: Core application framework.
- **Apache Kafka**: Distributed event streaming platform.
- **Redis**: High-performance in-memory data store for status caching and notifications.
- **MongoDB**: Persistent document storage for order history.
- **Lombok**: Boilerplate reduction for data classes.

### Frontend
- **React / Vite**: Modern component-based UI framework.
- **Tailwind CSS 4**: Utility-first styling with advanced CSS-in-JS capabilities.
- **Framer Motion**: Smooth animations and transitions for a premium user experience.
- **Lucide React**: Vector-based iconography.
- **Axios**: Promised-based HTTP client for API communication.

## System Architecture

1. **Order Creation**: The frontend sends a request to the REST API.
2. **Persistence**: The backend saves the initial order state to MongoDB.
3. **Event Generation**: An `ORDER_CREATED` event is published to a Kafka topic.
4. **Asynchronous Processing**: A consumer service listens to the Kafka topic and triggers the order status journey.
5. **Real-Time Updates**: Status changes are pushed to Redis for immediate frontend visibility and added to the notification queue.
6. **Frontend Polling**: The React dashboard polls the low-latency Redis endpoints to visualize live updates.

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Apache Kafka 3.x
- Redis 6.x or higher
- MongoDB 6.x or higher

## Setup Instructions

### Backend Setup
1. Navigate to the `server` directory.
2. Configure credentials in `src/main/resources/application.yml` if necessary.
3. Build the project: `mvn clean install`
4. Run the application: `mvn spring-boot:run`

### Frontend Setup
1. Navigate to the `client` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## API Endpoints

- `POST /orders`: Create a new order.
- `GET /orders`: Retrieve all orders.
- `GET /orders/{id}/status`: Get real-time status from Redis.
- `GET /notifications`: Fetch latest system events.
- `GET /analytics`: Get global order statistics.

## License

This project is licensed under the MIT License.
