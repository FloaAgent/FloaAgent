import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useWalletStore } from "@/stores/useWalletStore";
import { useWalletEvents } from "@/hooks/useWalletEvents";
import { useAppKitWagmi } from "@/hooks/useAppKitWagmi";
import { useAppKitNetwork } from "@reown/appkit/react";
import { formatAddress } from "@/utils/formatAddress";
import { addToast } from "@heroui/toast";
import { useTranslation } from "react-i18next";
import { HeadNavItem } from "@/components/HeadNavItem";
import { TrainingCouponPanel } from "@/components/TrainingCouponPanel";
import { AiFillCaretDown } from "react-icons/ai";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { PATHS } from "@/router/paths";

interface HeadNavProps {
  
  showNavItems?: boolean;
  
  className?: string;
  
  containerClassName?: string;
  
  logoClassName?: string;
}

export const HeadNav: React.FC<HeadNavProps> = ({
  showNavItems = false,
  className = "",
  containerClassName = "",
  logoClassName = "",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    address,
    userInfo,
    isConnecting,
    isLoggingIn,
    connectWallet,
    disconnectWallet,
    setExternalSignMessageFn,
    setInviteCode,
  } = useWalletStore();
  const { caipNetwork } = useAppKitNetwork();
  const { signMessage: appKitSignMessage } = useAppKitWagmi();

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const inviteCode123 = searchParams.get("inviteCode");
    if (inviteCode123) {
      setInviteCode(inviteCode123);
    }
  }, []);

  
  useWalletEvents();

  
  useEffect(() => {
    setExternalSignMessageFn(appKitSignMessage);
    return () => setExternalSignMessageFn(null);
  }, [appKitSignMessage, setExternalSignMessageFn]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      
    }
  };

  const handleCopyAddress = () => {
    if (!address) return;
    copyToClipboard(address, {
      onSuccess: () => {
        addToast({
          title: t("wallet.copySuccess"),
          description: t("wallet.copySuccessDesc"),
          color: "success",
          severity: "success",
        });
      },
      onError: () => {
        addToast({
          title: t("wallet.copyFailed"),
          description: t("wallet.copyFailedDesc"),
          color: "danger",
          severity: "danger",
        });
      },
    });
  };

  const handleGoHome = () => {
    const isMobile = window.innerWidth < 768;

    return isMobile ? PATHS.M_TRAINING : PATHS.HOME;
  };

  return (
    <header className={`relative z-10 bg-[#FEB80B] ${className}`}>
      <div
        className={`w-full mx-auto px-1.5 sm:px-4 py-1 sm:py-2 flex justify-between items-center gap-1 sm:gap-2 ${containerClassName}`}
      >
        <Link
          to={handleGoHome()}
          className="font-semibold text-xl tracking-tight flex-shrink-0"
        >
          <img
            src="/img/logo.png"
            alt="logo"
            className={`h-7 sm:h-12 inline-block ${logoClassName}`}
          />
        </Link>
        <nav className="flex gap-0.5 sm:gap-4 items-center">
          {}
          {showNavItems && (
            <div className="hidden md:block">
              <HeadNavItem />
            </div>
          )}

          {}
          {userInfo && <TrainingCouponPanel />}

          {}
          {userInfo ? (
            <Dropdown>
              <DropdownTrigger>
                <Button className="bg-black border-2 text-primary font-w-black-italic font-bold italic text-[10px] sm:text-sm px-1.5 sm:px-4 min-w-[70px] sm:min-w-[120px] h-7 sm:h-10">
                  <span className="truncate">{formatAddress(address!)}</span>
                  <AiFillCaretDown className="flex-shrink-0 ml-0.5 sm:ml-1 text-xs sm:text-base" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label={t("wallet.walletAddress")}
                classNames={{
                  base: "w-[280px] sm:w-[320px]",
                }}
              >
                <DropdownItem
                  key="user-id"
                  className="cursor-default"
                  textValue={t("wallet.userId")}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {t("wallet.userId")}
                    </span>
                    <span className="font-mono text-xs sm:text-sm">
                      {userInfo.id}
                    </span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="address"
                  className="cursor-pointer hover:bg-default-100"
                  textValue={t("wallet.walletAddress")}
                  onPress={handleCopyAddress}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {t("wallet.walletAddress")} ({t("wallet.clickToCopy")})
                    </span>
                    <span className="font-mono text-xs sm:text-sm break-all">
                      {address}
                    </span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="network"
                  className="cursor-default"
                  textValue={t("wallet.currentNetwork")}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {t("wallet.currentNetwork")}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {caipNetwork
                            ? caipNetwork.name
                            : t("wallet.unknownNetwork")}
                        </span>
                        {caipNetwork && (
                          <span className="text-[10px] sm:text-xs text-gray-400">
                            {t("wallet.chainId")}: {caipNetwork.id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="login-status"
                  className="cursor-default"
                  textValue={t("wallet.loginStatus")}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {t("wallet.loginStatus")}
                    </span>
                    <span className="text-xs sm:text-sm text-green-600">
                      {t("wallet.loggedIn")}
                    </span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="disconnect"
                  className="text-danger text-xs sm:text-sm"
                  color="danger"
                  onPress={handleDisconnectWallet}
                  textValue={t("wallet.disconnect")}
                >
                  {t("wallet.disconnect")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              className="bg-black border-2 text-primary font-w-black-italic font-bold italic text-[10px] sm:text-sm px-1.5 sm:px-4 h-7 sm:h-10"
              onPress={handleConnectWallet}
              disabled={isConnecting || isLoggingIn}
            >
              {isLoggingIn
                ? t("wallet.loggingIn")
                : isConnecting
                  ? t("wallet.connecting")
                  : t("wallet.connect")}
            </Button>
          )}

          <div className="flex-shrink-0">
            <LanguageSwitch />
          </div>
        </nav>
      </div>
    </header>
  );
};
