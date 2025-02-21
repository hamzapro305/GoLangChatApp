# Real-Time Chat Application 🚀💬

A real-time chat application built with **React** (frontend) and **Golang** (backend). This project allows users to send and receive messages instantly, making it ideal for real-time communication platforms.

## Screenshots 📸

[![chat-app](https://github.com/hamzapro305/GoLangChatApp/blob/main/assets/Thumbnail.png)](https://www.youtube.com/watch?v=skC-IBghoeU)

## Features ✨

- **Real-time messaging**: Messages are delivered instantly between users using WebSockets.
- **Multiple rooms**: Users can join different chat rooms and send messages within those rooms.
- **Responsive UI**: A modern interface built with React.
- **User authentication**: Secure login and registration flow using JWT tokens.
- **Message history**: View past messages for continuity.
  
## Tech Stack 🛠️

- **Frontend**: React, Redux (for real-time communication)
- **Backend**: Go (Golang), Fiber
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: SCSS

## Getting Started 🚀

### Prerequisites

To run the application locally, you’ll need:

- Docker & Docker Compose (for running with containers)
- Node.js (if running frontend manually)
- Go (if running backend manually)

### Running with Docker Compose

You can easily run the entire application using Docker Compose.

1. **Clone the repository**:

   ```bash
   git clone https://github.com/hamzapro305/GoLangChatApp
   cd realtime-chat-app
   ```

2. **Run the application**:

   ```bash
   docker-compose up --build
   ```

   This will start the backend, frontend, and MongoDB database in separate containers.

3. Open your browser and go to `http://localhost:5173` to start using the chat application.

### Running Manually (Without Docker)

If you prefer to run the services manually:

#### Backend Setup (Go)

- Navigate to the `backend/` directory.
- Install the Go dependencies:

  ```bash
  cd backend
  go mod tidy
  ```

- Start the Go server:

  ```bash
  go run main.go
  ```

  The backend should now be running on `http://localhost:8080`.

#### Frontend Setup (React)

- Navigate to the `frontend/` directory.
- Install the React dependencies:

  ```bash
  cd frontend
  npm install
  ```

- Start the React development server:

  ```bash
  npm start
  ```

  The frontend should now be running on `http://localhost:5173`.

### Configuration

You may want to configure the environment variables to suit your deployment needs. Create a `.env` file in both the `frontend/` and `backend/` directories and configure them as necessary:

- **Frontend (`.env`)**:
  - `VITE_BACKEND_DOMAIN=localhost:3001`
  
- **Backend (`.env`)**:
  - `PORT=3001`
  - `JWT_SECRET=your_secret_key`
  - `MONGODB_URI=your_database_connection_string`

## Usage 🤝🏼

- Open your browser and go to `http://localhost:5173`.
- Log in or sign up with your credentials.
- Join a room and start chatting with other users in real-time!


## Contributing 🤝

We welcome contributions! If you find any bugs or want to suggest new features, feel free to:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a pull request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact 📞

Feel free to reach out if you have any questions, suggestions, or feedback:

- **Author**: [Hamza Siddiqui](https://github.com/hamzapro305)
- **Email**: hamzapro285@gmail.com

---