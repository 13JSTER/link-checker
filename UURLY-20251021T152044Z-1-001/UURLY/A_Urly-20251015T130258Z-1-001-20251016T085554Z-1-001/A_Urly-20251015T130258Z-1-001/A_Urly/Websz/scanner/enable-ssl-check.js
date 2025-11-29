import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function enableSSL() {
  console.log('\n=== Enabling SSL Certificate Validation ===\n');

  try {
    // Check if ssl_enabled exists
    const { data: existing, error: checkError } = await supabase
      .from('configuration')
      .select('*')
      .eq('config_key', 'ssl_enabled')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existing) {
      // Update existing
      const { error: updateError } = await supabase
        .from('configuration')
        .update({
          config_value: 'true',
          updated_at: new Date().toISOString()
        })
        .eq('config_key', 'ssl_enabled');

      if (updateError) throw updateError;
      console.log('✓ Updated ssl_enabled to TRUE');
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from('configuration')
        .insert([{
          config_key: 'ssl_enabled',
          config_value: 'true',
          config_type: 'boolean',
          description: 'Enable SSL certificate validation and expiry checking'
        }]);

      if (insertError) throw insertError;
      console.log('✓ Added ssl_enabled configuration (TRUE)');
    }

    // Verify all configurations
    const { data: allConfigs, error: fetchError } = await supabase
      .from('configuration')
      .select('config_key, config_value')
      .order('config_key');

    if (fetchError) throw fetchError;

    console.log('\n✓ All Configuration Keys:');
    allConfigs.forEach(config => {
      const marker = config.config_key === 'ssl_enabled' ? '← ENABLED' : '';
      console.log(`  • ${config.config_key}: ${config.config_value} ${marker}`);
    });

    console.log(`\n✓ Total configuration entries: ${allConfigs.length}`);
    console.log('\n=== SSL Certificate Validation Enabled! ===');
    console.log('\nWhat This Enables:');
    console.log('  ✓ Certificate expiry checking');
    console.log('  ✓ Certificate issuer validation');
    console.log('  ✓ Hostname verification');
    console.log('  ✓ TLS protocol version detection');
    console.log('  ✓ Cipher suite analysis');
    console.log('  ✓ Days until certificate expiration');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

enableSSL();
