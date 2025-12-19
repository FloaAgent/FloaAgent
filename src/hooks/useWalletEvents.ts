import { useEffect, useCallback, useRef } from 'react'
import { appkit } from '@/contracts/walletConfig'
import { useWalletStore } from '@/stores/useWalletStore'
import { addToast } from '@heroui/toast'
import { useTranslation } from 'react-i18next'


export const useWalletEvents = () => {
  const { t } = useTranslation()
  const {
    setConnected,
    setAddress,
    loginWithWallet,
    checkLoginValid,
    reset,
    address: currentAddress,
    externalSignMessageFn
  } = useWalletStore()

  
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  
  const safeLoginWithWallet = useCallback(async () => {

    if (!externalSignMessageFn) {
      return
    }

    try {
      await loginWithWallet()
    } catch (error: any) {

      
      const errorMessage = error?.message || '登录失败'

      
      if (errorMessage.includes('拒绝') || errorMessage.includes('rejected')) {
        addToast({
          title: t('common.cancelled'),
          description: t('wallet.signatureRejected'),
          color: 'warning',
        })
      } else {
        addToast({
          title: t('common.error'),
          description: errorMessage,
          color: 'danger',
        })
      }
    }
  }, [loginWithWallet, externalSignMessageFn, t])

  
  useEffect(() => {
    if (externalSignMessageFn && currentAddress && !checkLoginValid()) {
      safeLoginWithWallet()
    }
  }, [externalSignMessageFn, currentAddress, checkLoginValid, safeLoginWithWallet])

  useEffect(() => {
    let previousAddress = currentAddress

    
    if (currentAddress && checkLoginValid()) {
      setConnected(true)
    }

    
    const unsubscribeState = appkit.subscribeState((state) => {
      const isConnected = state.open === false && state.selectedNetworkId !== undefined
      setConnected(isConnected)
    })

    
    const unsubscribeAccount = appkit.subscribeAccount(async (account) => {
      const newAddress = account.address || null

      
      if (newAddress !== previousAddress) {
        if (newAddress) {
          
          if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current)
            resetTimeoutRef.current = null
          }

          setAddress(newAddress)
          setConnected(true)

          if (previousAddress && previousAddress !== newAddress) {
            
            await safeLoginWithWallet()
          } else if (checkLoginValid()) {
            
            setConnected(true)
          } else {
            
            await safeLoginWithWallet()
          }
        } else {
          
          if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current)
          }

          
          resetTimeoutRef.current = setTimeout(() => {
            const currentState = useWalletStore.getState()
            if (!currentState.address) {
              reset()
            }
            resetTimeoutRef.current = null
          }, 1000)
        }

        previousAddress = newAddress
      } else if (newAddress && !checkLoginValid()) {
        
        await safeLoginWithWallet()
      }
    })

    
    return () => {
      unsubscribeState?.()
      unsubscribeAccount?.()

      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
        resetTimeoutRef.current = null
      }
    }
  }, [setConnected, setAddress, checkLoginValid, reset, safeLoginWithWallet, currentAddress])
}