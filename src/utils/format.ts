export const UZ_MONTHS = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
];

export const UZ_WEEKDAYS = [
  'Yakshanba',
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
];

export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '0 so\'m';
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
};

/**
 * Formats a date string (e.g. "2026-11-10") into "10-Noyabr, 2026"
 */
export const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '—';
  try {
    // If format is YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      const monthIdx = parseInt(month, 10) - 1;
      const monthName = UZ_MONTHS[monthIdx] || month;
      return `${parseInt(day, 10)}-${monthName}, ${year}`;
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = UZ_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}, ${year}`;
  } catch {
    return dateStr;
  }
};

/**
 * Formats a date string into "10-Noyabr, 2026, 14:30"
 */
export const formatDateTime = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = UZ_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}-${month}, ${year}, ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
};

/**
 * Formats today's date for Header: "28-Oktabr, 2026 (Chorshanba)"
 */
export const formatHeaderDate = (d = new Date()): string => {
  const day = d.getDate();
  const month = UZ_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const weekday = UZ_WEEKDAYS[d.getDay()];
  return `${day}-${month}, ${year} (${weekday})`;
};
