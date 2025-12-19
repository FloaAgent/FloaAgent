import { useCallback, useEffect, useRef } from 'react';
import { Address } from 'viem';
import { addToast } from '@heroui/toast';
import { useConfigStore } from '@/stores/useConfigStore';
import { contractApi } from '@/services';
import AvatarManagementContractABI from '@/contracts/abis/AvatarManagementContract.json';
import { useTranslation } from 'react-i18next';
import { useContractInteraction } from './useContractInteraction';




interface CertifyAvatarParams {
  amount: string; 
  avatarId: number;
}


interface RenameAvatarParams {
  amount: string; 
  avatarId: number;
  newName: string;
}


interface ChangeVoiceModelParams {
  amount: string; 
  avatarId: number;
  newModelName: string;
}


interface DeleteSlotParams {
  amount: string; 
  avatarId: number;
  slotId: number;
}

interface UseAvatarManagementOptions {
  
  onSuccess?: () => void;
}

export const useAvatarManagement = (options: UseAvatarManagementOptions = {}) => {
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
    operationName: t('avatarManagement.operation'),
    spenderAddress: appConfig?.avatarManagementContractAddress,
    tokenAddress: appConfig?.interactionTokenAddress,
  });

  
  const certifyAvatar = useCallback(
    async ({ amount, avatarId }: CertifyAvatarParams) => {
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

        
        const signData = await contractApi.getAvatarManagementSign({
          user: address!,
          amount,
          avatar_id: avatarId.toString(),
          action: 'certifyAvatar',
        });

        if (signData.code !== 0 || !signData.data) {
          throw new Error(signData.message || 'Failed to get signature');
        }

        
        await execute(
          signData.data.amount,
          {
            contractAddress: latestConfig.avatarManagementContractAddress as Address,
            contractAbi: AvatarManagementContractABI as any,
            functionName: 'certifyAvatar',
            args: [
              BigInt(signData.data.amount),
              BigInt(signData.data.avatar_id),
              BigInt(signData.data.nonce),
              signData.data.signature as `0x${string}`,
            ],
          }
        );
      } catch (error: any) {
        addToast({
          title: t('avatarManagement.certifyFailed'),
          description: error?.message || t('avatarManagement.certifyFailedDesc'),
          color: 'danger',
          severity: 'danger',
        });
      }
    },
    [address, appConfig, execute, fetchAppConfig, t]
  );

  
  const renameAvatar = useCallback(
    async ({ amount, avatarId, newName }: RenameAvatarParams) => {
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

        
        const signData = await contractApi.getAvatarManagementSign({
          user: address!,
          amount,
          avatar_id: avatarId.toString(),
          action: 'renameAvatar',
          new_name: newName,
        });

        if (signData.code !== 0 || !signData.data) {
          throw new Error(signData.message || 'Failed to get signature');
        }

        
        await execute(
          signData.data.amount,
          {
            contractAddress: latestConfig.avatarManagementContractAddress as Address,
            contractAbi: AvatarManagementContractABI as any,
            functionName: 'renameAvatar',
            args: [
              BigInt(signData.data.amount),
              BigInt(signData.data.avatar_id),
              signData.data.new_name || newName,
              BigInt(signData.data.nonce),
              signData.data.signature as `0x${string}`,
            ],
          }
        );
      } catch (error: any) {
        addToast({
          title: t('avatarManagement.renameFailed'),
          description: error?.message || t('avatarManagement.renameFailedDesc'),
          color: 'danger',
          severity: 'danger',
        });
      }
    },
    [address, appConfig, execute, fetchAppConfig, t]
  );

  
  const changeVoiceModel = useCallback(
    async ({ amount, avatarId, newModelName }: ChangeVoiceModelParams) => {
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

        
        const signData = await contractApi.getAvatarManagementSign({
          user: address!,
          amount,
          avatar_id: avatarId.toString(),
          action: 'changeVoiceModel',
          new_model_name: newModelName,
        });

        if (signData.code !== 0 || !signData.data) {
          throw new Error(signData.message || 'Failed to get signature');
        }

        
        await execute(
          signData.data.amount,
          {
            contractAddress: latestConfig.avatarManagementContractAddress as Address,
            contractAbi: AvatarManagementContractABI as any,
            functionName: 'changeVoiceModel',
            args: [
              BigInt(signData.data.amount),
              BigInt(signData.data.avatar_id),
              signData.data.new_model_name || newModelName,
              BigInt(signData.data.nonce),
              signData.data.signature as `0x${string}`,
            ],
          }
        );
      } catch (error: any) {
        addToast({
          title: t('avatarManagement.changeVoiceModelFailed'),
          description: error?.message || t('avatarManagement.changeVoiceModelFailedDesc'),
          color: 'danger',
          severity: 'danger',
        });
      }
    },
    [address, appConfig, execute, fetchAppConfig, t]
  );

  
  const deleteSlot = useCallback(
    async ({ amount, avatarId, slotId }: DeleteSlotParams) => {
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

        
        const signData = await contractApi.getAvatarManagementSign({
          user: address!,
          amount,
          avatar_id: avatarId.toString(),
          action: 'deleteSlot',
          slot_id: slotId.toString(),
        });

        if (signData.code !== 0 || !signData.data) {
          throw new Error(signData.message || 'Failed to get signature');
        }

        
        await execute(
          signData.data.amount,
          {
            contractAddress: latestConfig.avatarManagementContractAddress as Address,
            contractAbi: AvatarManagementContractABI as any,
            functionName: 'deleteSlot',
            args: [
              BigInt(signData.data.amount),
              BigInt(signData.data.avatar_id),
              BigInt(signData.data.slot_id || slotId.toString()),
              BigInt(signData.data.nonce),
              signData.data.signature as `0x${string}`,
            ],
          }
        );
      } catch (error: any) {
        addToast({
          title: t('avatarManagement.deleteSlotFailed'),
          description: error?.message || t('avatarManagement.deleteSlotFailedDesc'),
          color: 'danger',
          severity: 'danger',
        });
      }
    },
    [address, appConfig, execute, fetchAppConfig, t]
  );

  
  useEffect(() => {
    if (isTransactionSuccess && !hasCalledSuccessRef.current) {
      hasCalledSuccessRef.current = true;

      addToast({
        title: t('avatarManagement.operationSuccess'),
        description: t('avatarManagement.operationSuccessDesc'),
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

    
    certifyAvatar,
    renameAvatar,
    changeVoiceModel,
    deleteSlot,
    reset,
  };
};
