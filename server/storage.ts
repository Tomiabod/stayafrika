import { 
  users, type User, type InsertUser,
  properties, type Property, type InsertProperty,
  bookings, type Booking, type InsertBooking,
  reviews, type Review, type InsertReview,
  messages, type Message, type InsertMessage,
  waitlist, type Waitlist, type InsertWaitlist,
  bookingStatusEnum, userRoleEnum
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Property operations
  createProperty(property: InsertProperty): Promise<Property>;
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: Partial<Property>): Promise<Property[]>;
  getPropertyByHost(hostId: number): Promise<Property[]>;
  updateProperty(id: number, propertyData: Partial<Property>): Promise<Property | undefined>;
  approveProperty(id: number): Promise<Property | undefined>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByGuest(guestId: number): Promise<Booking[]>;
  getBookingsByProperty(propertyId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string, paymentId?: string): Promise<Booking | undefined>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByProperty(propertyId: number): Promise<Review[]>;
  getReviewsByGuest(guestId: number): Promise<Review[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getConversation(user1Id: number, user2Id: number): Promise<Message[]>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Waitlist operations
  addToWaitlist(entry: InsertWaitlist): Promise<Waitlist>;
  getWaitlistEntries(): Promise<Waitlist[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  private messages: Map<number, Message>;
  private waitlist: Map<number, Waitlist>;
  
  private userId: number;
  private propertyId: number;
  private bookingId: number;
  private reviewId: number;
  private messageId: number;
  private waitlistId: number;
  
  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.messages = new Map();
    this.waitlist = new Map();
    
    this.userId = 1;
    this.propertyId = 1;
    this.bookingId = 1;
    this.reviewId = 1;
    this.messageId = 1;
    this.waitlistId = 1;
    
    // Create admin user
    this.createUser({
      email: "admin@stayafrika.com",
      password: "$2a$10$8GQ7pQn5iHQVpVG9yydiWeSqOTL8qQrQxnZ1BDsNR7hS92xCyPsHa", // "admin123"
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      phoneNumber: "+2348012345678",
      bio: "StayAfrika Admin",
      profilePicture: "",
      isVerified: true
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...userData, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Property operations
  async createProperty(propertyData: InsertProperty): Promise<Property> {
    const id = this.propertyId++;
    const property: Property = { ...propertyData, id, createdAt: new Date() };
    this.properties.set(id, property);
    return property;
  }
  
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }
  
  async getProperties(filters?: Partial<Property>): Promise<Property[]> {
    let properties = Array.from(this.properties.values());
    
    if (filters) {
      properties = properties.filter(property => {
        for (const [key, value] of Object.entries(filters)) {
          if (property[key as keyof Property] !== value) {
            return false;
          }
        }
        return true;
      });
    }
    
    return properties.filter(property => property.isApproved && property.isActive);
  }
  
  async getPropertyByHost(hostId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.hostId === hostId
    );
  }
  
  async updateProperty(id: number, propertyData: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...propertyData };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }
  
  async approveProperty(id: number): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const approvedProperty = { ...property, isApproved: true };
    this.properties.set(id, approvedProperty);
    return approvedProperty;
  }
  
  // Booking operations
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const booking: Booking = { 
      ...bookingData, 
      id, 
      status: 'pending',
      createdAt: new Date() 
    };
    this.bookings.set(id, booking);
    return booking;
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async getBookingsByGuest(guestId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.guestId === guestId
    );
  }
  
  async getBookingsByProperty(propertyId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.propertyId === propertyId
    );
  }
  
  async updateBookingStatus(id: number, status: string, paymentId?: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { 
      ...booking, 
      status: status as any, 
      ...(paymentId ? { paymentId } : {}) 
    };
    
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // Review operations
  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const review: Review = { ...reviewData, id, createdAt: new Date() };
    this.reviews.set(id, review);
    return review;
  }
  
  async getReviewsByProperty(propertyId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.propertyId === propertyId
    );
  }
  
  async getReviewsByGuest(guestId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.guestId === guestId
    );
  }
  
  // Message operations
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const message: Message = { ...messageData, id, isRead: false, createdAt: new Date() };
    this.messages.set(id, message);
    return message;
  }
  
  async getConversation(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => 
        (message.senderId === user1Id && message.receiverId === user2Id) ||
        (message.senderId === user2Id && message.receiverId === user1Id)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  // Waitlist operations
  async addToWaitlist(entryData: InsertWaitlist): Promise<Waitlist> {
    const id = this.waitlistId++;
    const entry: Waitlist = { ...entryData, id, createdAt: new Date() };
    this.waitlist.set(id, entry);
    return entry;
  }
  
  async getWaitlistEntries(): Promise<Waitlist[]> {
    return Array.from(this.waitlist.values());
  }
}

// Use DatabaseStorage instead of MemStorage
import { DatabaseStorage } from './database-storage';
export const storage = new DatabaseStorage();
