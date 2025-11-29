/**
 * Add Detection Sensitivity Configuration to Database
 * This script adds the missing detection_sensitivity config key
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function addDetectionSensitivity() {
  console.log('\n=== Adding Detection Sensitivity Configuration ===\n');
  
  try {
    // Check if detection_sensitivity already exists
    const { data: existing, error: checkError } = await supabase
      .from('configuration')
      .select('*')
      .eq('config_key', 'detection_sensitivity')
      .single();
    
    if (existing) {
      console.log('✓ detection_sensitivity already exists');
      console.log(`  Current value: ${existing.config_value}`);
      
      // Update it to ensure it has the correct description
      const { error: updateError } = await supabase
        .from('configuration')
        .update({
          config_type: 'number',
          description: 'Detection sensitivity level (50-150%): Controls overall security strictness'
        })
        .eq('config_key', 'detection_sensitivity');
      
      if (updateError) {
        console.error('✗ Error updating description:', updateError.message);
      } else {
        console.log('✓ Updated description');
      }
    } else {
      // Insert new detection_sensitivity configuration
      const { data, error: insertError } = await supabase
        .from('configuration')
        .insert([
          {
            config_key: 'detection_sensitivity',
            config_value: '100',
            config_type: 'number',
            description: 'Detection sensitivity level (50-150%): Controls overall security strictness'
          }
        ])
        .select();
      
      if (insertError) {
        console.error('✗ Error inserting detection_sensitivity:', insertError.message);
        process.exit(1);
      }
      
      console.log('✓ Successfully added detection_sensitivity');
      console.log('  Default value: 100 (Normal)');
    }
    
    // Verify it exists now
    console.log('\nVerifying configuration...');
    const { data: allConfigs, error: verifyError } = await supabase
      .from('configuration')
      .select('config_key, config_value, config_type, description')
      .order('config_key');
    
    if (verifyError) {
      console.error('✗ Error verifying:', verifyError.message);
      process.exit(1);
    }
    
    console.log('\n✓ All Configuration Keys:');
    allConfigs.forEach(config => {
      const marker = config.config_key === 'detection_sensitivity' ? ' ← NEW' : '';
      console.log(`  • ${config.config_key}: ${config.config_value}${marker}`);
    });
    
    console.log(`\n✓ Total configuration entries: ${allConfigs.length}`);
    console.log('\n=== Detection Sensitivity Successfully Configured! ===\n');
    
  } catch (error) {
    console.error('\n✗ Unexpected error:', error.message);
    process.exit(1);
  }
}

addDetectionSensitivity();
