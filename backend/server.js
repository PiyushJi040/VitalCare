import express, { json, urlencoded } from "express";
import { connect } from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import errorHandler from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.js";
import PatientRouter from "./routes/patient.routes.js";
import doctorRouter from "./routes/doctors.js";
import pharmacyRouter from "./routes/pharmacy.js";
import aiAnalysisRouter from "./routes/aiAnalysis.js";
import adminRouter from "./routes/admin.js";
import chatbotRouter from "./routes/chatbot.js";
import prescriptionRouter from "./routes/prescription.js";


const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173", "https://your-prod-domain.com"],
		credentials: true,
	},
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:3000",
	"http://localhost:3001",
	"https://your-prod-domain.com",
];

app.use(
	cors({
		origin: true,
		credentials: true,
	})
);
app.use(morgan("combined"));
app.use(json({ limit: "10mb" }));
app.use(urlencoded({ extended: true }));

// Database Connection
connect(process.env.MONGODB_URI)
	.then(() => console.log("MongoDB connected successfully"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Socket.IO for real-time communication
io.on("connection", (socket) => {
	console.log("User connected:", socket.id);

	// Join room for video calls
	socket.on("join-room", (roomId, userId) => {
		socket.join(roomId);
		socket.to(roomId).emit("user-connected", userId);

		socket.on("disconnect", () => {
			socket.to(roomId).emit("user-disconnected", userId);
		});
	});

	// Handle WebRTC signaling
	socket.on("offer", (payload) => {
		io.to(payload.target).emit("offer", payload);
	});

	socket.on("answer", (payload) => {
		io.to(payload.target).emit("answer", payload);
	});

	socket.on("ice-candidate", (payload) => {
		io.to(payload.target).emit("ice-candidate", payload.candidate);
	});

	// Chat messages
	socket.on("send-message", (data) => {
		io.to(data.room).emit("receive-message", data);
	});
});

// Routes
app.use("/api/auth", authRouter); //auth routes
app.use("/api/patients", PatientRouter); //patient routes
app.use("/api/doctors", doctorRouter); //doctor routes
app.use("/api/pharmacy", pharmacyRouter); //pharmacy routes
app.use("/api/ai", aiAnalysisRouter); // AI analysis routes
app.use("/api/admin", adminRouter); // Admin routes
app.use("/api/chatbot", chatbotRouter); // Chatbot routes
app.use("/api/prescription", prescriptionRouter); // Blockchain prescription routes

// Error handling middleware
app.use(errorHandler);

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({ status: "OK", message: "Server is running" });
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
