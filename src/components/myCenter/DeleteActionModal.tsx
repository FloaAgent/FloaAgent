import React, { useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";
import { addToast } from "@heroui/toast";
import { FaTrash } from "react-icons/fa";
import { formatEther } from "viem";
import { useConfigStore } from "@/stores/useConfigStore";
import { useAvatarManagement } from "@/hooks/useAvatarManagement";

interface DeleteActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotId: number | null;
  avatarId: number | null; 
  actionName?: string;
  onSuccess?: () => void; 
}

export const DeleteActionModal: React.FC<DeleteActionModalProps> = ({
  isOpen,
  onClose,
  slotId,
  avatarId,
  actionName,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { appConfig } = useConfigStore();

  
  const deleteCost = useMemo(() => {
    if (!appConfig?.deleteSlotPrice) return "300";
    return formatEther(BigInt(appConfig.deleteSlotPrice));
  }, [appConfig?.deleteSlotPrice]);

  
  const {
    deleteSlot,
    isProcessing,
    currentStep,
  } = useAvatarManagement({
    onSuccess: () => {
      
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  
  const handleConfirmDelete = async () => {
    if (!slotId || !avatarId || isProcessing) return;

    if (!appConfig?.deleteSlotPrice) {
      addToast({
        title: t("common.error"),
        description: t("deleteAction.configLoadFailed"),
        color: "danger",
        severity: "danger",
      });
      return;
    }

    
    await deleteSlot({
      amount: appConfig.deleteSlotPrice,
      avatarId,
      slotId,
    });
  };

  if (!slotId || !avatarId) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="2xl"
      classNames={{
        base: "bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30",
        closeButton: "text-yellow-400 hover:bg-yellow-400/20",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-yellow-400 font-w-black-italic text-xl flex items-center gap-2">
          <FaTrash className="text-red-500" />
          {t("deleteAction.title")}
        </ModalHeader>

        <ModalBody className="py-4">
          <div className="space-y-4">
            {}
            <p className="text-white/90 text-sm leading-relaxed">
              {t("deleteAction.intro")}
            </p>

            {}
            <div className="p-3 bg-red-400/10 rounded-lg border border-red-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs mb-1">
                    {t("deleteAction.deleteCost")}
                  </p>
                  <p className="text-yellow-400 font-bold text-xl font-w-black-italic">
                    {deleteCost} $FLOA
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-red-400">
                  <FaTrash className="text-xl" />
                  <span className="font-semibold text-sm">
                    {t("deleteAction.deleteAction")}
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="p-3 bg-orange-400/10 rounded-lg">
              <p className="text-orange-300 leading-relaxed text-sm">
                {t("deleteAction.warning")}
              </p>
            </div>

            {}
            {actionName && (
              <p className="text-white/70 leading-relaxed text-sm">
                {t("deleteAction.actionInfo")}: <span className="text-red-400 font-bold">{actionName}</span>
              </p>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="gap-3">
          <Button
            variant="light"
            onPress={onClose}
            isDisabled={isProcessing}
            className="text-white/80 hover:text-white font-w-black-italic"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onPress={handleConfirmDelete}
            isLoading={isProcessing}
            isDisabled={isProcessing}
            className="bg-gradient-to-r from-red-500 via-red-600 to-orange-600 text-white font-bold font-w-black-italic"
          >
            {isProcessing
              ? currentStep === 'approving'
                ? t("shoppingMall.tokenAuthRequired")
                : currentStep === 'executing'
                ? t("shoppingMall.confirmTransaction")
                : currentStep === 'confirming'
                ? t("shoppingMall.confirming")
                : t("common.processing")
              : t("deleteAction.confirmDelete")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
