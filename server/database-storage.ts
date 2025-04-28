import { 
  users, properties, bookings, reviews, messages, waitlist,
  type User, type InsertUser,
  type Property, type InsertProperty,
  type Booking, type InsertBooking,
  type Review, type InsertReview,
  type Message, type InsertMessage,
  type Waitlist, type InsertWaitlist
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  // Property operations
  async createProperty(propertyData: InsertProperty): Promise<Property> {
    // Ensure all required fields have values
    const valuesWithDefaults = {
      ...propertyData,
      isApproved: propertyData.isApproved ?? false,
      isActive: propertyData.isActive ?? true,
    };
    
    const [property] = await db
      .insert(properties)
      .values(valuesWithDefaults)
      .returning();
    return property;
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    return property || undefined;
  }

  async getProperties(filters?: Partial<Property>): Promise<Property[]> {
    let propertyList: Property[] = [];
    
    // Start with a basic query
    let conditions = [];
    
    // Add conditions if filters are provided
    if (filters) {
      if (filters.city) {
        conditions.push(eq(properties.city, filters.city));
      }
      
      if (filters.propertyType) {
        conditions.push(eq(properties.propertyType, filters.propertyType));
      }
      
      if (filters.isApproved !== undefined) {
        conditions.push(eq(properties.isApproved, filters.isApproved));
      }
      
      if (filters.isActive !== undefined) {
        conditions.push(eq(properties.isActive, filters.isActive));
      }
    }
    
    // Default to only approved and active properties
    if (!filters || (filters.isApproved === undefined && filters.isActive === undefined)) {
      conditions.push(eq(properties.isApproved, true));
      conditions.push(eq(properties.isActive, true));
    }
    
    // Execute the query with the conditions
    if (conditions.length > 0) {
      propertyList = await db
        .select()
        .from(properties)
        .where(and(...conditions));
    } else {
      propertyList = await db.select().from(properties);
    }
    
    return propertyList;
  }

  async getPropertyByHost(hostId: number): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.hostId, hostId));
  }

  async updateProperty(id: number, propertyData: Partial<Property>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set(propertyData)
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty || undefined;
  }

  async approveProperty(id: number): Promise<Property | undefined> {
    const [approvedProperty] = await db
      .update(properties)
      .set({ isApproved: true })
      .where(eq(properties.id, id))
      .returning();
    return approvedProperty || undefined;
  }

  // Booking operations
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    // Set default values for properties that might be undefined
    const valuesWithDefaults = {
      ...bookingData,
      status: 'pending',
      paymentId: bookingData.paymentId ?? null,
    };
    
    const [booking] = await db
      .insert(bookings)
      .values(valuesWithDefaults)
      .returning();
    return booking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookingsByGuest(guestId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.guestId, guestId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBookingsByProperty(propertyId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.propertyId, propertyId))
      .orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: number, status: string, paymentId?: string): Promise<Booking | undefined> {
    const updateData: any = { status };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }
    
    const [updatedBooking] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }

  // Review operations
  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(reviewData)
      .returning();
    return review;
  }

  async getReviewsByProperty(propertyId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.propertyId, propertyId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByGuest(guestId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.guestId, guestId))
      .orderBy(desc(reviews.createdAt));
  }

  // Message operations
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  async getConversation(user1Id: number, user2Id: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, user1Id),
            eq(messages.receiverId, user2Id)
          ),
          and(
            eq(messages.senderId, user2Id),
            eq(messages.receiverId, user1Id)
          )
        )
      )
      .orderBy(messages.createdAt);
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage || undefined;
  }

  // Waitlist operations
  async addToWaitlist(entryData: InsertWaitlist): Promise<Waitlist> {
    const [entry] = await db
      .insert(waitlist)
      .values(entryData)
      .returning();
    return entry;
  }

  async getWaitlistEntries(): Promise<Waitlist[]> {
    return await db
      .select()
      .from(waitlist)
      .orderBy(desc(waitlist.createdAt));
  }
}