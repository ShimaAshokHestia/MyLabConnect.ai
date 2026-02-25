// src/Services/Common/KiduSecureStorage.ts
//
// ─── KiduSecureStorage ────────────────────────────────────────────────────────
// AES-GCM 256-bit encryption for localStorage via the Web Crypto API.
// No third-party libraries required.
// ─────────────────────────────────────────────────────────────────────────────

const PASSPHRASE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_STORAGE_SECRET) ||
  'kidu-secure-storage-default-key-2024';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// ── Fix: convert Uint8Array → base64 without spread (avoids TS2322) ──────────
function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// ── Fix: explicitly return ArrayBuffer (satisfies BufferSource) ───────────────
function fromBase64(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer; // ✅ cast to ArrayBuffer, not Uint8Array
}

// ── Derived key cache (runs PBKDF2 once per session) ─────────────────────────
let _cachedKey: CryptoKey | null = null;

async function getDerivedKey(): Promise<CryptoKey> {
  if (_cachedKey) return _cachedKey;

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(PASSPHRASE),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  _cachedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('kidu-pbkdf2-salt'),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return _cachedKey;
}

// ── Encrypt ───────────────────────────────────────────────────────────────────
async function encrypt(value: unknown): Promise<string> {
  const key = await getDerivedKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },           // ✅ Uint8Array is valid for iv
    key,
    encoder.encode(JSON.stringify(value))
  );

  // Store as "base64(iv):base64(ciphertext)"
  return `${toBase64(iv.buffer as ArrayBuffer)}:${toBase64(cipherBuffer)}`;
}

// ── Decrypt ───────────────────────────────────────────────────────────────────
async function decrypt<T = unknown>(stored: string): Promise<T | null> {
  try {
    const colonIndex = stored.indexOf(':');
    if (colonIndex === -1) return null;

    const ivB64     = stored.slice(0, colonIndex);
    const cipherB64 = stored.slice(colonIndex + 1);

    const key          = await getDerivedKey();
    const iv           = fromBase64(ivB64);      // ✅ now ArrayBuffer
    const cipherBuffer = fromBase64(cipherB64);  // ✅ now ArrayBuffer

    const plainBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherBuffer
    );

    return JSON.parse(decoder.decode(plainBuffer)) as T;
  } catch {
    // Wrong key, corrupted data, or unencrypted legacy value
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
const KiduSecureStorage = {
  /** Encrypts value and writes to localStorage. */
  async setItem(key: string, value: unknown): Promise<void> {
    localStorage.setItem(key, await encrypt(value));
  },

  /** Reads from localStorage and decrypts. Returns null if missing or corrupt. */
  async getItem<T = unknown>(key: string): Promise<T | null> {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    return decrypt<T>(stored);
  },

  /** Removes a single key from localStorage. */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  /** Clears all localStorage entries. */
  clear(): void {
    localStorage.clear();
  },
};

export default KiduSecureStorage;