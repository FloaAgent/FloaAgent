import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { useTranslation } from "react-i18next";
import { addToast } from "@heroui/toast";
import { twitterApi } from "@/services";
import { useWalletStore } from "@/stores/useWalletStore";

interface ShareToTwitterModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: number;
  onSuccess?: () => void;
}


const calculateCharacterCount = (text: string): number => {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char.match(/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/)) {
      count += 2;
    } else {
      count += 1;
    }
  }
  return count;
};


export const ShareToTwitterModal: React.FC<ShareToTwitterModalProps> = ({
  isOpen,
  onClose,
  videoId,
  onSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const { userInfo } = useWalletStore();
  const [shareText, setShareText] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [includeInviteCode, setIncludeInviteCode] = useState(true);

  
  const MAX_CHARACTERS = 280;

  
  useEffect(() => {
    if (isOpen) {
      const defaultContent = t("myCreations.shareContent");
      setShareText(defaultContent);
      setIncludeInviteCode(true); 
    }
  }, [isOpen, i18n.language, t]);

  
  const characterCount = useMemo(() => {
    let finalText = shareText;

    
    if (includeInviteCode && userInfo?.invitationCode) {
      const inviteLink = `${window.location.origin}?inviteCode=${userInfo.invitationCode}`;
      finalText = `${finalText}\n\n${inviteLink}`;
    }

    return calculateCharacterCount(finalText);
  }, [shareText, includeInviteCode, userInfo?.invitationCode]);

  
  const isExceeded = characterCount > MAX_CHARACTERS;

  
  const handleShare = async () => {
    if (!shareText.trim()) {
      addToast({
        title: t("common.warning"),
        description: t("myCreations.shareContentPlaceholder"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    if (isExceeded) {
      addToast({
        title: t("common.warning"),
        description: t("myCreations.characterExceeded"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    try {
      setIsSharing(true);

      
      let finalText = shareText.trim();

      
      if (includeInviteCode && userInfo?.invitationCode) {
        const inviteLink = `${window.location.origin}?inviteCode=${userInfo.invitationCode}`;
        finalText = `${finalText}\n\n${inviteLink}`;
      }

      const response = await twitterApi.shareVideoToTwitter({
        id: videoId,
        text: finalText,
      });

      
      
      
      
      
      
      
      
      
      

      if (response.data.success) {
        addToast({
          title: t("common.success"),
          description: t("myCreations.shareSuccess"),
          color: "success",
          severity: "success",
        });

        
        if (response.data.tweetUrl) {
          window.open(response.data.tweetUrl, "_blank");
        }

        
        if (onSuccess) {
          onSuccess();
        }

        
        handleClose();
      } else {
        throw new Error(response.data.message || t("myCreations.shareFailed"));
      }
    } catch (error: any) {
      addToast({
        title: t("common.error"),
        description: error?.message || t("myCreations.shareFailed"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsSharing(false);
    }
  };

  
  const handleClose = () => {
    setShareText("");
    setIncludeInviteCode(true);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      isDismissable={!isSharing}
      hideCloseButton={isSharing}
      classNames={{
        base: "bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30",
        closeButton: "text-yellow-400 hover:bg-yellow-400/20",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2 text-yellow-400 font-w-black-italic text-xl">
          <span>{t("myCreations.shareModalTitle")}</span>
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="space-y-4">
            {}
            <div className="space-y-2">
              <Textarea
                variant="bordered"
                placeholder={t("myCreations.shareContentPlaceholder")}
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                minRows={6}
                maxRows={10}
                isDisabled={isSharing}
                classNames={{
                  input: "text-white/90",
                  inputWrapper: isExceeded
                    ? "border-danger data-[hover=true]:border-danger"
                    : "border-yellow-400/30 data-[hover=true]:border-yellow-400/50",
                }}
              />

              {}
              <div className="flex justify-between items-center text-xs">
                <span
                  className={
                    isExceeded ? "text-danger font-medium" : "text-white/60"
                  }
                >
                  {t("myCreations.characterLimit")}
                </span>
                <span
                  className={
                    isExceeded
                      ? "text-danger font-bold"
                      : characterCount > MAX_CHARACTERS * 0.9
                        ? "text-warning font-medium"
                        : "text-white/60"
                  }
                >
                  {t("myCreations.characterCount", {
                    current: characterCount,
                    max: MAX_CHARACTERS,
                  })}
                </span>
              </div>
            </div>

            {}
            <div className="p-1">
              <Checkbox
                isSelected={includeInviteCode}
                onValueChange={setIncludeInviteCode}
                isDisabled={isSharing}
                classNames={{
                  label: "text-default-400/90 text-xs font-medium",
                  wrapper: "after:bg-yellow-400 after:text-black",
                }}
              >
                {t("myCreations.includeInviteCode")}
              </Checkbox>
              <p className="text-default-400/70 text-xs ml-7 leading-relaxed">
                {t("myCreations.inviteCodeTip")}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="gap-3">
          <Button
            variant="light"
            onPress={handleClose}
            isDisabled={isSharing}
            className="text-white/80 hover:text-white font-w-black-italic"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onPress={handleShare}
            isLoading={isSharing}
            isDisabled={isSharing || !shareText.trim() || isExceeded}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold font-w-black-italic"
          >
            {isSharing
              ? t("myCreations.sharing")
              : t("myCreations.shareToTwitter")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
