import mongoose, { Schema, models, Model, Document } from "mongoose";
import { IUser } from "@/core/types/index.types";

/**
 * Mongoose schema for the User model
 * Defines the structure and validation rules for user accounts in the database
 */
const UserSchema = new Schema<IUser & Document>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true, 
      maxlength: [120, 'Name cannot be longer than 120 characters']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please provide a valid email address'
      ]
    },
    passwordHash: { 
      type: String, 
      required: [true, 'Password hash is required'],
      select: false // Never return password hash in queries by default
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be longer than 500 characters'],
      trim: true
    }
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.passwordHash; // Always remove passwordHash when converting to JSON
        return ret;
      }
    }
  }
);

/**
 * Index for text search on user names and emails
 */
UserSchema.index({ 
  name: 'text',
  email: 'text'
}, {
  weights: {
    name: 2,
    email: 1
  }
});

/**
 * Virtual for user's full profile URL
 */
UserSchema.virtual('profileUrl').get(function() {
  return `/users/${this._id}`;
});

/**
 * Middleware to handle cleanup when a user is deleted
 */
UserSchema.pre('deleteOne', { document: true }, async function(next: (err?: Error) => void) {
  // This middleware will be used to clean up related documents
  // when a user is deleted (e.g., their posts, comments, etc.)
  next();
});

/**
 * Static method to find a user by email
 */
UserSchema.statics.findByEmail = async function(email: string) {
  return this.findOne({ email }).select('+passwordHash');
};

/**
 * Instance method to compare password hashes
 * @param candidatePassword - The password to compare against the stored hash
 * @returns Promise that resolves to true if the password matches, false otherwise
 */
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  // In a real implementation, this would use bcrypt.compare()
  // For example: return await bcrypt.compare(candidatePassword, this.passwordHash);
  // For now, we'll just log that this is a placeholder
  console.log('Password comparison would happen here with:', candidatePassword);
  return true;
};

/**
 * Mongoose model for the User collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const User: Model<IUser & Document> = 
  models.User || mongoose.model<IUser & Document>("User", UserSchema);