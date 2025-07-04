export const formatDate = (
  dateString: string | Date,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateString) return "N/A";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "Invalid date";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString(locale, { ...defaultOptions, ...options });
};
