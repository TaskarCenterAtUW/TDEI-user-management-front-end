import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as referralCodes from "referral-codes";

export const getUserName = (user, isCurrentUser) => {
  if (!user.first_name && !user.last_name) {
    return `${user.username} ${isCurrentUser ? "(You)" : ""}`;
  }
  return `${user.first_name} ${user.last_name ?? ""} ${isCurrentUser ? "(You)" : ""}`;
};

export const toPascalCase = (str) => {
  return str.replace(/(\w)(\w*)/g,
    function (_, firstChar, rest) {
      return firstChar.toUpperCase() + rest.toLowerCase();
    });
};

export const formatDate = (value) => {
  let date = new Date(value);
  const day = date.toLocaleString('default', { day: '2-digit' });
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.toLocaleString('default', { year: 'numeric' });
  return day + ' ' + month + ' ' + year;
}
// To extract link from text and return a link text
export const extractLinks = (text) => {
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
  let lastIndex = 0;
  const elements = [];

  let match;
  while ((match = linkPattern.exec(text)) !== null) {
    const beforeText = text.substring(lastIndex, match.index);
    const label = match[1];
    const url = match[2];
    lastIndex = linkPattern.lastIndex;

    if (beforeText) {
      elements.push(beforeText);
    }

    elements.push(
      <a key={lastIndex} href={url} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
};
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};
export const updatedTime = (time) => {
  const dateTime = new Date(time);

  const optionsDate = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const formattedDate = dateTime.toLocaleDateString('en-US', optionsDate);
  const formattedTime = dateTime.toLocaleTimeString('en-US', optionsTime);

  return `${formattedDate}, ${formattedTime}`;
};

const toApiMDY = (v) => (v ? dayjs(v).format("MM-DD-YYYY") : null);

export const buildApiParams = (p) => ({
  from_date: p.from_date ? toApiMDY(p.from_date) : null,
  to_date: p.to_date ? toApiMDY(p.to_date) : null,
});

dayjs.extend(utc);

/**
 * Generate a short, uppercase, alphanumeric code.
 * Works with: name only, name + one date, or name + both dates.
 *
 * Examples:
 *  genShortCode("Summer Campaign", null, null)          -> SUMM6QK
 *  genShortCode("Summer Campaign", "2025-06-01", null)  -> SUMM25F9P
 *  genShortCode("Summer Campaign", "2025-06-01", "2025-08-31") -> SUMM25286Z2
 */
export function genShortCode(name, validFrom, validTo, opts = {}) {
  const pattern = opts.tokenPattern || "YY";

  // Base from name (first 4 alphanumerics uppercased). Fallback to "REF".
  const base = normalizeName(name) || "REF";

  // Optional date tokens (alphanumeric only)
  const fromTok = tokenFromDate(validFrom, pattern);
  const toTok = tokenFromDate(validTo, pattern);

  // Stable 3-char hash from whatever inputs are present
  const fp = `${base}|${ymd(validFrom)}|${ymd(validTo)}`;
  const suffix = hash3(fp);

  // Compose:
  // - no dates:          BASE + hash   => SUMM6QK
  // - 1 date:            BASE + F + hash   => SUMM25F9P
  // - 2 dates:           BASE + F + T + hash => SUMM25286Z2
  const middle =
    fromTok && toTok ? `${fromTok}${toTok}` :
      fromTok || toTok ? `${fromTok || toTok}` :
        "";

  return `${base}${middle}${suffix}`;
}

// -------- helpers --------

function normalizeName(name) {
  if (!name) return "";
  // keep letters/numbers only, take first 4, uppercase
  const cleaned = String(name).replace(/[^a-zA-Z0-9]/g, "");
  return cleaned.substring(0, 4).toUpperCase();
}

function tokenFromDate(d, pattern) {
  if (!d) return "";
  const m = dayjs(d);
  return m.isValid() ? m.utc().format(pattern).replace(/[^A-Za-z0-9]/g, "") : "";
}

function ymd(d) {
  if (!d) return "";
  const m = dayjs(d);
  return m.isValid() ? m.utc().format("YYYY-MM-DD") : "";
}

// Stable 3-char hash from a string (0–9 A–Z)
function hash3(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // map to 3 base36 chars
  const n = (h >>> 0).toString(36).toUpperCase();
  return (n.length >= 3 ? n.slice(-3) : n.padStart(3, "0"));
}

export const SHOW_REFERRALS = true; // flip later to true

export function saveAuthTokensFromPromo(tokenObj) {
  if (!tokenObj) return;
  localStorage.setItem("accessToken", tokenObj.access_token || "");
  localStorage.setItem("refreshToken", tokenObj.refresh_token || "");
  window.dispatchEvent(new Event("tokenRefreshed"));
}

// -------- New Referral Code Logic --------

/**
 * Extract 3-4 char initials from Project Group Name.
 * Logic:
 *  - Split by spaces
 *  - Take first char of each word
 *  - Join and uppercase
 *  - If only 1 word, take first 4 chars
 *  - Max 4 chars
 */
export function getProjectGroupInitials(pgName) {
  if (!pgName) return "PROJ";
  const cleaned = pgName.trim();
  const words = cleaned.split(/\s+/);

  if (words.length === 1) {
    return cleaned.substring(0, 4).toUpperCase();
  }

  // Take first char of each word
  let initials = words.map(w => w[0]).join("");
  return initials.substring(0, 4).toUpperCase();
}

/**
 * Generate Name Token (max 5 chars) based on Rule A/B.
 * Output: Name token up to 5 chars.
 */
export function getNameToken(name) {
  if (!name) return "NAME";
  const trimmed = name.trim();

  // Rule A: Multiple words
  if (/\s/.test(trimmed)) {
    const words = trimmed.split(/\s+/);
    let token = "";
    for (const w of words) {
      if (token.length >= 5) break;
      token += w[0];
    }
    // "If fewer than 5 initials exist, keep as-is"
    return token.toUpperCase();
  }

  // Rule B: Single word
  // remove non-letters just to be safe? spec says "Use the word as letters only"
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");

  if (letters.length <= 5) {
    return letters.toUpperCase();
  }

  // Length > 5: Remove vowels from end moving left
  const vowels = /[AEIOUaeiou]/;
  let arr = letters.split("");

  // Loop backwards to find vowels and remove them until length <= 5
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr.length <= 5) break;
    if (vowels.test(arr[i])) {
      arr.splice(i, 1);
    }
  }

  let result = arr.join("");
  // If still > 5, take first 5
  if (result.length > 5) {
    result = result.substring(0, 5);
  }

  return result.toUpperCase();
}

/**
 * Generates a full referral code candidate.
 * Format: <PG_Prefix_4>-<Promo3>-<Name_4>-<Type_1><Redirect_1>
 */
export function generateCandidateCode(projectName, userName, type, redirectOption) {
  const pgPrefix = getProjectGroupInitials(projectName);

  // Promo3: 3-character promo segment via referral-codes
  const [promo3] = referralCodes.generate({
    length: 3,
    count: 1,
    charset: referralCodes.charset("alphanumeric")
  });

  const nameToken = getNameToken(userName);
  const name4 = nameToken.substring(0, 4); // "Use the first 4 characters of this token"

  // Type_1: C (Campaign) or I (Invite)
  const type1 = (type === "campaign") ? "C" : "I";

  // Redirect_1
  // W (Workspaces) / C (Custom URL) / A (AVIV Scout Route App)
  let redirect1 = "A"; // default
  if (redirectOption === "workspace") redirect1 = "W";
  else if (redirectOption === "custom") redirect1 = "C";
  else if (redirectOption === "aviv") redirect1 = "A";

  return `${pgPrefix}-${promo3}-${name4}-${type1}${redirect1}`.toUpperCase();
}