import mongoose from 'mongoose';

export type RoleType = 'admin' | 'doctor' | 'nurse' | 'lab' | 'pharmacy' | 'billing' | 'reception';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin','doctor','nurse','lab','pharmacy','billing','reception'], 
    default: 'reception' 
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
