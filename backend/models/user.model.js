import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, default: null, sparse: true },
    name: { type: String, required: true },
    username: { type: String, required: false, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, default: null },
    profilePicture: { type: String, default: "" },
    bannerImg: { type: String, default: "" },
    headline: { type: String, default: "Linkedin User" },
    location: { type: String, default: "Earth" },
    about: { type: String, default: "" },
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Add compound index for OAuth users (googleId + email)
userSchema.index({ googleId: 1, email: 1 }, { sparse: true });

// Ensure password field doesn't have unique constraint
userSchema.index({ password: 1 }, { sparse: true, unique: false });

const User = mongoose.model("User", userSchema);
export default User;
