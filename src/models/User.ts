import mongoose, { Schema, models, Model, Document } from "mongoose";
import { UserModel } from "@/core/types/database.types";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Mongoose schema for the User model
 * Defines the structure and validation rules for user accounts in the database
 */
const UserSchema = new Schema<UserModel & Document>(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9_]{3,30}$/,
        "Username must be 3-30 characters, alphanumeric and underscores only",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password hash is required"],
    },
    avatar: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: "Avatar must be a valid image URL",
      },
    },
    passwordReset: {
      token: { type: String, index: true },
      expiresAt: { type: Date },
      usedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for text search on user names and emails
 */
UserSchema.index({
  username: "text",
  email: "text",
});

/**
 * Instance method to compare password hashes
 * @param candidatePassword - The password to compare against the stored hash
 * @returns Promise that resolves to true if the password matches, false otherwise
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // In a real implementation, this would use bcrypt.compare()
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createPasswordResetToken = async function () {
  const rawToken = crypto.randomBytes(32).toString("hex");

  this.passwordReset = {
    token: crypto.createHash("sha256").update(rawToken).digest("hex"),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
  };

  await this.save(); // Save the document to MongoDB
  return rawToken; // send via email
};

/**
 * Mongoose model for the User collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const User: Model<UserModel & Document> =
  models.User || mongoose.model<UserModel & Document>("User", UserSchema);
