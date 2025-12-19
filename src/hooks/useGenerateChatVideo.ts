import { useCallback, useEffect, useRef } from 'react';
import { Address } from 'viem';
import { addToast } from '@heroui/toast';
import { useConfigStore } from '@/stores/useConfigStore';
import { contractApi } from '@/services';
import InteractionContractABI from '@/contracts/abis/InteractionContract.json';
import { useTranslation } from 'react-i18next';
import { useContractInteraction } from './useContractInteraction';



interface GenerateChatVideoParams {
  amount: string; 
  slotId: number;
  avatarId: number;
  level: number; 
  recordId: string; 
}

interface UseGenerateChatVideoOptions {
  
  onSuccess?: () => void;
}

export const useGenerateChatVideo = (options: UseGenerateChatVideoOptions = {}) => {
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
    operationName: t('video.generateChatVideo'),
  });

  
  const generateChatVideo = useCallback(
    async ({ amount, avatarId, level, recordId }: GenerateChatVideoParams) => {
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
          avatar_id: avatarId.toString(),
          record_id: recordId,
          
          action: 'generateChatVideo',
        });

        if (signData.code !== 0 || !signData.data) {
          throw new Error(signData.message || 'Failed to get signature');
        }

        
        await execute(
          '0', 
          {
            contractAddress: latestConfig.interactionContractAddress as Address,
            contractAbi: InteractionContractABI as any,
            functionName: 'generateChatVideo',
            args: [
              BigInt(signData.data.record_id!),
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
            title: t('video.generateChatVideoFailed'),
            description: error?.message || t('video.generateChatVideoFailedDesc'),
            color: 'danger',
            severity: 'danger',
          });
        }

        
        throw error;
      }
    },
    [address, appConfig, execute, t, fetchAppConfig]
  );

  
  useEffect(() => {
    if (isTransactionSuccess && !hasCalledSuccessRef.current) {
      hasCalledSuccessRef.current = true;

      addToast({
        title: t('video.generateChatVideoSuccess'),
        description: t('video.generateChatVideoSuccessDesc'),
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

    
    generateChatVideo,
    reset,
  };
};
