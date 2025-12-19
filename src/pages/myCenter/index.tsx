import React, { useEffect, useState, useRef } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { Image } from "@heroui/image";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { FaCamera } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatAddress } from "@/utils/formatAddress";
import { PATHS } from "@/router/paths";
import { userApi, twitterApi } from "@/services";
import ImageCropModal from "@/components/ImageCropModal";
import { Loading } from "@/components/Loading";
import { FaCopy } from "react-icons/fa6";
import { BindInvitationCodeModal } from "@/components/BindInvitationCodeModal";
import { copyToClipboard as copyText } from "@/utils/copyToClipboard";
const MyCenterLayout: React.FC = () => {
  const { t } = useTranslation();
  
  const { address, userInfo, refreshUserInfo } = useWalletStore();
  
  const navigate = useNavigate();
  
  const location = useLocation();
  
  const [searchParams] = useSearchParams();

  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | undefined>(
    undefined
  );
  const [localName, setLocalName] = useState<string | undefined>(undefined);

  
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const [isBindingTwitter, setIsBindingTwitter] = useState(false);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);
  const callbackProcessedRef = useRef(false);
  const [isUnbindModalOpen, setIsUnbindModalOpen] = useState(false);

  
  const [isBindInviteModalOpen, setIsBindInviteModalOpen] = useState(false);

  
  const displayAvatarUrl = localAvatarUrl ?? userInfo?.avatarUrl;
  const displayName = localName ?? userInfo?.name;

  
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || typeof url !== "string") return false;

    
    try {
      const urlObj = new URL(url);
      
      if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        return false;
      }
    } catch {
      return false;
    }

    
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;
    return imageExtensions.test(url);
  };

  
  const handleTwitterCallback = async () => {
    
    if (callbackProcessedRef.current) {
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const error = searchParams.get("error");

    if (error) {
      window.history.replaceState({}, document.title, PATHS.MY_AGENT);
      return;
    }

    if (!code || !state) {
      return; 
    }

    
    callbackProcessedRef.current = true;

    
    const storedState = sessionStorage.getItem("twitter_oauth_state");
    if (storedState !== state) {
      addToast({
        title: "Error",
        description: t("common.invalidStateParameter"),
        color: "danger",
        severity: "danger",
      });
      
      window.history.replaceState({}, document.title, PATHS.MY_AGENT);
      return;
    }

    
    sessionStorage.removeItem("twitter_oauth_state");

    if (!userInfo?.id) {
      addToast({
        title: "Error",
        description: t("common.userInfoMissing"),
        color: "danger",
        severity: "danger",
      });
      window.history.replaceState({}, document.title, PATHS.MY_AGENT);
      return;
    }

    try {
      setIsProcessingCallback(true);

      
      const response = await twitterApi.callback({
        code,
        state,
        userId: userInfo.id,
      });

      if (response.code === 0 && response.data?.success) {
        addToast({
          title: t("common.bindSuccessful"),
          description: t("common.xAccountBoundSuccessfully"),
          color: "success",
          severity: "success",
        });

        
        refreshUserInfo();
      } else {
        throw new Error(
          response.message || t("common.failedToGetXAuthUrlGeneric")
        );
      }
    } catch (error) {
      addToast({
        title: t("common.bindFailed"),
        description: t("common.failedToGetXAuthUrl"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsProcessingCallback(false);
      
      window.history.replaceState({}, document.title, PATHS.MY_AGENT);
    }
  };

  
  useEffect(() => {
    refreshUserInfo();
    
    handleTwitterCallback();
  }, []); 

  
  const tabs = [
    {
      id: "1",
      title: t("myCenter.myAgent"),
      path: PATHS.MY_AGENT,
    },
    {
      id: "2",
      title: t("myCenter.myEarnings"),
      path: PATHS.MY_EARNINGS,
    },
    {
      id: "3",
      title: t("myCenter.myTraining"),
      path: PATHS.MY_TRAINING,
    },
    {
      id: "4",
      title: t("myCenter.myPromotion"),
      path: PATHS.MY_INVITATION,
    },
    {
      id: "5",
      title: t("myCenter.myCreations"),
      path: PATHS.MY_CREATIONS,
    },
  ];

  
  const getCurrentTabId = () => {
    const currentPath = location.pathname;
    const currentTab = tabs.find((tab) => tab.path === currentPath);
    return currentTab?.id || "1";
  };

  
  const handleAvatarClick = () => {
    if (!userInfo) {
      addToast({
        title: t("common.warning"),
        description: t("myCenter.pleaseConnectWallet"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      
      if (!file.type.startsWith("image/")) {
        addToast({
          title: t("common.error"),
          description: t("myCenter.invalidImageType"),
          color: "danger",
          severity: "danger",
        });
        return;
      }

      
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsCropModalOpen(true);
    }
  };

  
  const handleCropComplete = async (result: { uploadedUrl: string }) => {
    if (!userInfo) return;

    try {
      setIsSaving(true);

      
      const response = await userApi.updateWalletUser({
        avatarUrl: result.uploadedUrl,
      });

      if (response.code === 0 && response.data) {
        
        setLocalAvatarUrl(result.uploadedUrl);

        addToast({
          title: t("common.success"),
          description: t("myCenter.avatarUpdateSuccess"),
          color: "success",
          severity: "success",
        });
      }
    } catch {
      addToast({
        title: t("common.error"),
        description: t("myCenter.avatarUpdateFailed"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsSaving(false);
      setIsCropModalOpen(false);
      setSelectedImage("");
    }
  };

  
  const handleStartEditName = () => {
    if (!userInfo) {
      addToast({
        title: t("common.warning"),
        description: t("myCenter.pleaseConnectWallet"),
        color: "warning",
        severity: "warning",
      });
      return;
    }
    setEditedName(displayName || "");
    setIsEditingName(true);
  };

  
  const handleSaveName = async () => {
    if (!userInfo || !editedName.trim()) return;

    try {
      setIsSaving(true);

      
      const response = await userApi.updateWalletUser({
        name: editedName.trim(),
      });

      if (response.code === 0 && response.data) {
        
        setLocalName(editedName.trim());

        addToast({
          title: t("common.success"),
          description: t("myCenter.nameUpdateSuccess"),
          color: "success",
          severity: "success",
        });

        setIsEditingName(false);
      }
    } catch (error) {
      addToast({
        title: t("common.error"),
        description: t("myCenter.nameUpdateFailed"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsSaving(false);
    }
  };

  
  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName("");
  };

  
  const handleTwitterBind = async () => {
    if (!userInfo) {
      addToast({
        title: t("common.warning"),
        description: t("myCenter.pleaseConnectWallet"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    try {
      setIsBindingTwitter(true);

      
      const response = await twitterApi.login();

      if (response.code === 0 && response.data) {
        
        sessionStorage.setItem("twitter_oauth_state", response.data.state);

        
        
        const callbackUrl = `${window.location.origin}${PATHS.X_CALLBACK}`;
        const authUrl = response.data.authUrl.replace(
          /redirect_uri=[^&]*/,
          `redirect_uri=${encodeURIComponent(callbackUrl)}`
        );

        window.location.href = authUrl;
      } else {
        throw new Error(
          response.message || t("common.failedToGetXAuthUrlGeneric")
        );
      }
    } catch (error) {
      addToast({
        title: t("common.error"),
        description: t("common.failedToGetXAuthUrl"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsBindingTwitter(false);
    }
  };

  
  const showUnbindConfirmModal = () => {
    setIsUnbindModalOpen(true);
  };

  
  const handleTwitterUnbind = async () => {
    if (!userInfo) {
      addToast({
        title: t("common.warning"),
        description: t("myCenter.pleaseConnectWallet"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    try {
      setIsBindingTwitter(true);

      
      const response = await twitterApi.unbind();

      if (response.code === 0) {
        addToast({
          title: t("common.unbindSuccessful"),
          description: t("common.xAccountUnboundSuccessfully"),
          color: "success",
          severity: "success",
        });

        
        refreshUserInfo();
      } else {
        throw new Error(response.message || t("common.unbindFailed"));
      }
    } catch (error) {
      addToast({
        title: t("common.error"),
        description: t("common.failedToUnbindXAccount"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsBindingTwitter(false);
      setIsUnbindModalOpen(false);
    }
  };

  
  const copyToClipboard = (text: string) => {
    copyText(text, {
      onSuccess: () => {
        addToast({
          title: t("common.copiedSuccess"),
          color: "success",
          severity: "success",
        });
      },
      onError: () => {
        addToast({
          title: t("common.copiedFailed"),
          description: t("agentChat.copyFailed"),
          color: "danger",
          severity: "danger",
        });
      },
    });
  };

  return (
    <div className="px-4 space-y-6">
      {}
      <div className="rounded-md bg-linear-to-b from-[#634501] to-[#4D2300]">
        <div className="bg-[url('/img/bg-myCenter.png')] bg-auto bg-left-center bg-no-repeat w-full h-full flex items-center gap-4 mx-auto px-20 py-10 ">
          {}
          <div className="relative w-[130px] h-[130px]">
            {isValidImageUrl(displayAvatarUrl) ? (
              <div
                className="relative w-full h-full group"
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
              >
                <Image
                  src={displayAvatarUrl || ""}
                  radius="full"
                  width={130}
                  height={130}
                  alt={t("myCenter.userAvatar")}
                  className={isSaving ? "opacity-50" : ""}
                />
                {}
                <div
                  role="button"
                  tabIndex={0}
                  className={`absolute z-10 inset-0 rounded-full bg-black/50 flex items-center justify-center cursor-pointer transition-opacity duration-200 ${isAvatarHovered && !isSaving ? "opacity-100" : "opacity-0"
                    }`}
                  onClick={handleAvatarClick}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleAvatarClick();
                    }
                  }}
                  aria-label={t("myCenter.uploadAvatar")}
                >
                  <div className="flex flex-col items-center gap-1 pointer-events-none">
                    <FaCamera className="text-white text-2xl" />
                    <span className="text-white text-xs">
                      {t("common.edit")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              
              <div
                role="button"
                tabIndex={0}
                onClick={handleAvatarClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAvatarClick();
                  }
                }}
                aria-label={t("myCenter.uploadAvatar")}
                className={`w-[130px] h-[130px] rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center cursor-pointer hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all ${isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <CiEdit className="text-4xl text-gray-500 dark:text-gray-400" />
              </div>
            )}
            {}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              aria-label={t("myCenter.uploadAvatar")}
            />
          </div>

          {}
          <div className="space-y-2 text-sm flex-1">
            {}
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <>
                  <Input
                    size="sm"
                    type="search"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder={t("myCenter.enterName")}
                    className="max-w-[200px]"
                    classNames={{
                      input: " group-data-[has-value=true]:text-white",
                    }}
                  />
                  <Button
                    size="sm"
                    color="primary"
                    onPress={handleSaveName}
                    isDisabled={!editedName.trim() || isSaving}
                    isLoading={isSaving}
                  >
                    {t("common.save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={handleCancelEditName}
                    isDisabled={isSaving}
                  >
                    {t("common.cancel")}
                  </Button>
                </>
              ) : (
                <>
                  {displayName ? (
                    <>
                      <span className="font-medium text-lg">{displayName}</span>
                      <Button
                        isIconOnly
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={handleStartEditName}
                        className="ml-1"
                      >
                        <CiEdit className="text-lg" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<CiEdit className="text-lg" />}
                      onPress={handleStartEditName}
                    >
                      {t("myCenter.setName")}
                    </Button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-baseline">
              {t("myCenter.walletAddress")}：
              <span className="text-[#3481F2] font-w-black-italic">
                {formatAddress(address || "")}
              </span>
              <FaCopy
                className="ml-2 cursor-pointer text-default"
                size={11}
                onClick={() => copyToClipboard(address || "")}
              />
            </div>

            {userInfo?.invitationCode && (
              <>
                <div className="flex items-baseline">
                  {t("myCenter.invitationCode")}：
                  <span className="text-[#3481F2] font-w-black-italic">
                    {userInfo.invitationCode}
                  </span>
                  <FaCopy
                    className="ml-2 cursor-pointer text-default"
                    size={11}
                    onClick={() => copyToClipboard(userInfo.invitationCode)}
                  />
                </div>
                <div className="flex items-baseline">
                  {t("myCenter.invitationCodeUrl")}：
                  <span className="text-[#3481F2] font-w-black-italic">
                    {`https://...${userInfo.invitationCode}`}
                  </span>
                  <FaCopy
                    className="ml-2 cursor-pointer text-default"
                    size={11}
                    onClick={() => copyToClipboard(`${window.location.origin}?inviteCode=${userInfo?.invitationCode}`)}
                  />
                </div>
              </>
            )}

            {}
            {userInfo?.bindInvitationCode && (
              <div className="flex items-baseline">
                {t("myCenter.bindInvitationCode")}：
                <span className="text-[#3481F2] font-w-black-italic">
                  {userInfo.bindInvitationCode}
                </span>
              </div>
            )}

            {}
            <div>
              {isProcessingCallback ? (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Loading />
                  <span>{t("common.processingBinding")}</span>
                </div>
              ) : userInfo?.twitterUser && (
                
                <div className="flex items-center gap-3">
                  <a
                    href={`https://twitter.com/${userInfo.twitterUser.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#3481F2] hover:text-[#1a91da] transition-colors"
                  >
                    <FaXTwitter className="text-xl text-white" />
                    <span className="font-medium">
                      @{userInfo.twitterUser.username}
                    </span>
                  </a>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={showUnbindConfirmModal}
                    isLoading={isBindingTwitter}
                  >
                    {t("common.unbindX")}
                  </Button>
                </div>
              )}
            </div>


            {userInfo && <div className="flex items-center gap-2">
              {}
              {
                !userInfo?.bindInvitationCode && (
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onPress={() => setIsBindInviteModalOpen(true)}
                  >
                    {t("myCenter.bindInvitationCode")}
                  </Button>
                )
              }
              {}
              {
                !userInfo?.twitterUser && (
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<FaXTwitter className="text-lg" />}
                    onPress={handleTwitterBind}
                    isLoading={isBindingTwitter}
                  >
                    {isBindingTwitter
                      ? t("common.processing")
                      : t("common.bindX")}
                  </Button>
                )
              }
            </div>}
          </div>
        </div>
      </div>

      {}
      {selectedImage && (
        <ImageCropModal
          isOpen={isCropModalOpen}
          onClose={() => {
            setIsCropModalOpen(false);
            setSelectedImage("");
          }}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          targetWidth={200}
          targetHeight={200}
        />
      )}

      {}
      <Modal
        isOpen={isUnbindModalOpen}
        onClose={() => setIsUnbindModalOpen(false)}
        size="sm"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("common.unbindAccount")}
              </ModalHeader>
              <ModalBody>
                <p>{t("common.confirmUnbindMessage")}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  onPress={() => setIsUnbindModalOpen(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  color="danger"
                  onPress={handleTwitterUnbind}
                  isLoading={isBindingTwitter}
                >
                  {t("common.confirmUnbind")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {}
      <BindInvitationCodeModal
        isOpen={isBindInviteModalOpen}
        onClose={() => setIsBindInviteModalOpen(false)}
        onSuccess={refreshUserInfo}
      />

      {}
      <div className="space-y-6 min-h-[80vh]">
        {}
        <Tabs
          size="sm"
          variant="light"
          color="primary"
          selectedKey={getCurrentTabId()}
          onSelectionChange={(id) =>
            navigate(tabs.find((tab) => tab.id === id)?.path || "")
          }
          classNames={{
            tab: "data-[selected=true]:font-bold",
          }}
        >
          {tabs.map((item) => (
            <Tab key={item.id} title={item.title} className="text-sm" />
          ))}
        </Tabs>
        {}
        <MemoizedOutlet />
      </div>
    </div>
  );
};


const MemoizedOutlet = React.memo(() => {
  return <Outlet />;
});

MemoizedOutlet.displayName = "MemoizedOutlet";

export default MyCenterLayout;
