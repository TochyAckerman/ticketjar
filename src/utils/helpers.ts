import { format, parseISO } from 'date-fns';
import { DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from './constants';

export const formatDate = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, DATE_FORMAT);
};

export const formatTime = (time: string | Date) => {
  const parsedTime = typeof time === 'string' ? parseISO(time) : time;
  return format(parsedTime, TIME_FORMAT);
};

export const formatDateTime = (datetime: string | Date) => {
  const parsedDateTime = typeof datetime === 'string' ? parseISO(datetime) : datetime;
  return format(parsedDateTime, DATETIME_FORMAT);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumber;
};

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateTicketCode = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const calculateDiscountedPrice = (price: number, discountPercent: number) => {
  return price * (1 - discountPercent / 100);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const groupBy = <T>(array: T[], key: keyof T) => {
  return array.reduce((result, currentValue) => {
    const groupKey = currentValue[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentValue);
    return result;
  }, {} as Record<string, T[]>);
};

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}; 