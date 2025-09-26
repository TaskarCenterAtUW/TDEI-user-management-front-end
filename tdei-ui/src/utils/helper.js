import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export const getUserName = (user, isCurrentUser) => {
  if (!user.first_name && !user.last_name) {
    return `${user.username} ${isCurrentUser ? "(You)" : ""}`;
  }
  return `${user.first_name} ${user.last_name ?? ""} ${isCurrentUser ? "(You)" : ""}`;
};

export const toPascalCase = (str) => {
  return str.replace(/(\w)(\w*)/g,
  function(_, firstChar, rest) {
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

const normalizeName = (name) =>
  (name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "")
    .slice(0, 4)
    .toUpperCase()
    .padEnd(4, "X");

const ymd = (v) => {
  const d = dayjs(v);
  return d.isValid() ? d.utc().format("YYYY-MM-DD") : "";
};

//3-char hash
const hash3 = (s) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 3; i++) out += alphabet[(h >>> (i * 7)) % alphabet.length];
  return out;
};

/**
 * genShortCode
 * @param {string} name
 * @param {string|Date} validFrom  (ISO string or Date)
 * @param {string|Date} validTo    (ISO string or Date)
 * @param {object} opts
 * @param {string} opts.tokenPattern Dayjs format for the visible date token.
 */
export const genShortCode = (name, validFrom, validTo, opts = {}) => {
  const pattern = opts.tokenPattern || "YY";
  const n = normalizeName(name);

  const from = dayjs(validFrom);
  const to = dayjs(validTo);

  if (!n || !from.isValid() || !to.isValid()) return "";

  const fromTok = from.utc().format(pattern);
  const toTok = to.utc().format(pattern);

  const fp = `${n}|${ymd(validFrom)}|${ymd(validTo)}`;
  return `${n}${fromTok}${toTok}${hash3(fp)}`;
};