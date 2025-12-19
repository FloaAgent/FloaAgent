import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  configApi,
  type AppConfigResponse,
  type DigitalHumanLevelConfig,
  type TrainingTicketConfig,
} from '@/services';

interface ConfigState {
  
  appConfig: AppConfigResponse | null;
  isLoading: boolean;
  lastFetchTime: number | null;
  isPageRefreshed: boolean; 

  
  setAppConfig: (config: AppConfigResponse) => void;
  setLoading: (loading: boolean) => void;
  setPageRefreshed: (refreshed: boolean) => void;
  fetchAppConfig: (forceRefresh?: boolean) => Promise<void>;
  getDigitalHumanLevelConfig: (level: number) => DigitalHumanLevelConfig | null;
  getTrainingTicketConfig: (level: number) => TrainingTicketConfig | null;
  reset: () => void;
}


const CACHE_DURATION = 1 * 60 * 1000;

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      appConfig: null,
      isLoading: false,
      lastFetchTime: null,
      isPageRefreshed: true, 

      setAppConfig: (config) =>
        set({
          appConfig: config,
          lastFetchTime: Date.now(),
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setPageRefreshed: (refreshed) => set({ isPageRefreshed: refreshed }),

      
      fetchAppConfig: async (forceRefresh = false) => {
        const { appConfig, lastFetchTime, isLoading, isPageRefreshed } = get();

        
        if (isLoading) {
          return;
        }

        
        if (isPageRefreshed) {
          forceRefresh = true;
          set({ isPageRefreshed: false }); 
        }

        
        const now = Date.now();
        const isCacheValid =
          !forceRefresh &&
          appConfig &&
          lastFetchTime &&
          now - lastFetchTime < CACHE_DURATION;

        if (isCacheValid) {
          
          return;
        }

        try {
          set({ isLoading: true });

          const response = await configApi.getAppConfig();

          if (response.code === 0 && response.data) {
            set({
              appConfig: response.data,
              lastFetchTime: Date.now(),
            });
          } else {
            throw new Error(response.message || '获取配置失败');
          }
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      
      getDigitalHumanLevelConfig: (level: number) => {
        const { appConfig } = get();
        if (!appConfig) return null;

        return (
          appConfig.digitalHumanLevelConfig.find(
            (config) => config.level === level
          ) || null
        );
      },

      
      getTrainingTicketConfig: (level: number) => {
        const { appConfig } = get();
        if (!appConfig) return null;

        return (
          appConfig.trainingTicketConfig.find(
            (config) => config.level === level
          ) || null
        );
      },

      reset: () =>
        set({
          appConfig: null,
          isLoading: false,
          lastFetchTime: null,
          isPageRefreshed: true,
        }),
    }),
    {
      name: 'config-storage',
      partialize: (state) => ({
        appConfig: state.appConfig,
        lastFetchTime: state.lastFetchTime,
        
      }),
    }
  )
);
