import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
dotenv.config();

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/my-profile", authMiddleware, getCurrentUser);

// Updated to use JWT verification instead of sessions
router.get("/google/status", authMiddleware, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
    message: "User is authenticated via JWT",
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/v1/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth profile:", profile);

        // Check if user exists by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if user exists by email (in case they signed up with email first)
          user = await User.findOne({ email: profile.emails?.[0]?.value });

          if (user) {
            // Update existing user with googleId
            user.googleId = profile.id;
            await user.save();
          } else {
            // Create new user
            const username =
              profile.displayName.toLowerCase().replace(/\s+/g, "") +
              Math.random().toString(36).substr(2, 5);

            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value || "",
              username: username,
              profilePicture: profile.photos?.[0]?.value || "",
            });
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

// Remove serializeUser and deserializeUser - not needed for stateless JWT

router.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    session: false 
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:4000/login",
    session: false
  }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generate JWT token for OAuth user
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      // Set JWT cookie
      res.cookie("jwt-linkedin", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      // Redirect to frontend with success
      res.redirect("http://localhost:4000");
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect("http://localhost:4000/login?error=oauth_failed");
    }
  }
);

export default router;
