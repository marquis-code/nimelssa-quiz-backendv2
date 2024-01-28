import mongoose from 'mongoose';
let d = new Date();
let date = d.getUTCDate();
let month = d.getUTCMonth() + 1;
let year = d.getUTCFullYear();
let dateString = date + '/' + month + '/'  + year;
let CommentSchema = new mongoose.Schema ({
    username:{ 
        type: String, 
        lowercase: true,
        required:[true, 'Username is required'],
        minlength: [3, 'Username can\'t be smaller than 3 characters'],
        maxlength: [64, 'Username can\'t be greater than 64 characters' ],
        unique:true
    },
    comment:{ 
        type: String, 
        lowercase: true,
        required:[true, 'Comment is required'],
        minlength: [3, 'Comment can\'t be smaller than 3 characters'],
        maxlength: [64, 'Comment can\'t be greater than 64 characters' ],
        unique:true
    },
    matric:{
        type : Number,
        required:[true, 'Matric Number is required'],
        unique:true
    },

    level : {
      type : Number,
      required:[true, 'Academic Level is required'],
    },
    
    date:{
        type: String,
        default: dateString
    }
},{
    timestamps: true
});

export const Comment = mongoose.model('Comment',CommentSchema);