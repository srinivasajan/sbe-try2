/**
 * Server-side persistent storage for inquiries.
 * Supports Upstash Redis when configured, with a resilient local JSON file fallback.
 */

import fs from "fs"
import path from "path"
import { Redis } from "@upstash/redis"
import type { Inquiry } from "./admin-store"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "inquiries.json")
const REDIS_KEY = "sbe:inquiries:list"

let memoryCache: Inquiry[] | null = null
let redisClient: Redis | null = null

function getRedis(): Redis | null {
  if (redisClient) return redisClient
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    try {
      redisClient = new Redis({ url, token })
      return redisClient
    } catch (err) {
      console.warn("[ServerInquiries] Failed to initialize Redis:", err)
      return null
    }
  }
  return null
}

async function ensureFileStorage(): Promise<void> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf-8")
    }
  } catch (err) {
    console.warn("[ServerInquiries] Could not create data directory/file:", err)
  }
}

async function readFileStorage(): Promise<Inquiry[]> {
  try {
    await ensureFileStorage()
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (err) {
    console.warn("[ServerInquiries] Failed to read from file storage:", err)
  }
  return []
}

async function writeFileStorage(inquiries: Inquiry[]): Promise<void> {
  try {
    await ensureFileStorage()
    fs.writeFileSync(DATA_FILE, JSON.stringify(inquiries, null, 2), "utf-8")
  } catch (err) {
    console.warn("[ServerInquiries] Failed to write to file storage:", err)
  }
}

/**
 * Retrieves all inquiries ordered newest first.
 */
export async function getServerInquiries(): Promise<Inquiry[]> {
  const redis = getRedis()
  if (redis) {
    try {
      const data = await redis.get<Inquiry[]>(REDIS_KEY)
      if (Array.isArray(data)) {
        memoryCache = data
        return data
      }
    } catch (err) {
      console.warn("[ServerInquiries] Redis read error, falling back to disk:", err)
    }
  }

  const fromDisk = await readFileStorage()
  memoryCache = fromDisk
  return fromDisk
}

/**
 * Persists an inquiry record securely on the backend.
 */
export async function saveServerInquiry(payload: {
  name: string
  phone: string
  email?: string
  interest: string
  message?: string
  source?: string
  notificationStatus?: "sent" | "failed" | "not_configured"
  notificationError?: string
  notificationSentAt?: string
}): Promise<Inquiry> {
  const current = await getServerInquiries()

  const nextId =
    current.length > 0 ? Math.max(...current.map((i) => (typeof i.id === "number" ? i.id : 0))) + 1 : 1

  const now = new Date()

  const newInquiry: Inquiry = {
    id: nextId,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email?.trim() || "",
    interest: payload.interest.trim(),
    message: payload.message?.trim() || "General enquiry.",
    status: "new",
    date: now.toISOString(),
    source: payload.source || "Contact Us",
    notificationStatus: payload.notificationStatus || "not_configured",
    notificationError: payload.notificationError,
    notificationSentAt: payload.notificationSentAt,
    createdAt: now.toISOString(),
  }

  const updated = [newInquiry, ...current]
  memoryCache = updated

  // Write to disk
  await writeFileStorage(updated)

  // Write to Redis if available
  const redis = getRedis()
  if (redis) {
    try {
      await redis.set(REDIS_KEY, updated)
    } catch (err) {
      console.warn("[ServerInquiries] Redis write error:", err)
    }
  }

  return newInquiry
}

/**
 * Retrieves a single inquiry by ID.
 */
export async function getServerInquiryById(id: number): Promise<Inquiry | null> {
  const current = await getServerInquiries()
  return current.find((i) => i.id === id) || null
}

/**
 * Updates the administrative status of an inquiry.
 */
export async function updateServerInquiryStatus(
  id: number,
  status: Inquiry["status"]
): Promise<Inquiry | null> {
  const current = await getServerInquiries()
  const idx = current.findIndex((i) => i.id === id)
  if (idx < 0) return null

  current[idx] = { ...current[idx], status }
  memoryCache = current

  await writeFileStorage(current)

  const redis = getRedis()
  if (redis) {
    try {
      await redis.set(REDIS_KEY, current)
    } catch (err) {
      console.warn("[ServerInquiries] Redis status update error:", err)
    }
  }

  return current[idx]
}

/**
 * Updates notification delivery status for an existing inquiry.
 */
export async function updateServerInquiryNotification(
  id: number,
  notification: {
    status: "sent" | "failed" | "not_configured"
    error?: string
    sentAt?: string
  }
): Promise<Inquiry | null> {
  const current = await getServerInquiries()
  const idx = current.findIndex((i) => i.id === id)
  if (idx < 0) return null

  current[idx] = {
    ...current[idx],
    notificationStatus: notification.status,
    notificationError: notification.error,
    notificationSentAt: notification.sentAt,
  }
  memoryCache = current

  await writeFileStorage(current)

  const redis = getRedis()
  if (redis) {
    try {
      await redis.set(REDIS_KEY, current)
    } catch (err) {
      console.warn("[ServerInquiries] Redis notification update error:", err)
    }
  }

  return current[idx]
}

/**
 * Deletes an inquiry by ID.
 */
export async function deleteServerInquiry(id: number): Promise<boolean> {
  const current = await getServerInquiries()
  const filtered = current.filter((i) => i.id !== id)
  if (filtered.length === current.length) return false

  memoryCache = filtered
  await writeFileStorage(filtered)

  const redis = getRedis()
  if (redis) {
    try {
      await redis.set(REDIS_KEY, filtered)
    } catch (err) {
      console.warn("[ServerInquiries] Redis delete error:", err)
    }
  }

  return true
}
