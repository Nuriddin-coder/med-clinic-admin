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

/**
 * Formats a number or string of digits with space thousands separators:
 * e.g. 200000 -> "200 000"
 * e.g. 23000 -> "23 000"
 * e.g. 1500000 -> "1 500 000"
 */
export const formatNumberWithSpaces = (
  value: number | string | undefined | null
): string => {
  if (value === undefined || value === null || value === '') return '';
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

/**
 * Strips all spaces and non-digits to get raw integer
 */
export const parseNumberFromFormatted = (
  value: number | string | undefined | null
): number => {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  const digits = String(value).replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
};

/**
 * Currency formatter with spaces: e.g. 200000 -> "200 000 so'm"
 */
export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '0 so\'m';
  return `${formatNumberWithSpaces(amount)} so'm`;
};

/**
 * Formats an Uzbek phone number for clean readability:
 * e.g. "+998901234567" or "901234567" -> "+998 90 123 45 67"
 */
export const formatUzbekPhone = (
  value: string | undefined | null
): string => {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 0) return '';

  let rest = digits;
  if (digits.startsWith('998')) {
    rest = digits.slice(3);
  }
  rest = rest.slice(0, 9);

  if (rest.length === 0) return '+998';
  if (rest.length <= 2) return `+998 ${rest}`;
  if (rest.length <= 5) return `+998 ${rest.slice(0, 2)} ${rest.slice(2)}`;
  if (rest.length <= 7)
    return `+998 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
  return `+998 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 7)} ${rest.slice(7)}`;
};

/**
 * Cleans phone number to standard backend format: "+998XXXXXXXXX"
 */
export const toCleanPhone = (value: string | undefined | null): string => {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.startsWith('998')) {
    return `+${digits.slice(0, 12)}`;
  }
  return `+998${digits.slice(0, 9)}`;
};

/**
 * Formats a date string (e.g. "2026-11-10") into "10-Noyabr, 2026"
 */
export const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '—';
  try {
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
