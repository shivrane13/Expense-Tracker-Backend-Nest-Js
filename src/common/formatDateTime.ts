export function formatDateTime(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (targetDate.getTime() === today.getTime()) {
    return `Today ${time}`;
  }

  if (targetDate.getTime() === yesterday.getTime()) {
    return `Yesterday ${time}`;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
