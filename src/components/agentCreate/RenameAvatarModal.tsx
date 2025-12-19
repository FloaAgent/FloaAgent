import React, { useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useTranslation } from "react-i18next";
import { addToast } from "@heroui/toast";
import { FaPencilAlt } from "react-icons/fa";
import { formatEther } from "viem";
import { useConfigStore } from "@/stores/useConfigStore";
import { useAvatarManagement } from "@/hooks/useAvatarManagement";

interface RenameAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarId: number | null;
  currentName: string;
  onSuccess?: () => void;
}

export const RenameAvatarModal: React.FC<RenameAvatarModalProps> = ({
  isOpen,
  onClose,
  avatarId,
  currentName,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { appConfig } = useConfigStore();
  const [newName, setNewName] = useState("");

  
  const renameCost = useMemo(() => {
    if (!appConfig?.renameAvatarPrice) return "100";
    return formatEther(BigInt(appConfig.renameAvatarPrice));
  }, [appConfig?.renameAvatarPrice]);

  
  const { renameAvatar, isProcessing, currentStep } = useAvatarManagement({
    onSuccess: () => {
      
      onClose();
      setNewName(""); 
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2500);
      }
    },
  });

  
  const handleConfirmRename = async () => {
    if (!avatarId || isProcessing) return;

    
    if (!newName.trim()) {
      addToast({
        title: t("common.hint"),
        description: t("agentCreate.renameAvatar.nameRequired"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    
    if (newName.trim() === currentName) {
      addToast({
        title: t("common.hint"),
        description: t("agentCreate.renameAvatar.nameSameAsOld"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    if (!appConfig?.renameAvatarPrice) {
      addToast({
        title: t("common.error"),
        description: t("agentCreate.renameAvatar.configLoadFailed"),
        color: "danger",
        severity: "danger",
      });
      return;
    }

    
    await renameAvatar({
      amount: appConfig.renameAvatarPrice,
      avatarId,
      newName: newName.trim(),
    });
  };

  
  const handleClose = () => {
    if (!isProcessing) {
      setNewName("");
      onClose();
    }
  };

  if (!avatarId) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      size="2xl"
      classNames={{
        base: "bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30",
        closeButton: "text-yellow-400 hover:bg-yellow-400/20",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-yellow-400 font-w-black-italic text-xl flex items-center gap-2">
          <FaPencilAlt className="text-blue-400" />
          {t("agentCreate.renameAvatar.title")}
        </ModalHeader>

        <ModalBody className="py-4">
          <div className="space-y-4">
            {}
            <p className="text-white/90 text-sm leading-relaxed">
              {t("agentCreate.renameAvatar.intro")}
            </p>

            {}
            <div>
              <label className="text-white/70 text-sm mb-2 block">
                {t("agentCreate.renameAvatar.currentName")}
              </label>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white font-medium text-sm">{currentName}</p>
              </div>
            </div>

            {}
            <div>
              <label className="text-white/70 text-sm mb-2 block">
                {t("agentCreate.renameAvatar.newName")}
              </label>
              <Input
                variant="bordered"
                type="text"
                value={newName}
                onValueChange={setNewName}
                placeholder={t("agentCreate.renameAvatar.namePlaceholder")}
                isDisabled={isProcessing}
              />
            </div>

            {}
            <div className="p-3 bg-blue-400/10 rounded-lg border border-blue-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs mb-1">
                    {t("agentCreate.renameAvatar.cost")}
                  </p>
                  <p className="text-yellow-400 font-bold text-xl font-w-black-italic">
                    {renameCost} $FLOA
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <FaPencilAlt className="text-xl" />
                  <span className="font-semibold text-sm">
                    {t("agentCreate.renameAvatar.renameAction")}
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="p-3 bg-orange-400/10 rounded-lg">
              <p className="text-orange-300 leading-relaxed text-sm">
                {t("agentCreate.renameAvatar.warning")}
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="gap-3">
          <Button
            variant="light"
            onPress={handleClose}
            isDisabled={isProcessing}
            className="text-white/80 hover:text-white font-w-black-italic"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onPress={handleConfirmRename}
            isLoading={isProcessing}
            isDisabled={isProcessing || !newName.trim()}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold font-w-black-italic"
          >
            {isProcessing
              ? currentStep === "approving"
                ? t("shoppingMall.tokenAuthRequired")
                : currentStep === "executing"
                  ? t("shoppingMall.confirmTransaction")
                  : currentStep === "confirming"
                    ? t("shoppingMall.confirming")
                    : t("common.processing")
              : t("agentCreate.renameAvatar.confirmButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
