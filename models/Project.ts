import mongoose from "mongoose";

export type Language = 'cpp' | 'python' | 'javascript' | 'java' | 'kotlin' | 'go';

export interface IProject {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    name: string;
    language: Language;
    code: string;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new mongoose.Schema<IProject>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    language: {type: String, enum: ['cpp', 'python', 'javascript', 'java', 'kotlin', 'go'], required: true},
    code: {type: String, default: ""},
}, {
    timestamps: true
})

const ProjectModel = mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
export default ProjectModel;