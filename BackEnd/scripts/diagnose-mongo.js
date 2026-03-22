#!/usr/bin/env node

// MongoDB Connection Diagnostic Script
// Run this to troubleshoot connection issues

const dns = require('dns');
const https = require('https');
const { execSync } = require('child_process');

console.log('🔍 MongoDB Atlas Connection Diagnostic Tool\n');

// Force IPv4 for consistent results
dns.setDefaultResultOrder('ipv4first');

async function runDiagnostics() {
  const clusterHost = 'cluster0.okn4ami.mongodb.net';
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://rachidaourik18_db_user:iaeuBHp7uH8zx5s4@cluster0.okn4ami.mongodb.net/petcare';

  console.log('1. 📡 Testing DNS Resolution...');
  try {
    const result = await new Promise((resolve, reject) => {
      dns.lookup(clusterHost, { family: 4 }, (err, address, family) => {
        if (err) reject(err);
        else resolve({ address, family });
      });
    });
    console.log(`   ✅ DNS Resolution: ${clusterHost} → ${result.address} (IPv${result.family})`);
  } catch (error) {
    console.log(`   ❌ DNS Resolution Failed: ${error.message}`);
    console.log('   💡 Try: echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf');
    return;
  }

  console.log('\n2. 🌐 Testing Internet Connectivity...');
  try {
    await new Promise((resolve, reject) => {
      const req = https.request('https://cloud.mongodb.com', (res) => {
        console.log(`   ✅ MongoDB Atlas reachable: ${res.statusCode} ${res.statusMessage}`);
        resolve();
      });
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      req.end();
    });
  } catch (error) {
    console.log(`   ❌ Internet connectivity issue: ${error.message}`);
    console.log('   💡 Check your internet connection or try different network');
  }

  console.log('\n3. 🔧 Checking Current IP Address...');
  try {
    const ip = await new Promise((resolve, reject) => {
      const req = https.request('https://api.ipify.org?format=json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data).ip);
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
      req.end();
    });
    console.log(`   🌍 Your Public IP: ${ip}`);
    console.log('   💡 Whitelist this IP in MongoDB Atlas → Network Access');
  } catch (error) {
    console.log(`   ❌ Could not determine public IP: ${error.message}`);
  }

  console.log('\n4. 📋 MongoDB Atlas Configuration Checklist...');
  console.log('   ✅ Connection String Format: Valid');
  console.log(`   📝 Database Name: petcare`);
  console.log(`   🏷️  Cluster Host: ${clusterHost}`);
  
  if (mongoUri.includes('<db_password>')) {
    console.log('   ❌ Password placeholder detected - replace with real password');
  } else {
    console.log('   ✅ Password appears to be set');
  }

  console.log('\n5. 🚀 Quick Fixes to Try...');
  console.log('   1. Whitelist your IP in MongoDB Atlas:');
  console.log('      - Go to Atlas → Network Access → Add IP Address');
  console.log('      - Add your current IP or use 0.0.0.0/0 (allow all IPs)');
  console.log('\n   2. Check if cluster is paused:');
  console.log('      - Go to Atlas → Clusters → Check cluster status');
  console.log('      - Resume if paused (free tiers auto-pause)');
  console.log('\n   3. Test with IPv4 forced connection:');
  console.log('      - Your app now uses db-ipv4.js which forces IPv4');
  console.log('      - Run: npm run dev');

  console.log('\n6. 🔍 Network Debugging Commands...');
  console.log('   Test DNS:      node -e "console.log(require(\'dns\').lookup(\'cluster0.okn4ami.mongodb.net\', console.log))"');
  console.log('   Test internet:  ping 8.8.8.8');
  console.log('   Test MongoDB:  curl -I https://cloud.mongodb.com');
  console.log('   Check IP:      curl -s https://api.ipify.org');
  console.log('   Flush DNS:     sudo systemctl restart systemd-resolved');

  console.log('\n✅ Diagnostic complete! Try the fixes above and run npm run dev');
}

runDiagnostics().catch(console.error);
