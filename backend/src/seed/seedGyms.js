import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Gym from "../models/Gym.js";

const gyms = [
  {
    name: "Gold's Gym Bandra",
    area: "Mumbai",
    address: "Linking Road, Bandra West, Mumbai, Maharashtra",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    contact: "+91 98200 12345",
  },
  {
    name: "Talwalkars Powerhouse",
    area: "Mumbai",
    address: "Andheri East, Mumbai, Maharashtra",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",
    contact: "+91 98210 54321",
  },
  {
    name: "Fitness First Connaught Place",
    area: "Delhi",
    address: "Connaught Place, New Delhi",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    contact: "+91 98100 22334",
  },
  {
    name: "Anytime Fitness Saket",
    area: "Delhi",
    address: "Saket, New Delhi",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f",
    contact: "+91 98110 66778",
  },
  {
    name: "Cult.fit Koramangala",
    area: "Bangalore",
    address: "Koramangala 5th Block, Bangalore, Karnataka",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
    contact: "+91 98450 11223",
  },
  {
    name: "Gold's Gym Indiranagar",
    area: "Bangalore",
    address: "100 Feet Road, Indiranagar, Bangalore, Karnataka",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712",
    contact: "+91 98450 99887",
  },
  {
    name: "Talwalkars Aundh",
    area: "Pune",
    address: "Aundh, Pune, Maharashtra",
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c",
    contact: "+91 98220 33445",
  },
  {
    name: "Fitness Hub Viman Nagar",
    area: "Pune",
    address: "Viman Nagar, Pune, Maharashtra",
    rating: 3.9,
    image: "https://images.unsplash.com/photo-1558917000-a5f0f1ef4b73",
    contact: "+91 98230 77665",
  },
  {
    name: "Gold's Gym Banjara Hills",
    area: "Hyderabad",
    address: "Banjara Hills, Hyderabad, Telangana",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1516715094483-75da7dee9758",
    contact: "+91 98480 44556",
  },
  {
    name: "Cult.fit Gachibowli",
    area: "Hyderabad",
    address: "Gachibowli, Hyderabad, Telangana",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    contact: "+91 98480 99001",
  },
];

const seedGyms = async () => {
  try {
    await connectDB();

    await Gym.deleteMany({});
    console.log("Existing gyms cleared");

    const created = await Gym.insertMany(gyms);
    console.log(`${created.length} gyms seeded successfully`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding gyms:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedGyms();
