import mongoose from 'mongoose';

const QuestionCategorySchema = new mongoose.Schema({
    category : {
        type : String,
        required : true,
        lowercase : true,
        unique : true
    }
}, {timestamps : true});

export const QuestionCategory = mongoose.model('Category', QuestionCategorySchema);

