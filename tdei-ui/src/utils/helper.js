export const getUserName = (user, isCurrentUser) => {
  if (!user.first_name && !user.last_name) {
    return `${user.username} ${isCurrentUser ? "(You)" : ""}`;
  }
  return `${user.first_name} ${user.last_name} ${isCurrentUser ? "(You)" : ""}`;
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