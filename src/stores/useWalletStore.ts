import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appkit } from '@/contracts/walletConfig'
import { authApi, userApi, configApi, type UserInfo as ApiUserInfo } from '@/services'

interface UserInfo extends ApiUserInfo {
  loginTime: number
  accessToken: string
}

interface WalletState {
  isConnected: boolean
  address: string | null
  userInfo: UserInfo | null
  isConnecting: boolean
  isLoggingIn: boolean
  externalSignMessageFn: ((message: string) => Promise<string>) | null
  inviteCode: string
  
  setConnected: (connected: boolean) => void
  setAddress: (address: string | null) => void
  setUserInfo: (userInfo: UserInfo | null) => void
  setConnecting: (connecting: boolean) => void
  setLoggingIn: (loggingIn: boolean) => void
  setExternalSignMessageFn: (fn: ((message: string) => Promise<string>) | null) => void
  setInviteCode: (inviteCode: string) => void
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  signMessage: (message: string) => Promise<string>
  loginWithWallet: () => Promise<void>
  checkLoginValid: () => boolean
  refreshUserInfo: () => Promise<void>
  reset: () => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      address: null,
      userInfo: null,
      isConnecting: false,
      isLoggingIn: false,
      externalSignMessageFn: null,
      inviteCode: '',
      setConnected: (connected) => set({ isConnected: connected }),
      setAddress: (address) => set({ address }),
      setUserInfo: (userInfo) => set({ userInfo }),
      setConnecting: (connecting) => set({ isConnecting: connecting }),
      setLoggingIn: (loggingIn) => set({ isLoggingIn: loggingIn }),
      setExternalSignMessageFn: (fn) => set({ externalSignMessageFn: fn }),
      setInviteCode: (inviteCode) => set({ inviteCode }),

      connectWallet: async () => {
        try {
          set({ isConnecting: true })
          await appkit.open()
        } catch (error) {
          throw error
        } finally {
          set({ isConnecting: false })
        }
      },

      disconnectWallet: async () => {
        try {
          await appkit.disconnect()
          
          localStorage.removeItem('accessToken')
          set({
            isConnected: false,
            address: null,
            userInfo: null
          })
        } catch (error) {
          throw error
        }
      },

      signMessage: async (message: string) => {
        const state = get()

        
        if (state.externalSignMessageFn) {
          try {
            return await state.externalSignMessageFn(message)
          } catch (error) {
            throw error
          }
        }

        
        throw new Error('签名函数未设置，请确保已初始化钱包连接')
      },

      loginWithWallet: async () => {
        const { address, isLoggingIn, inviteCode } = get()

        if (!address) {
          throw new Error('钱包未连接')
        }

        
        if (isLoggingIn) {
          return
        }

        try {
          set({ isLoggingIn: true })

          
          const timestampResponse = await configApi.getServerTimestamp()
          if (timestampResponse.code !== 0 || !timestampResponse.data) {
            throw new Error('获取服务器时间戳失败')
          }
          const timestamp = timestampResponse.data.timestamp


          const message = `Welcome to FLOA!\nTimestamp: ${timestamp}`

          const signature = await get().signMessage(message)

          
          const response = await authApi.walletLogin({
            chainNamespace: 'eip155', 
            signer: address,
            signedMessage: signature,
            message,
            timestamp,
          })

          if (response.code === 0 && response.data) {
            
            localStorage.setItem('accessToken', response.data.accessToken)

            
            const userInfo: UserInfo = {
              ...response.data.user,
              loginTime: Date.now(), 
              accessToken: response.data.accessToken,
            }
            set({ userInfo })
            if (inviteCode) {
              
              await userApi.bindInvitationCode({
                invitationCode: inviteCode,
              })
            }

          } else {
            throw new Error(response.message || '登录失败')
          }
        } catch (error: any) {

          await get().disconnectWallet()

          throw error
        } finally {
          set({ isLoggingIn: false })
        }
      },

      checkLoginValid: () => {
        const { userInfo, address } = get()

        
        if (!userInfo || !address) {
          return false
        }

        
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken || accessToken !== userInfo.accessToken) {
          return false
        }

        
        if (userInfo.account.toLowerCase() !== address.toLowerCase()) {
          return false
        }

        
        const LOGIN_EXPIRE_TIME = 24 * 60 * 60 * 1000 
        const now = Date.now()

        if (userInfo.loginTime && (now - userInfo.loginTime) > LOGIN_EXPIRE_TIME) {
          return false
        }

        return true
      },

      refreshUserInfo: async () => {
        const { userInfo } = get()

        
        if (!userInfo) {
          return
        }

        try {
          const response = await userApi.getCurrentUser()

          if (response.code === 0 && response.data) {
            
            const updatedUserInfo: UserInfo = {
              ...response.data,
              loginTime: userInfo.loginTime,
              accessToken: userInfo.accessToken,
            }
            set({ userInfo: updatedUserInfo })
          }
        } catch {
          
        }
      },

      reset: () => {
        
        localStorage.removeItem('accessToken')
        set({
          isConnected: false,
          address: null,
          userInfo: null,
          isConnecting: false,
          isLoggingIn: false,
          
          
        })
      }
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        userInfo: state.userInfo,
        isConnected: state.isConnected,
        address: state.address
      })
    }
  )
)