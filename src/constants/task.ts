export const TASK_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  SUCCESS: 2,
  FAILED: 3,
  QUEUED: 9999,
} as const;

export const POLLING_CONFIG = {
  BASE_INTERVAL: 10000,

  INTERVALS: {
    SINGLE: 5000,
    FEW: 8000,
    MANY: 10000,
  },

  MAX_DURATION: 10 * 60 * 1000,

  MAX_RETRIES: 3,
  RETRY_DELAY_BASE: 1000,
} as const;

export const getPollingInterval = (generatingCount: number): number | null => {
  if (generatingCount === 0) return null;
  if (generatingCount === 1) return POLLING_CONFIG.INTERVALS.SINGLE;
  if (generatingCount <= 3) return POLLING_CONFIG.INTERVALS.FEW;
  return POLLING_CONFIG.INTERVALS.MANY;
};
