import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'voice', 'video'],
        default: 'text'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    attachments: [{
        type: String, // URL or file path
        name: String,
        size: Number
    }]
}, { timestamps: true });

// Index for efficient querying
chatSchema.index({ from: 1, to: 1, createdAt: -1 });

const Chat = model("Chat", chatSchema);

export default Chat;
