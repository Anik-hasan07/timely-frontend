function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string?.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export const stringAvatar = (name, sx = {}) => {
  const splitName = name?.split(' ');
  return {
    sx: { bgcolor: stringToColor(name), ...sx },
    children: splitName
      ? ` ${splitName[0].charAt(0)}${
          splitName?.length > 1 ? splitName[splitName.length - 1].charAt(0) : ''
        }`
      : '',
  };
};
