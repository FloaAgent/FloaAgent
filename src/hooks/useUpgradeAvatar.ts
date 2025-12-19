import { useCallback, useEffect, useRef } from 'react';
import { Address } from 'viem';
import { addToast } from '@heroui/toast';
import { useConfigStore } from '@/stores/useConfigStore';
import { contractApi } from '@/services';
import InteractionContractABI from '@/contracts/abis/InteractionContract.json';
import { useTranslation } from 'react-i18next';
import { useContractInteraction } from './useContractInteraction';



interface UpgradeAvatarParams {
  amount: string;
  level: number;
  avatarId: number;
}

interface UseUpgradeAvatarOptions {

  onSuccess?: () => void;
}

export const useUpgradeAvatar = (options: UseUpgradeAvatarOptions = {}) => {
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
    operationName: t('avatar.upgrade'),
  });


  const upgradeAvatar = useCallback(
    async ({ amount, level, avatarId }: UpgradeAvatarParams) => {
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

          action: 'upgradeAvatar',
        });

        if (signData.code !== 0 || !signData.data) {
          throw new Error(signData.message || 'Failed to get signature');
        }


        await execute(
          signData.data.amount,
          {
            contractAddress: latestConfig.interactionContractAddress as Address,
            contractAbi: InteractionContractABI as any,
            functionName: 'upgradeAvatar',
            args: [
              BigInt(signData.data.amount),
              BigInt(signData.data.level),
              BigInt(signData.data.avatar_id!),
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
            title: t('avatar.upgradeFailed'),
            description: error?.message || t('avatar.upgradeFailedDesc'),
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
        title: t('avatar.upgradeSuccess'),
        description: t('avatar.upgradeSuccessDesc'),
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


    upgradeAvatar,
    reset,
  };
};
