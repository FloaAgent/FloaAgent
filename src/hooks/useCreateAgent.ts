import { useCallback, useEffect, useRef } from 'react';
import { Address } from 'viem';
import { addToast } from '@heroui/toast';
import { useConfigStore } from '@/stores/useConfigStore';
import { contractApi } from '@/services';
import InteractionContractABI from '@/contracts/abis/InteractionContract.json';
import { useTranslation } from 'react-i18next';
import { useContractInteraction } from './useContractInteraction';



interface CreateAvatarParams {
  amount: string; 
  level: number;
  avatarId: number;
}

interface UseCreateAvatarOptions {
  
  onSuccess?: () => void;
}

export const useCreateAgent = (options: UseCreateAvatarOptions = {}) => {
  const { onSuccess } = options;
  const { t } = useTranslation();
  const { appConfig, fetchAppConfig } = useConfigStore();

  
  const hasCalledSuccessRef = useRef(false);

  const {
    isProcessing,
    currentStep,
    allowance,
    isTransactionSuccess,
    address,
    approveHash,
    transactionHash,
    execute,
    reset,
  } = useContractInteraction({
    requireApproval: true,
    approvalTimeout: 30000,
    operationName: t('createAgent.createAvatar'),
  });

  
  const createAvatar = useCallback(
    async ({ amount, level, avatarId }: CreateAvatarParams) => {
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
          
          action: 'createAvatar',
        });

        if (signData.code !== 0 || !signData.data) {
          throw new Error(signData.message || 'Failed to get signature');
        }

        
        await execute(
          signData.data.amount,
          {
            contractAddress: latestConfig.interactionContractAddress as Address,
            contractAbi: InteractionContractABI as any,
            functionName: 'createAvatar',
            args: [
              BigInt(signData.data.amount),
              BigInt(signData.data.level),
              BigInt(signData.data.avatar_id),
              BigInt(signData.data.nonce),
              signData.data.signature as `0x${string}`,
            ],
          }
        );
      } catch (error: any) {
        addToast({
          title: t('createAgent.createFailed'),
          description: error?.message || t('createAgent.createFailedDesc'),
          color: 'danger',
          severity: 'danger',
        });
      }
    },
    [address, appConfig, execute, onSuccess, t]
  );

  
  useEffect(() => {
    if (isTransactionSuccess && !hasCalledSuccessRef.current) {
      hasCalledSuccessRef.current = true;

      addToast({
        title: t('createAgent.paymentSuccess'),
        description: t('createAgent.paymentSuccessDesc'),
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
    allowance,
    isTransactionSuccess,

    
    approveHash,
    transactionHash,

    
    createAvatar,
    reset,
  };
};