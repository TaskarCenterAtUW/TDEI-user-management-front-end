export const getUserName = (user, isCurrentUser) => {
  if (!user.first_name && !user.last_name) {
    return `${user.username} ${isCurrentUser ? "(me)" : ""}`;
  }
  return `${user.first_name} ${user.last_name} ${isCurrentUser ? "(me)" : ""}`;
};
