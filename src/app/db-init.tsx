import { initializeDatabase } from '@/components/providers/db-provider';

export default async function DatabaseInitializer() {
  // Initialize database connection and sync models
  await initializeDatabase();
  
  // This component doesn't render anything visible
  return null;
}