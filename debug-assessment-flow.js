// Assessment Flow Debugging Script
// Run this in browser console after login to diagnose assessment results issue

console.log('🔍 Assessment Flow Debugging Script');
console.log('=====================================');

// 1. Check localStorage for database user ID
const databaseUserId = localStorage.getItem('databaseUserId');
console.log('1. Database User ID in localStorage:', databaseUserId ? `✅ ${databaseUserId}` : '❌ Missing');

// 2. Check Firebase auth state
const auth = window.firebase?.auth?.();
if (auth) {
  const currentUser = auth.currentUser;
  console.log('2. Firebase User:', currentUser ? `✅ ${currentUser.uid}` : '❌ No user');
  console.log('   Firebase User Email:', currentUser?.email || 'N/A');
} else {
  console.log('2. Firebase Auth:', '❌ Not available');
}

// 3. Check React Query cache for assessment queries
const queryClient = window.__REACT_QUERY_DEVTOOLS_GLOBAL_CACHE__;
if (queryClient) {
  const queries = queryClient.getQueryCache().getAll();
  const assessmentQueries = queries.filter(q => 
    q.queryKey[0]?.includes('assessment') || 
    q.queryKey[0]?.includes('user-latest')
  );
  
  console.log('3. Assessment Queries in React Query:');
  assessmentQueries.forEach(q => {
    console.log(`   - ${q.queryKey[0]}: ${q.state.status} (${q.state.data ? 'Has data' : 'No data'})`);
  });
  
  if (assessmentQueries.length === 0) {
    console.log('   ❌ No assessment queries found');
  }
} else {
  console.log('3. React Query:', '❌ Not available');
}

// 4. Check for API calls in network tab
console.log('4. Network Tab Check:');
console.log('   Look for these API calls:');
console.log('   - GET /api/v1/users/me/:authProviderId');
console.log('   - GET /api/v1/assessment/user/:userId/latest');
console.log('   - GET /api/v1/assessment/user/:userId/all');

// 5. Check component state (if React DevTools available)
console.log('5. Component State Check:');
console.log('   Use React DevTools to check:');
console.log('   - AuthContext: user, userRegistrationComplete');
console.log('   - SessionContext: session, sessionId');
console.log('   - Dashboard: effectiveSessionId, assessmentResults');

// 6. Test API endpoints manually
async function testEndpoints() {
  console.log('6. Testing API Endpoints:');
  
  if (!databaseUserId) {
    console.log('   ❌ Cannot test endpoints without database user ID');
    return;
  }
  
  try {
    // Test latest assessment endpoint
    const latestResponse = await fetch(`/api/v1/assessment/user/${databaseUserId}/latest`);
    console.log(`   Latest Assessment (${latestResponse.status}):`, latestResponse.ok ? '✅ Success' : '❌ Failed');
    
    if (latestResponse.ok) {
      const latestData = await latestResponse.json();
      console.log('   Latest Assessment Data:', latestData);
    }
    
    // Test all assessments endpoint
    const allResponse = await fetch(`/api/v1/assessment/user/${databaseUserId}/all`);
    console.log(`   All Assessments (${allResponse.status}):`, allResponse.ok ? '✅ Success' : '❌ Failed');
    
    if (allResponse.ok) {
      const allData = await allResponse.json();
      console.log('   All Assessments Count:', allData.length);
    }
    
  } catch (error) {
    console.log('   ❌ API test failed:', error.message);
  }
}

// 7. Check for errors in console
console.log('7. Console Errors:');
const errors = window.console.errors || [];
if (errors.length > 0) {
  errors.forEach(error => {
    if (error.includes('assessment') || error.includes('user') || error.includes('session')) {
      console.log(`   ❌ ${error}`);
    }
  });
} else {
  console.log('   ✅ No relevant errors found');
}

// Run the API tests
testEndpoints();

console.log('=====================================');
console.log('🔍 Debugging complete. Check the output above for issues.'); 