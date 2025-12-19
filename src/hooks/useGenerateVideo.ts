import { useCallback, useEffect, useRef } from 'react';
import { Address } from 'viem';
import { addToast } from '@heroui/toast';
import { useConfigStore } from '@/stores/useConfigStore';
import { contractApi } from '@/services';
import InteractionContractABI from '@/contracts/abis/InteractionContract.json';
import { useTranslation } from 'react-i18next';
import { useContractInteraction } from './useContractInteraction';



interface GenerateVideoParams {
  amount: string; 
  slotId: number;
  avatarId: number;
  level: number; 
}

interface UseGenerateVideoOptions {
  
  onSuccess?: () => void;
}

export const useGenerateVideo = (options: UseGenerateVideoOptions = {}) => {
  const { onSuccess } = options;
  const { t } = useTranslation();
  const { appConfig, fetchAppConfig } = useConfigStore();

  
  const hasCalledSuccessRef = useRef(false);

  const {
    isProcessing,
    currentStep,
    isTransactionSuccess,
    address,
    transactionHash,
    execute,
    reset,
  } = useContractInteraction({
    requireApproval: false, 
    operationName: t('video.generateVideo'),
  });

  
  const generateVideo = useCallback(
    async ({ amount, slotId, avatarId, level }: GenerateVideoParams) => {
      if (!appConfig) {
        addToast({
          title: t('shoppingMall.walletNotConnected'),
          description: t('shoppingMall.walletNotConnectedDesc'),
          color: 'warning',
          severity: 'warning',
        });
        return;
      }

      try {
        
        await fetchAppConfig();

        
        const latestConfig = useConfigStore.getState().appConfig;
        if (!latestConfig) {
          throw new Error('Failed to fetch latest config');
        }

        
        const signData = await contractApi.getInteractionSign({
          user: address!,
          amount,
          level: level.toString(), 
          slot_id: slotId.toString(),
          avatar_id: avatarId.toString(),
          
          action: 'generateVideo',
        });

        if (signData.code !== 0 || !signData.data) {
          throw new Error(signData.message || 'Failed to get signature');
        }

        
        await execute(
          '0', 
          {
            contractAddress: latestConfig.interactionContractAddress as Address,
            contractAbi: InteractionContractABI as any,
            functionName: 'generateVideo',
            args: [
              BigInt(signData.data.slot_id!),
              BigInt(signData.data.avatar_id!),
              BigInt(signData.data.nonce),
              signData.data.signature as `0x${string}`,
            ],
            value: BigInt(signData.data.amount), 
          }
        );
      } catch (error: any) {
        const isSignatureOrConfigError =
          error?.message?.includes('Failed to get signature') ||
          error?.message?.includes('Failed to fetch latest config') ||
          error?.message?.includes('business validation failed') ||
          error?.message?.includes('level does not match');

        if (isSignatureOrConfigError) {
          addToast({
            title: t('video.generateVideoFailed'),
            description: error?.message || t('video.generateVideoFailedDesc'),
            color: 'danger',
            severity: 'danger',
          });
        }

        
        throw error;
      }
    },
    [address, appConfig, execute, t]
  );

  
  useEffect(() => {
    if (isTransactionSuccess && !hasCalledSuccessRef.current) {
      hasCalledSuccessRef.current = true;

      addToast({
        title: t('video.generateVideoSuccess'),
        description: t('video.generateVideoSuccessDesc'),
        color: 'success',
        severity: 'success',
      });

      
      if (onSuccess) {
        onSuccess();
      }

      
      setTimeout(() => {
        reset();
        hasCalledSuccessRef.current = false;
      }, 100);
    }
  }, [isTransactionSuccess, onSuccess, reset, t]);

  return {
    
    isProcessing,
    currentStep,
    isTransactionSuccess,

    
    transactionHash,

    
    generateVideo,
    reset,
  };
};
