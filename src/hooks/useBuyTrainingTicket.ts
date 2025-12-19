import { useCallback, useEffect, useRef } from 'react';
import { Address } from 'viem';
import { addToast } from '@heroui/toast';
import { useConfigStore } from '@/stores/useConfigStore';
import { contractApi } from '@/services';
import InteractionContractABI from '@/contracts/abis/InteractionContract.json';
import { useTranslation } from 'react-i18next';
import { useContractInteraction } from './useContractInteraction';



interface BuyTrainingTicketParams {
  amount: string; 
  level: number;
  referrer?: Address;
}

interface UseBuyTrainingTicketOptions {
  
  onSuccess?: () => void;
}

export const useBuyTrainingTicket = (options: UseBuyTrainingTicketOptions = {}) => {
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
    operationName: t('shoppingMall.buyTrainingTicket'),
  });

  
  const buyTrainingTicket = useCallback(
    async ({ amount, level, referrer }: BuyTrainingTicketParams) => {
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
          
          action: 'buyTrainingTicket',
        });

        if (signData.code !== 0 || !signData.data) {
          throw new Error(signData.message || 'Failed to get signature');
        }

        
        await execute(
          signData.data.amount,
          {
            contractAddress: latestConfig.interactionContractAddress as Address,
            contractAbi: InteractionContractABI as any,
            functionName: 'buyTrainingTicket',
            args: [
              BigInt(signData.data.amount),
              BigInt(signData.data.level),
              signData.data.referrer,
              BigInt(signData.data.nonce),
              signData.data.signature as `0x${string}`,
            ],
          }
        );
      } catch (error: any) {
        addToast({
          title: t('shoppingMall.purchaseFailed'),
          description: error?.message || t('shoppingMall.purchaseFailedDesc'),
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
        title: t('shoppingMall.purchaseSuccess'),
        description: t('shoppingMall.purchaseSuccessDesc'),
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

    
    buyTrainingTicket,
    reset,
  };
};
