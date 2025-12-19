import { useCallback, useEffect, useRef } from 'react';
import { Address } from 'viem';
import { addToast } from '@heroui/toast';
import { useConfigStore } from '@/stores/useConfigStore';
import { contractApi } from '@/services';
import InteractionContractABI from '@/contracts/abis/InteractionContract.json';
import { useTranslation } from 'react-i18next';
import { useContractInteraction } from './useContractInteraction';



interface AddSlotParams {
  amount: string; 
  level: number;
  avatarId: number;
  slotCount: number; 
}

interface UseAddSlotOptions {
  
  onSuccess?: () => void;
}

export const useAddSlot = (options: UseAddSlotOptions = {}) => {
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
    operationName: t('slot.addSlot'),
  });

  
  const addSlot = useCallback(
    async ({ amount, level, avatarId, slotCount }: AddSlotParams) => {
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
          slot_count: slotCount.toString(),
          
          action: 'addSlot',
        });

        if (signData.code !== 0 || !signData.data) {
          throw new Error(signData.message || 'Failed to get signature');
        }

        
        await execute(
          signData.data.amount, 
          {
            contractAddress: latestConfig.interactionContractAddress as Address,
            contractAbi: InteractionContractABI as any,
            functionName: 'addSlot',
            args: [
              BigInt(signData.data.amount),       
              BigInt(signData.data.level),        
              BigInt(signData.data.avatar_id),    
              BigInt(signData.data.slot_count),   
              BigInt(signData.data.nonce),
              signData.data.signature as `0x${string}`,
            ],
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
            title: t('slot.addSlotFailed'),
            description: error?.message || t('slot.addSlotFailedDesc'),
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
        title: t('slot.addSlotSuccess'),
        description: t('slot.addSlotSuccessDesc'),
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

    
    addSlot,
    reset,
  };
};
