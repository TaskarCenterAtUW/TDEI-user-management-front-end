const DURATION_UNITS = [
  { key: "days", singular: "day", plural: "days" },
  { key: "hours", singular: "hr", plural: "hrs" },
  { key: "minutes", singular: "min", plural: "mins" },
  { key: "seconds", singular: "sec", plural: "secs" },
];

export const formatJobDuration = (duration) => {
  const durationParts = DURATION_UNITS.map(({ key, singular, plural }) => {
    const value = Math.floor(duration[key] || 0);

    return `${value} ${value === 1 ? singular : plural}`;
  });
  const firstNonZeroPart = DURATION_UNITS.findIndex(
    ({ key }) => Math.floor(duration[key] || 0) > 0
  );

  if (firstNonZeroPart === -1) {
    return durationParts[durationParts.length - 1];
  }

  return DURATION_UNITS.map(({ key }, index) => ({
    index,
    value: Math.floor(duration[key] || 0),
  }))
    .filter(({ index, value }) => index >= firstNonZeroPart && value > 0)
    .slice(0, 2)
    .map(({ index }) => durationParts[index])
    .join(" ");
};
