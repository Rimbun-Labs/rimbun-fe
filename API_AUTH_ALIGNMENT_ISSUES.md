# API Auth Alignment Issues - Analysis

## ❌ Issues Found: Endpoints NOT using apiClient

### 1. **CRITICAL - userResponsesApi.ts** ❌
**File:** `src/lib/api/userResponsesApi.ts`  
**Line:** 82  
**Endpoint:** `/user-responses/answer`  
**Method:** POST  
**Current:** Uses raw `fetch()`  
**Problem:** ❌ **MISSING Authorization header** (this is the current bug!)  
**Requires Auth:** ✅ YES (user submitting answer)

---

### 2. **profileApi.ts - updateProfilePicture** ❌
**File:** `src/lib/api/profileApi.ts`  
**Line:** 198  
**Endpoint:** `/users/profile-picture`  
**Method:** POST  
**Current:** Uses raw `fetch()`  
**Problem:** ❌ **MISSING Authorization header**  
**Requires Auth:** ✅ YES (uploading profile picture)

---

### 3. **assetAnalyzerApi.ts - All methods** ❌
**File:** `src/lib/api/assetAnalyzerApi.ts`  
**Line:** 103  
**Endpoints:** `/search`, `/${symbol}`, `/compare`, etc.  
**Method:** GET/POST  
**Current:** Uses raw `fetch()` in private `request()` method  
**Problem:** ❌ **MISSING Authorization header**  
**Requires Auth:** ✅ YES (user searching/analyzing assets)

---

### 4. **userService.ts - registerUser** ⚠️
**File:** `src/lib/api/userService.ts`  
**Line:** 32  
**Endpoint:** `/users/register`  
**Method:** POST  
**Current:** Uses raw `fetch()`  
**Problem:** ⚠️ **Probably OK** - registration might be public  
**Requires Auth:** ❓ **UNKNOWN** - Need to check backend

---

### 5. **userService.ts - ensureUserExists** ⚠️
**File:** `src/lib/api/userService.ts`  
**Line:** 75  
**Endpoint:** `/users/register`  
**Method:** POST  
**Current:** Uses raw `fetch()`  
**Problem:** ⚠️ **Probably OK** - registration might be public  
**Requires Auth:** ❓ **UNKNOWN** - Need to check backend

---

### 6. **userService.ts - getDatabaseUserIdForExistingUser** ⚠️
**File:** `src/lib/api/userService.ts`  
**Line:** 127  
**Endpoint:** `/users/me/${authProviderId}`  
**Method:** GET  
**Current:** Uses raw `fetch()`  
**Problem:** ⚠️ **MIGHT NEED AUTH** - Getting user data  
**Requires Auth:** ❓ **UNKNOWN** - Need to check backend

---

## Summary

### ❌ **Definitely Broken (Need Auth):**
1. ✅ `userResponsesApi.submitAnswer` - `/user-responses/answer` ← **CURRENT BUG**
2. ✅ `profileApi.updateProfilePicture` - `/users/profile-picture`
3. ✅ `assetAnalyzerApi` (all methods) - `/asset-analyzer/*`

### ⚠️ **Possibly OK (Need Verification):**
4. `userService.registerUser` - `/users/register` (might be public)
5. `userService.ensureUserExists` - `/users/register` (might be public)
6. `userService.getDatabaseUserIdForExistingUser` - `/users/me/${authProviderId}` (might need auth)

---

## Recommendation

**Fix these 3 for sure:**
1. `userResponsesApi.submitAnswer` - **URGENT** (current bug)
2. `profileApi.updateProfilePicture` - **HIGH** (profile upload)
3. `assetAnalyzerApi.request()` - **HIGH** (all asset queries)

**Check with backend for these 3:**
4-6. `userService` methods - **MEDIUM** (registration endpoints)

