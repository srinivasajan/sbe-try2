/**
 * Automated Test Suite for Contact Form Enquiry Flow & Mobile Validation
 * Shree Balaji Enterprises (SBE)
 */

import http from "http"
import { createSessionToken, getSessionSecret } from "../lib/auth-tokens.ts"

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"

async function postJson(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  return { status: res.status, ok: res.ok, data: json }
}

async function runTests() {
  console.log("==================================================================")
  console.log("  ENQUIRY NOTIFICATIONS & INDIAN MOBILE VALIDATION TEST SUITE    ")
  console.log("==================================================================\n")

  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`)
      passed++
    } else {
      console.error(`  ❌ FAIL: ${message}`)
      failed++
    }
  }

  console.log("--- 1. Strict Indian Mobile Number Validation Tests ---")

  // Test 1: Valid Indian number 9876543210
  const res1 = await postJson("/api/inquiries", {
    name: "Ramesh Sharma",
    phone: "9876543210",
    email: "ramesh@example.com",
    interest: "Buy Residential",
    message: "Looking for 2 BHK in Ambernath",
  })
  assert(res1.status === 201 && res1.data.ok === true, "Valid 10-digit number (9876543210) accepted with 201 Created")
  assert(
    res1.data.notificationStatus === "not_configured" || res1.data.notificationStatus === "sent",
    `Notification status correctly tracked as "${res1.data.notificationStatus}" (never pretending fake delivery)`
  )

  // Test 2: Valid Indian number starting with 7 (7767805544)
  const res2 = await postJson("/api/inquiries", {
    name: "Sunita Verma",
    phone: "7767805544",
    email: "sunita@example.com",
    interest: "Commercial",
  })
  assert(res2.status === 201 && res2.data.ok === true, "Valid 10-digit number starting with 7 (7767805544) accepted")

  // Test 3: Invalid start digit (1234567890) -> MUST BE REJECTED
  const res3 = await postJson("/api/inquiries", {
    name: "Invalid User",
    phone: "1234567890",
    interest: "Buy Residential",
  })
  assert(res3.status === 400 && res3.data.ok === false, "Invalid start digit (1234567890) rejected with 400 Bad Request")

  // Test 4: Too short (98765) -> MUST BE REJECTED
  const res4 = await postJson("/api/inquiries", {
    name: "Invalid User",
    phone: "98765",
    interest: "Buy Residential",
  })
  assert(res4.status === 400 && res4.data.ok === false, "Too short number (98765) rejected with 400 Bad Request")

  // Test 5: Too long (98765432101) -> MUST BE REJECTED
  const res5 = await postJson("/api/inquiries", {
    name: "Invalid User",
    phone: "98765432101",
    interest: "Buy Residential",
  })
  assert(res5.status === 400 && res5.data.ok === false, "Too long number (11 digits: 98765432101) rejected with 400")

  // Test 6: Letters in phone (abcdefghij) -> MUST BE REJECTED
  const res6 = await postJson("/api/inquiries", {
    name: "Invalid User",
    phone: "abcdefghij",
    interest: "Buy Residential",
  })
  assert(res6.status === 400 && res6.data.ok === false, "Alphabetic phone (abcdefghij) rejected with 400 Bad Request")

  // Test 7: Country code prefix in phone (+919876543210) -> MUST BE REJECTED (client must separate +91)
  const res7 = await postJson("/api/inquiries", {
    name: "Invalid User",
    phone: "+919876543210",
    interest: "Buy Residential",
  })
  assert(res7.status === 400 && res7.data.ok === false, "Raw +91 prefix in phone input rejected by backend with 400")

  console.log("\n--- 2. Optional Fields & Edge Cases ---")

  // Test 8: Missing email (email is optional)
  const res8 = await postJson("/api/inquiries", {
    name: "Pooja Patil",
    phone: "8888899999",
    interest: "Home Loan",
  })
  assert(res8.status === 201 && res8.data.ok === true, "Enquiry without email is accepted successfully")

  // Test 9: Anti-spam honeypot
  const res9 = await postJson("/api/inquiries", {
    name: "Spam Bot",
    phone: "9999999999",
    interest: "Commercial",
    hp: "http://spamlink.com",
  })
  assert(res9.status === 200 && res9.data.ok === true, "Honeypot trap caught bot submission and neutralized it")

  // Test 10: Missing required name
  const res10 = await postJson("/api/inquiries", {
    name: " ",
    phone: "9876543210",
    interest: "Buy Residential",
  })
  assert(res10.status === 400 && res10.data.ok === false, "Blank name rejected with 400 Bad Request")

  console.log("\n--- 3. Admin Security & Retrieval Tests ---")

  // Test 11: Unauthenticated GET /api/inquiries -> 401
  const unauthRes = await fetch(`${BASE_URL}/api/inquiries`)
  assert(unauthRes.status === 401, "Unauthenticated GET /api/inquiries rejected with 401 Unauthorized")

  // Test 12: Authenticated GET /api/inquiries
  const sessionToken = await createSessionToken("admin", getSessionSecret(), 3600)
  const authRes = await fetch(`${BASE_URL}/api/inquiries`, {
    headers: {
      Cookie: `sbe_admin_session=${sessionToken}`,
    },
  })
  const authData = await authRes.json().catch(() => ({}))
  assert(
    authRes.status === 200 && Array.isArray(authData.inquiries),
    `Authenticated admin received ${authData.inquiries?.length || 0} persistent inquiries`
  )
  const rameshInquiry = authData.inquiries?.find((i) => i.name === "Ramesh Sharma")
  assert(
    rameshInquiry && rameshInquiry.phone === "9876543210" && rameshInquiry.interest === "Buy Residential",
    "Persisted record contains exact customer name, phone, and selected interest"
  )

  // Test 13: Admin retry notification endpoint
  if (rameshInquiry) {
    const retryRes = await fetch(`${BASE_URL}/api/inquiries/${rameshInquiry.id}/retry`, {
      method: "POST",
      headers: {
        Cookie: `sbe_admin_session=${sessionToken}`,
      },
    })
    const retryData = await retryRes.json().catch(() => ({}))
    assert(
      retryRes.status === 400 || retryRes.status === 200,
      `Retry endpoint executed, returned status: ${retryData.notificationStatus || "not_configured"}`
    )
  }

  console.log("\n==================================================================")
  console.log(`  RESULTS: ${passed} Passed, ${failed} Failed`)
  console.log("==================================================================\n")

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err)
  process.exit(1)
})
