package config

import (
	"context"
	"fmt"
	"os"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()
var redisClient *redis.Client

func InitRedis() {

	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	fmt.Println("Connecting to Redis", redisAddr)

	redisClient = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: "", // no password set
		DB:       0,  // use default DB
		// Protocol: 3, // specify 2 for RESP 2 or 3 for RESP 3
	})

}

func PublishMessage(channel, message string) error {
	return redisClient.Publish(ctx, channel, message).Err()
}

func SubscribeMessages(channel string, handler func(string)) {
	pubsub := redisClient.Subscribe(ctx, channel)

	// Listen for messages
	ch := pubsub.Channel()
	for msg := range ch {
		handler(msg.Payload)
	}
}
