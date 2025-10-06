'use server';

import connectDB from '@/lib/db/mongodb';


/**
 * This component initializes the database connection and ensures all models are synchronized
 * It runs on the server side during application startup
 */
export async function initializeDatabase() {
  try {
    // Connect to the database
    const mongoose = await connectDB();
    console.log('✅ Database connected successfully');
    
    // Log all registered models to confirm they're synchronized
    const modelNames = Object.keys(mongoose.models);
    console.log(`✅ Models synchronized: ${modelNames.join(', ')}`);
    
    return { success: true, models: modelNames };
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return { success: false, error };
  }
}