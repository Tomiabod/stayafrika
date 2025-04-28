import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  insertUserSchema,
  insertPropertySchema,
  insertBookingSchema,
  insertReviewSchema,
  insertMessageSchema,
  insertWaitlistSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "stayafrika-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        maxAge: 86400000 // 24 hours
      },
      store: new SessionStore({ checkPeriod: 86400000 }) // 24 hours
    })
  );
  
  // Setup file upload
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  });
  
  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  
  // Middleware to check if user is a host
  const isHost = async (req: Request, res: Response, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user || (user.role !== 'host' && user.role !== 'admin')) {
      return res.status(403).json({ message: "Forbidden: Requires host privileges" });
    }
    
    next();
  };
  
  // Middleware to check if user is an admin
  const isAdmin = async (req: Request, res: Response, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Requires admin privileges" });
    }
    
    next();
  };
  
  // AUTHENTICATION ROUTES
  
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      
      // Create user
      const user = await storage.createUser({
        ...data,
        password: hashedPassword
      });
      
      // Set session
      req.session.userId = user.id;
      
      // Return user data (excluding password)
      const { password, ...userData } = user;
      res.status(201).json(userData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Return user data (excluding password)
      const { password: _, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // Get current user
  app.get("/api/auth/me", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // PROPERTY ROUTES
  
  // Create property
  app.post("/api/properties", isHost, upload.array("images", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const images = files.map(file => `/uploads/${file.filename}`);
      
      const propertyData = {
        ...req.body,
        hostId: req.session.userId!,
        amenities: JSON.parse(req.body.amenities || '[]'),
        images: images.length > 0 ? images : JSON.parse(req.body.images || '[]'),
        pricePerNight: parseInt(req.body.pricePerNight),
        cleaningFee: parseInt(req.body.cleaningFee || '0'),
        maxGuests: parseInt(req.body.maxGuests),
        bedrooms: parseInt(req.body.bedrooms),
        beds: parseInt(req.body.beds),
        bathrooms: parseInt(req.body.bathrooms),
      };
      
      const data = insertPropertySchema.parse(propertyData);
      const property = await storage.createProperty(data);
      
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const {
        city,
        neighborhood,
        propertyType,
        minPrice,
        maxPrice,
        guests,
        bedrooms
      } = req.query;
      
      let properties = await storage.getProperties();
      
      // Apply filters
      if (city) {
        properties = properties.filter(p => p.city.toLowerCase() === (city as string).toLowerCase());
      }
      
      if (neighborhood) {
        properties = properties.filter(p => p.neighborhood.toLowerCase() === (neighborhood as string).toLowerCase());
      }
      
      if (propertyType) {
        properties = properties.filter(p => p.propertyType === propertyType);
      }
      
      if (minPrice) {
        properties = properties.filter(p => p.pricePerNight >= parseInt(minPrice as string));
      }
      
      if (maxPrice) {
        properties = properties.filter(p => p.pricePerNight <= parseInt(maxPrice as string));
      }
      
      if (guests) {
        properties = properties.filter(p => p.maxGuests >= parseInt(guests as string));
      }
      
      if (bedrooms) {
        properties = properties.filter(p => p.bedrooms >= parseInt(bedrooms as string));
      }
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get property by ID
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(parseInt(req.params.id));
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Get host info
      const host = await storage.getUser(property.hostId);
      
      // Get reviews for property
      const reviews = await storage.getReviewsByProperty(property.id);
      
      // Calculate average rating
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
      
      // Return property with host info and reviews
      res.json({
        ...property,
        host: host ? {
          id: host.id,
          firstName: host.firstName,
          lastName: host.lastName,
          profilePicture: host.profilePicture
        } : null,
        reviews,
        avgRating
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Update property
  app.put("/api/properties/:id", isHost, upload.array("images", 10), async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Check if user is the owner
      if (property.hostId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to update this property" });
      }
      
      const files = req.files as Express.Multer.File[];
      const newImages = files.map(file => `/uploads/${file.filename}`);
      
      const propertyData = {
        ...req.body,
        amenities: req.body.amenities ? JSON.parse(req.body.amenities) : property.amenities,
        images: newImages.length > 0 
          ? [...(req.body.keepImages ? JSON.parse(req.body.keepImages) : []), ...newImages] 
          : property.images,
        pricePerNight: req.body.pricePerNight ? parseInt(req.body.pricePerNight) : property.pricePerNight,
        cleaningFee: req.body.cleaningFee ? parseInt(req.body.cleaningFee) : property.cleaningFee,
        maxGuests: req.body.maxGuests ? parseInt(req.body.maxGuests) : property.maxGuests,
        bedrooms: req.body.bedrooms ? parseInt(req.body.bedrooms) : property.bedrooms,
        beds: req.body.beds ? parseInt(req.body.beds) : property.beds,
        bathrooms: req.body.bathrooms ? parseInt(req.body.bathrooms) : property.bathrooms,
      };
      
      const updatedProperty = await storage.updateProperty(propertyId, propertyData);
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Approve property (admin only)
  app.put("/api/properties/:id/approve", isAdmin, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.approveProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get host properties
  app.get("/api/host/properties", isHost, async (req, res) => {
    try {
      const properties = await storage.getPropertyByHost(req.session.userId!);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // BOOKING ROUTES
  
  // Create booking
  app.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const data = insertBookingSchema.parse({
        ...req.body,
        guestId: req.session.userId
      });
      
      // Verify property exists
      const property = await storage.getProperty(data.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Check if property is available for requested dates
      const existingBookings = await storage.getBookingsByProperty(property.id);
      const checkInDate = new Date(data.checkInDate);
      const checkOutDate = new Date(data.checkOutDate);
      
      const isOverlapping = existingBookings.some(booking => {
        if (booking.status === 'canceled') return false;
        
        const bookingCheckIn = new Date(booking.checkInDate);
        const bookingCheckOut = new Date(booking.checkOutDate);
        
        return (
          (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
          (checkOutDate > bookingCheckIn && checkOutDate <= bookingCheckOut) ||
          (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
        );
      });
      
      if (isOverlapping) {
        return res.status(400).json({ message: "Property is not available for the selected dates" });
      }
      
      // Create booking
      const booking = await storage.createBooking(data);
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // Get guest bookings
  app.get("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getBookingsByGuest(req.session.userId!);
      
      // Get property details for each booking
      const bookingsWithDetails = await Promise.all(bookings.map(async (booking) => {
        const property = await storage.getProperty(booking.propertyId);
        return {
          ...booking,
          property: property ? {
            id: property.id,
            title: property.title,
            images: property.images,
            pricePerNight: property.pricePerNight,
            neighborhood: property.neighborhood,
            city: property.city
          } : null
        };
      }));
      
      res.json(bookingsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get host bookings
  app.get("/api/host/bookings", isHost, async (req, res) => {
    try {
      // Get all properties owned by host
      const properties = await storage.getPropertyByHost(req.session.userId!);
      
      // Get bookings for each property
      const bookings = [];
      for (const property of properties) {
        const propertyBookings = await storage.getBookingsByProperty(property.id);
        
        // Add property details to each booking
        for (const booking of propertyBookings) {
          const guest = await storage.getUser(booking.guestId);
          bookings.push({
            ...booking,
            property: {
              id: property.id,
              title: property.title,
              images: property.images
            },
            guest: guest ? {
              id: guest.id,
              firstName: guest.firstName,
              lastName: guest.lastName,
              profilePicture: guest.profilePicture
            } : null
          });
        }
      }
      
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Update booking status
  app.put("/api/bookings/:id/status", isAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const { status, paymentId } = req.body;
      
      if (!['pending', 'confirmed', 'canceled', 'completed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check authorization
      const user = await storage.getUser(req.session.userId!);
      const property = await storage.getProperty(booking.propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Only host can confirm or guest can cancel
      if (
        (status === 'confirmed' && property.hostId !== req.session.userId) ||
        (status === 'canceled' && booking.guestId !== req.session.userId && property.hostId !== req.session.userId) ||
        (status === 'completed' && property.hostId !== req.session.userId)
      ) {
        return res.status(403).json({ message: "Not authorized to update this booking" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(bookingId, status, paymentId);
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // REVIEW ROUTES
  
  // Create review
  app.post("/api/reviews", isAuthenticated, async (req, res) => {
    try {
      const data = insertReviewSchema.parse({
        ...req.body,
        guestId: req.session.userId
      });
      
      // Verify booking exists and is completed
      const booking = await storage.getBooking(data.bookingId);
      if (!booking || booking.guestId !== req.session.userId) {
        return res.status(403).json({ message: "You can only review properties you've booked" });
      }
      
      if (booking.status !== 'completed') {
        return res.status(400).json({ message: "You can only review completed stays" });
      }
      
      // Create review
      const review = await storage.createReview(data);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // Get property reviews
  app.get("/api/properties/:id/reviews", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByProperty(propertyId);
      
      // Get guest info for each review
      const reviewsWithGuest = await Promise.all(reviews.map(async (review) => {
        const guest = await storage.getUser(review.guestId);
        return {
          ...review,
          guest: guest ? {
            id: guest.id,
            firstName: guest.firstName,
            lastName: guest.lastName,
            profilePicture: guest.profilePicture
          } : null
        };
      }));
      
      res.json(reviewsWithGuest);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // MESSAGE ROUTES
  
  // Send message
  app.post("/api/messages", isAuthenticated, async (req, res) => {
    try {
      const data = insertMessageSchema.parse({
        ...req.body,
        senderId: req.session.userId
      });
      
      // Verify receiver exists
      const receiver = await storage.getUser(data.receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
      
      // Create message
      const message = await storage.createMessage(data);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // Get conversation
  app.get("/api/messages/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversation = await storage.getConversation(req.session.userId!, userId);
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Mark message as read
  app.put("/api/messages/:id/read", isAuthenticated, async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const message = await storage.markMessageAsRead(messageId);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      // Check if user is the receiver
      if (message.receiverId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to mark this message as read" });
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // WAITLIST ROUTES
  
  // Add to waitlist
  app.post("/api/waitlist", async (req, res) => {
    try {
      const data = insertWaitlistSchema.parse(req.body);
      
      // Check if email already exists
      const waitlistEntries = await storage.getWaitlistEntries();
      const existingEntry = waitlistEntries.find(entry => entry.email === data.email);
      
      if (existingEntry) {
        return res.status(400).json({ message: "Email already registered in waitlist" });
      }
      
      // Add to waitlist
      const entry = await storage.addToWaitlist(data);
      res.status(201).json({ message: "Successfully added to waitlist" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // Get waitlist entries (admin only)
  app.get("/api/waitlist", isAdmin, async (req, res) => {
    try {
      const entries = await storage.getWaitlistEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Serve uploads folder
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  
  const httpServer = createServer(app);
  return httpServer;
}
