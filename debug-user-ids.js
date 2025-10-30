// Debug script to check what user IDs are stored in localStorage
console.log('🔍 DEBUGGING USER IDS IN LOCALSTORAGE');
console.log('=====================================');

// Check current environment
const hostname = window.location.hostname;
let environment = 'production';
if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
  environment = 'development';
} else if (hostname.includes('staging')) {
  environment = 'staging';
} else if (hostname.includes('preview') || hostname.includes('vercel.app')) {
  environment = 'preview';
}

console.log('🌍 Current Environment:', environment);

// Check all localStorage keys
console.log('\n📦 ALL LOCALSTORAGE KEYS:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}

// Check environment-specific keys
console.log(`\n🔑 ENVIRONMENT-SPECIFIC KEYS (${environment}_*):`);
const envKeys = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith(`${environment}_`)) {
    const cleanKey = key.replace(`${environment}_`, '');
    const value = localStorage.getItem(key);
    envKeys.push({ key: cleanKey, value });
    console.log(`${cleanKey}: ${value}`);
  }
}

// Check specific user ID keys
console.log('\n👤 USER ID ANALYSIS:');
const databaseUserId = localStorage.getItem(`${environment}_databaseUserId`);
const firebaseIdToken = localStorage.getItem(`${environment}_firebaseIdToken`);
const authToken = localStorage.getItem(`${environment}_auth_token`);

console.log('databaseUserId:', databaseUserId);
console.log('firebaseIdToken:', firebaseIdToken);
console.log('auth_token:', authToken);

// Check if Firebase user is available
if (typeof window !== 'undefined' && window.firebase) {
  console.log('\n🔥 FIREBASE USER:');
  const user = window.firebase.auth().currentUser;
  if (user) {
    console.log('Firebase UID:', user.uid);
    console.log('Firebase Email:', user.email);
    console.log('Firebase Display Name:', user.displayName);
  } else {
    console.log('No Firebase user logged in');
  }
}

// Summary
console.log('\n📊 SUMMARY:');
console.log('Environment:', environment);
console.log('Total localStorage keys:', localStorage.length);
console.log('Environment-specific keys:', envKeys.length);
console.log('Database User ID stored:', !!databaseUserId);
console.log('Firebase ID Token stored:', !!firebaseIdToken);
console.log('Auth Token stored:', !!authToken);

if (databaseUserId) {
  console.log('✅ Database User ID is stored');
} else {
  console.log('❌ Database User ID is NOT stored');
}

if (firebaseIdToken) {
  console.log('✅ Firebase ID Token is stored');
} else {
  console.log('❌ Firebase ID Token is NOT stored');
}

if (authToken) {
  console.log('✅ Auth Token is stored');
} else {
  console.log('❌ Auth Token is NOT stored');
}

