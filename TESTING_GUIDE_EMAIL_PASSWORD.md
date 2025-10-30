# Testing Guide: Email Verification & Password Reset

## 🧪 Manual Testing Steps

Since I cannot run the application, here's a comprehensive manual testing guide for you.

---

## Part 1: Email Verification Flow

### Test 1: New User Signup
**Steps:**
1. Navigate to `/signup`
2. Fill in all fields:
   - Full Name: "Test User"
   - Email: "test@example.com" (use a real email you can access)
   - Username: "testuser"
   - Password: "testpass123"
   - Confirm Password: "testpass123"
3. Click "Sign Up"

**Expected Results:**
- ✅ Success toast appears: "Account created successfully. Please check your email to verify your account."
- ✅ Automatically redirects to `/signup/check-email`
- ✅ "Check Your Email" page shows correct email address
- ✅ "Resend Verification Email" button is available

### Test 2: Check Email
**Steps:**
1. After signup, you're on the "Check Your Email" page
2. Check your inbox (and spam folder)

**Expected Results:**
- ✅ Email arrives from Firebase (usually within 1-2 minutes)
- ✅ Email contains verification link
- ✅ Email looks professional

**Click the verification link:**
- ✅ Opens in browser
- ✅ Firebase verifies email automatically
- ✅ No errors occur

### Test 3: Resend Verification Email
**Steps:**
1. On the "Check Your Email" page
2. Click "Resend Verification Email"
3. Try clicking it again immediately

**Expected Results:**
- ✅ First click: Email sent, success toast appears
- ✅ Button shows "Resend in 60s"
- ✅ Countdown from 60 down to 0
- ✅ Button disabled during countdown
- ✅ After countdown, button becomes clickable again

### Test 4: Continue to Dashboard
**Steps:**
1. On "Check Your Email" page
2. Click "Continue to Dashboard" (before verifying email)

**Expected Results:**
- ✅ Navigates to `/dashboard`
- ✅ (Optional) Verification banner should show at top if email not verified

### Test 5: Verified Status
**Steps:**
1. Login to the app after verifying email
2. Navigate to dashboard

**Expected Results:**
- ✅ No verification banner appears (if email is verified)
- ✅ All features accessible

---

## Part 2: Password Reset Flow

### Test 1: Forgot Password Link
**Steps:**
1. Navigate to `/login`
2. Look below password field

**Expected Results:**
- ✅ "Forgot password?" link appears
- ✅ Link is clickable and styled properly

### Test 2: Request Password Reset
**Steps:**
1. Click "Forgot password?" link
2. You're on `/forgot-password`
3. Enter email: "test@example.com" (same as signup)
4. Click "Send Reset Link"

**Expected Results:**
- ✅ Loading spinner appears on button
- ✅ Success toast: "Password reset link sent!"
- ✅ Page changes to success screen
- ✅ Shows email address confirmation
- ✅ "Back to Login" button available

### Test 3: Check Password Reset Email
**Steps:**
1. Check your email inbox

**Expected Results:**
- ✅ Email arrives from Firebase (within 1-2 minutes)
- ✅ Contains "Reset your password" link

### Test 4: Click Reset Link
**Steps:**
1. Click the reset link in email
2. Opens `/reset-password?code=xxx`

**Expected Results:**
- ✅ Reset password page loads
- ✅ Shows email icon
- ✅ Two password fields visible:
   - "New Password"
   - "Confirm Password"
- ✅ "Show password" checkbox
- ✅ "Reset Password" button

### Test 5: Reset Password - Validation
**Steps:**
1. On reset password page
2. Try entering passwords that don't match:
   - New Password: "newpass123"
   - Confirm Password: "newpass456"
3. Click "Reset Password"

**Expected Results:**
- ✅ Error message: "Passwords do not match"
- ✅ Red error alert appears
- ✅ Submit button disabled (or error shown)

**Test password too short:**
- Enter password shorter than 6 characters
- Error: "Password must be at least 6 characters long"

### Test 6: Successfully Reset Password
**Steps:**
1. Enter matching passwords:
   - New Password: "NewPass123!"
   - Confirm Password: "NewPass123!"
2. Click "Reset Password"

**Expected Results:**
- ✅ Loading spinner appears
- ✅ Success screen shows: "Password Reset Successful"
- ✅ Auto-redirects to `/login` after 2 seconds

### Test 7: Login with New Password
**Steps:**
1. On login page
2. Enter:
   - Email: "test@example.com"
   - Password: "NewPass123!" (new password)
3. Click "Sign In"

**Expected Results:**
- ✅ Login successful
- ✅ Old password no longer works
- ✅ Can access dashboard

---

## Part 3: Error Handling Tests

### Test 1: Invalid Reset Code
**Steps:**
1. Manually navigate to: `/reset-password?code=INVALID_CODE`
2. Try to reset password

**Expected Results:**
- ✅ Error message: "Invalid reset link. The link may have expired."
- ✅ Clear error message
- ✅ User can try again

### Test 2: Expired Reset Code
**Steps:**
1. Request password reset
2. Wait 1 hour (Firebase default expiration)
3. Try to use the link

**Expected Results:**
- ✅ Error message about expired link
- ✅ Option to request new reset link

### Test 3: Email Not Found
**Steps:**
1. Go to `/forgot-password`
2. Enter email that doesn't exist: "nonexistent@example.com"
3. Send reset link

**Expected Results:**
- ✅ Should still show success message (security best practice - don't reveal if email exists)
- ✅ Or show specific error if you want to handle differently

---

## Part 4: Edge Cases

### Test 1: Verify Email from Different Device
**Steps:**
1. Signup on laptop
2. Check email on phone
3. Click verification link from phone

**Expected Results:**
- ✅ Link works across devices
- ✅ Email verifies successfully

### Test 2: Multiple Rapid Clicks
**Steps:**
1. Signup → Get to "Check Your Email" page
2. Rapidly click "Resend Email" multiple times

**Expected Results:**
- ✅ Cooldown prevents spam
- ✅ Button disables after first click
- ✅ Only one email sent

### Test 3: Network Error
**Steps:**
1. Turn off internet
2. Try to send password reset

**Expected Results:**
- ✅ Shows error message
- ✅ Doesn't crash
- ✅ Button re-enables

---

## Part 5: Mobile Testing

### Test 1: Signup on Mobile
**Steps:**
1. Open app on mobile device
2. Signup process

**Expected Results:**
- ✅ Forms work on mobile
- ✅ Buttons are tappable
- ✅ Text is readable
- ✅ Layout not broken

### Test 2: Email Links on Mobile
**Steps:**
1. Check email on phone
2. Click verification/reset link

**Expected Results:**
- ✅ Opens correctly on mobile
- ✅ UI is responsive
- ✅ Can complete verification/reset

---

## Part 6: Integration Testing

### Test 1: Full Signup → Verification → Dashboard
**End-to-end flow:**
1. Signup → Get email → Verify → Access dashboard

**Expected Results:**
- ✅ Everything works smoothly
- ✅ No broken links
- ✅ User ends up on dashboard

### Test 2: Full Password Reset → Login
**End-to-end flow:**
1. Forgot password → Get email → Reset → Login

**Expected Results:**
- ✅ Can complete entire flow
- ✅ No errors
- ✅ Can access app with new password

---

## 🐛 What to Watch For

### Potential Issues:
- **Email not arriving:** Check Firebase Console → Authentication → Email Templates
- **Link not working:** Check if URL is correct format
- **Buttons not working:** Check console for errors
- **Redirect loops:** Verify route configuration
- **Type errors:** Check TypeScript compilation

### Console Errors to Check:
```bash
# Run this to check for errors
npm run dev
# Then check browser console
```

Look for:
- Red error messages
- Network failures
- Firebase errors
- Type errors

---

## ✅ Success Criteria

### Email Verification:
- [x] Email sent after signup
- [x] Email arrives in inbox
- [x] Link verifies successfully
- [x] Resend works with cooldown
- [x] UI looks good
- [x] No console errors

### Password Reset:
- [x] Forgot password link works
- [x] Email sent successfully
- [x] Reset link works
- [x] Password validation works
- [x] New password works on login
- [x] Old password doesn't work
- [x] Error handling works
- [x] No console errors

---

## 📝 Testing Checklist

Copy this and check off as you test:

```
EMAIL VERIFICATION:
[ ] Signup sends email
[ ] Email arrives
[ ] Verification link works
[ ] Resend button works
[ ] Cooldown works
[ ] UI looks good
[ ] No errors

PASSWORD RESET:
[ ] Forgot password link visible
[ ] Request reset works
[ ] Email arrives
[ ] Reset link works
[ ] Validation works
[ ] New password works
[ ] Old password doesn't work
[ ] UI looks good
[ ] No errors

MOBILE:
[ ] Responsive design
[ ] Touch-friendly
[ ] Email links work
[ ] Forms work

INTEGRATION:
[ ] Full signup flow works
[ ] Full reset flow works
[ ] No broken links
[ ] No console errors
```

---

## 🚀 Quick Start Testing

### Fastest Test (5 minutes):
1. Signup with test email
2. Check email → Click verification link
3. Login → Click "Forgot password?"
4. Enter email → Click reset link in email
5. Set new password → Login with new password

If all these work → ✅ Success!

---

## Need Help?

If something doesn't work:
1. Check browser console for errors
2. Check Firebase Console for email issues
3. Verify Firebase Auth is properly configured
4. Check network tab for failed requests

Good luck testing! 🎉

