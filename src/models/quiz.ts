import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema;

const QuizSchema = new mongoose.Schema({
category :{
    type : ObjectId,
    ref : 'Category',
    required:[true, 'Question Category is required'],
},
questionType : {
  type : Number,
  default : 0,
  required : [true, 'Question type is required (0 indicates multiple choice questions while 1 indicates true or false)']
},
question: {
    type : String,
    required:[true, 'Question is required'],
},

optionA: { 
    type: String,
    required:[true, 'OptionA is required'],
},

optionB: {
     type: String,
     required:[true, 'OptionB is required'],
},

optionC: {
     type: String,
     required:[true, 'OptionC is required'],
},

optionD: {
    type: String,
    required:[true, 'OptionD is required'],
},
   
answer : {
   type : String,
   required:[true, 'Answer is required'],
},
date:{
    type: Date,
    default: new Date()
   }

});

export const Quiz = mongoose.model('Quiz', QuizSchema);