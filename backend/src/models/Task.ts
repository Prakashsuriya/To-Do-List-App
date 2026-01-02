import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    date?: Date;
    deadline?: Date;
    priority: 'low' | 'medium' | 'high';
    category?: string;
}

const TaskSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    date: { type: Date }, // Start date or created date typically
    deadline: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    category: { type: String, default: 'General' },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);
