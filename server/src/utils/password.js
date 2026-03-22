import crypto from "node:crypto";

const KEY_LENGTH = 64;
const PASSWORD_DELIMITER = ":";

function normalizePassword(password) {
  return String(password || "");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function hashPassword(password) {
  const normalizedPassword = normalizePassword(password);
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(normalizedPassword, salt, KEY_LENGTH).toString("hex");

  return `${salt}${PASSWORD_DELIMITER}${hash}`;
}

export function verifyPassword(password, storedPassword) {
  const normalizedPassword = normalizePassword(password);
  const normalizedStoredPassword = normalizePassword(storedPassword);

  if (!normalizedStoredPassword) {
    return {
      isValid: false,
      needsUpgrade: false
    };
  }

  if (!normalizedStoredPassword.includes(PASSWORD_DELIMITER)) {
    const isValid = safeEqual(normalizedPassword, normalizedStoredPassword);

    return {
      isValid,
      needsUpgrade: isValid
    };
  }

  const [salt, storedHash] = normalizedStoredPassword.split(PASSWORD_DELIMITER);
  const computedHash = crypto.scryptSync(normalizedPassword, salt, KEY_LENGTH).toString("hex");

  return {
    isValid: safeEqual(computedHash, storedHash),
    needsUpgrade: false
  };
}
