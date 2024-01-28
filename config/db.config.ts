import mongoose from 'mongoose';
mongoose.set('strictQuery', true)
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
let database_url = 'mongodb+srv://nimelssa-automation-2024:nimelssa-automation-2024@nimelssa-automation-202.yamrhhz.mongodb.net/?retryWrites=true&w=majority' as string;
export const connectDB = async () => {
    try {
        await mongoose.connect(database_url);
        console.log('Connection to database was successful');
    } catch (error) {
        console.log('Connection to MongoDB Failed', error);
    }
}
