# Use an official Go image to build the Go application
FROM golang:1.23.1-alpine AS builder

# Set environment variables
ENV GO111MODULE=on
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download all Go dependencies
RUN go mod download

# Copy the source code to the container
COPY . .

# Build the Go application
RUN go build -o application ./app.go

# Use a smaller base image for the final container
FROM alpine:3.17

# Set the working directory in the final container
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/application .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["./application"]
