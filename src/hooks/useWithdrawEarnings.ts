import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { addToast } from '@heroui/toast';
import { useConfigStore } from '@/stores/useConfigStore';
import { useContractInteraction } from './useContractInteraction';
import WithdrawalContractAbi from '@/contracts/abis/WithdrawalContract.json';
import { useTranslation } from 'react-i18next';
import { contractApi } from '@/services';
import { useAccount } from 'wagmi';


export const useWithdrawEarnings = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { appConfig } = useConfigStore();
  const [isWithdrawing, setIsWithdrawing] = useState(false);


  const {
    execute,
    isProcessing,
    currentStep,
    transactionHash,
    reset,
  } = useContractInteraction({
    requireApproval: false,
    operationName: t('myEarnings.withdraw'),
  });


  const withdrawWithSignature = useCallback(
    async (signatureData: {
      tokenAddress: string;
      amount: string;
      nonce: string;
      deadline: string;
      signature: string;
    }) => {
      if (!appConfig?.withdrawalContractAddress) {
        addToast({
          title: t('common.error'),
          description: t('myEarnings.withdrawContractNotConfigured'),
          color: 'danger',
        });
        return false;
      }

      if (!address) {
        addToast({
          title: t('common.error'),
          description: t('shoppingMall.walletNotConnected'),
          color: 'danger',
        });
        return false;
      }

      setIsWithdrawing(true);

      try {


        await execute(
          '0',
          {
            contractAddress: appConfig.withdrawalContractAddress as Address,
            contractAbi: WithdrawalContractAbi as any,
            functionName: 'withdraw',
            args: [
              signatureData.tokenAddress as Address,
              BigInt(signatureData.amount),
              BigInt(signatureData.nonce),
              BigInt(signatureData.deadline),
              signatureData.signature as `0x${string}`,
            ],
          },
          () => {

            addToast({
              title: t('myEarnings.withdrawSuccess'),
              description: t('myEarnings.withdrawSuccessDesc'),
              color: 'success',
            });
          }
        );

        setIsWithdrawing(false);
        reset();
        return true;
      } catch (error: any) {


        if (error?.response?.data?.message) {
          const errorMessage = error.response.data.message.toLowerCase();


          if (errorMessage.includes('withdrawal amount exceeds limit, under manual review')) {

            addToast({
              title: t('myEarnings.withdrawSuccess'),
              description: t('myEarnings.manualReviewRequired'),
              color: 'primary',
            });
            setIsWithdrawing(false);
            reset();
            return true;
          } else {

            addToast({
              title: t('myEarnings.withdrawFailed'),
              description: error.response.data.message,
              color: 'danger',
            });
          }
        } else if (error?.message?.includes('User rejected') || error?.message?.includes('User denied')) {

          addToast({
            title: t('common.transactionRejected'),
            description: t('common.transactionRejectedDesc'),
            color: 'warning',
          });
        } else {
          if (error?.message.includes('withdrawal amount exceeds limit, under manual review')) {
            setIsWithdrawing(false);
            reset();
            return true;


          }

          addToast({
            title: t('myEarnings.withdrawFailed'),
            description: error?.message || t('common.unknownError'),
            color: 'danger',
          });
        }

        setIsWithdrawing(false);
        reset();
        return false;
      }
    },
    [address, appConfig, execute, t, reset]
  );


  const withdraw = useCallback(
    async (amount: string) => {
      if (!appConfig?.withdrawalContractAddress) {
        addToast({
          title: t('common.error'),
          description: t('myEarnings.withdrawContractNotConfigured'),
          color: 'danger',
        });
        return false;
      }

      if (!address) {
        addToast({
          title: t('common.error'),
          description: t('shoppingMall.walletNotConnected'),
          color: 'danger',
        });
        return false;
      }

      setIsWithdrawing(true);

      try {

        const signatureResponse = await contractApi.getWithdrawalSign({
          user: address,
          amount,
        });

        const {
          token,
          amount: signedAmount,
          nonce,
          deadline,
          signature,
        } = signatureResponse.data;

        await execute(
          '0',
          {
            contractAddress: appConfig.withdrawalContractAddress as Address,
            contractAbi: WithdrawalContractAbi as any,
            functionName: 'withdraw',
            args: [
              token as Address,
              BigInt(signedAmount),
              BigInt(nonce),
              BigInt(deadline),
              signature as `0x${string}`,
            ],
          },
          () => {

            addToast({
              title: t('myEarnings.withdrawSuccess'),
              description: t('myEarnings.withdrawSuccessDesc'),
              color: 'success',
            });
          }
        );

        setIsWithdrawing(false);
        reset();
        return true;
      } catch (error: any) {
        if (error?.response?.data?.message) {
          const errorMessage = error.response.data.message.toLowerCase();


          if (errorMessage.includes('withdrawal amount exceeds limit, under manual review')) {

            addToast({
              title: t('myEarnings.withdrawSuccess'),
              description: t('myEarnings.manualReviewRequired'),
              color: 'primary',
            });
            setIsWithdrawing(false);
            reset();
            return true;
          } else {

            addToast({
              title: t('myEarnings.withdrawFailed'),
              description: error.response.data.message,
              color: 'danger',
            });
          }
        } else if (error?.message?.includes('User rejected') || error?.message?.includes('User denied')) {

          addToast({
            title: t('common.transactionRejected'),
            description: t('common.transactionRejectedDesc'),
            color: 'warning',
          });
        } else {
          if (error?.message.includes('withdrawal amount exceeds limit, under manual review')) {
            setIsWithdrawing(false);
            reset();
            return true;

          }

          addToast({
            title: t('myEarnings.withdrawFailed'),
            description: error?.message || t('common.unknownError'),
            color: 'danger',
          });
        }

        setIsWithdrawing(false);
        reset();
        return false;
      }
    },
    [address, appConfig, execute, t, reset]
  );

  return {
    withdraw,
    withdrawWithSignature,
    isWithdrawing: isWithdrawing || isProcessing,
    currentStep,
    transactionHash,
    reset,
  };
};
