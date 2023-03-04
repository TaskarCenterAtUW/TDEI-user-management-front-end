export const getUserName = (user) => {
  if (!user.first_name && !user.last_name) {
    return user.username;
  }
  return `${user.first_name} ${user.last_name}`;
};
