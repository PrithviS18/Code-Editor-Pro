import mongoose from "mongoose";

export interface ISnippet {
    _id: mongoose.Types.ObjectId;
    slug:string;
    language: string;
    code: string;
    createdBy: string;
}

const snippetSchema = new mongoose.Schema<ISnippet> ({
    slug: {type:String, required:true},
    language: {type:String, required:true},
    code: {type:String,required: true},
    createdBy: {type:String},
})

const SnippetModel = mongoose.models.Snippet || mongoose.model<ISnippet>("Snippet",snippetSchema);
export default SnippetModel;