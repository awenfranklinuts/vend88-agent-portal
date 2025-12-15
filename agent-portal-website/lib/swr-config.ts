import { SWRConfiguration } from 'swr';
import axios from 'axios';

// Custom fetcher for SWR with authentication
export const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    timeout: 10000,
  });
  return response.data;
};

// Global SWR configuration with caching and performance optimizations
export const swrConfig: SWRConfiguration = {
  fetcher,
  // Cache data for 5 minutes
  dedupingInterval: 5 * 60 * 1000,
  // Revalidate on focus after 1 minute
  focusThrottleInterval: 60 * 1000,
  // Keep data in cache even when component unmounts
  keepPreviousData: true,
  // Revalidate when window regains focus
  revalidateOnFocus: true,
  // Revalidate when network reconnects
  revalidateOnReconnect: true,
  // Don't revalidate on mount if data is fresh (less than 5 minutes old)
  revalidateIfStale: false,
  // Retry on error
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 3000,
  // Loading timeout
  loadingTimeout: 5000,
  // Use cache first, then revalidate in background
  compare: (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  },
};

// Prefetch utility for preloading pages
export const prefetchData = async (url: string) => {
  try {
    await fetcher(url);
  } catch (error) {
    console.warn('Prefetch failed for:', url, error);
  }
};
