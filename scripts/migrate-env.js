import { supabase } from './supabase-client.js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function migrateEnvVariables() {
  // Get all environment variables from .env file
  const envVars = process.env;

  // Filter out empty values and system variables
  const envEntries = Object.entries(envVars).filter(([key, value]) => {
    return value && !key.startsWith('npm_') && !key.startsWith('NODE_');
  });

  console.log(`Found ${envEntries.length} environment variables to migrate`);

  // Insert each environment variable into Supabase
  for (const [key, value] of envEntries) {
    try {
      const { error } = await supabase
        .from('env_variables')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'key',
        });

      if (error) {
        console.error(`Error migrating ${key}:`, error);
      } else {
        console.log(`Successfully migrated ${key}`);
      }
    } catch (error) {
      console.error(`Error migrating ${key}:`, error);
    }
  }

  console.log('Migration completed!');
}

migrateEnvVariables().catch(console.error); 