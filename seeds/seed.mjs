import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/database.mjs';
import User from '../models/User.mjs';
import FileType from '../models/FileType.mjs';
// import ForeignResident from '../models/ForeignResident.mjs';
// import Accommodation from '../models/Accommodation.mjs';
// import Declaration from '../models/Declaration.mjs';
// import Residence from '../models/Residence.mjs';
import logger from '../config/logger.mjs';
// import UserAccommodationLink from '../models/UserAccommodationLink.mjs';

dotenv.config();
connectDB();

const seedDatabase = async () => {
  try {
    // Clear existing data
    await mongoose.connection.dropDatabase();

    // Hash password
    const hashedPassword = await bcrypt.hash('a', 10);

    // Create sample users
    const users = await User.insertMany([
      { username: 'admin', password: hashedPassword, role: 'admin', officer_id: 'OFFICER001', email: 'admin@example.com', phone: '0123456789', name: 'Admin User', dateOfBirth: new Date('1980-01-01'), gender: 'Male' },
      { username: 'quan ly', password: hashedPassword, role: 'manager', officer_id: 'OFFICER002', email: 'manager@example.com', phone: '0987654321', name: 'Manager User', dateOfBirth: new Date('1985-05-15'), gender: 'Female' },
      { username: 'nguoi dung1', password: hashedPassword, role: 'user', email: 'user1@example.com', phone: '0112233445', name: 'Nguyen Van A', dateOfBirth: new Date('1990-02-20'), gender: 'Male' },
      { username: 'quan ly1', password: hashedPassword, role: 'manager', email: 'user4@example.com', phone: '0445566778', name: 'Pham Thi D', dateOfBirth: new Date('1993-06-15'), gender: 'Female' },
      { username: 'nguoi dung2', password: hashedPassword, role: 'user', email: 'user2@example.com', phone: '0223344556', name: 'Tran Thi B', dateOfBirth: new Date('1992-03-25'), gender: 'Female' },
      { username: 'nguoi dung', password: hashedPassword, role: 'user', email: 'user3@example.com', phone: '0334455667', name: 'Le Van C', dateOfBirth: new Date('1995-04-30'), gender: 'Male' },
    ]);

    console.log('Users created:', users);

    const fileTypes = await FileType.insertMany([
    {
      code: 'FT001',
      name: 'Hồ sơ tố giác tội phạm',
      description: 'Dành cho các hồ sơ liên quan đến tố giác hành vi phạm tội.'
    },
    {
      code: 'FT002',
      name: 'Hồ sơ điều tra ban đầu',
      description: 'Ghi nhận thông tin điều tra sơ bộ ban đầu.'
    },
    {
      code: 'FT003',
      name: 'Hồ sơ xử lý vi phạm hành chính',
      description: 'Liên quan đến các trường hợp xử lý hành chính không hình sự.'
    },
    {
      code: 'FT004',
      name: 'Hồ sơ chuyển cơ quan điều tra',
      description: 'Hồ sơ được chuyển tiếp đến cơ quan điều tra có thẩm quyền.'
    },
    {
      code: 'FT005',
      name: 'Hồ sơ lưu trữ',
      description: 'Lưu trữ lâu dài cho các hồ sơ đã kết thúc.'
    }
  ]);

  console.log('✅ File types created:', fileTypes);


    logger.info('Database seeded successfully');
    process.exit();
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

// node --experimental-modules ./seeds/seed.mjs
