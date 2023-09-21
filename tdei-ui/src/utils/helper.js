export const getUserName = (user, isCurrentUser) => {
  if (!user.first_name && !user.last_name) {
    return `${user.username} ${isCurrentUser ? "(You)" : ""}`;
  }
  return `${user.first_name} ${user.last_name} ${isCurrentUser ? "(You)" : ""}`;
};

// export const syntaxHighlight = (json: ) => {
//   if (typeof json !== 'string') {
//     json = JSON.stringify(json, null, 2);
//   }
//   json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
//   return json.replace(/('(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\'])*'(\\s*:)?)/g, (match: any) => {
//     let cls = 'string';
//     if (/^\d+$/.test(match)) {
//       cls = 'number';
//     } else if (/^true|false$/.test(match)) {
//       cls = 'boolean';
//     } else if (/^null$/.test(match)) {
//       cls = 'null';
//     } else if (/^'.+'$/.test(match)) {
//       cls = 'string';
//     } else if (/^'.+':$/.test(match)) {
//       cls = 'key';
//     }
//     return '<span class="' + cls + '">' + match + '</span>';
//   });
//}