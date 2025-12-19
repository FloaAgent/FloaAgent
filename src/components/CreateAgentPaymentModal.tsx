import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { addToast } from "@heroui/toast";
import { useConfigStore } from "@/stores/useConfigStore";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import { agentApi } from "@/services";
import { PATHS } from "@/router/paths";

interface CreateAgentPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAgentPaymentModal: React.FC<
  CreateAgentPaymentModalProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { appConfig, fetchAppConfig } = useConfigStore();
  const [preCreatedId, setPreCreatedId] = useState<number | null>(null);
  const [isPreCreating, setIsPreCreating] = useState(false);

  
  const { createAvatar, isProcessing } = useCreateAgent({
    onSuccess: () => {
      
      if (preCreatedId) {
        navigate(`${PATHS.AGENT_CREATE}/${preCreatedId}`);
        onClose();
        setPreCreatedId(null);
      }
    },
  });

  
  useEffect(() => {
    if (isOpen && !appConfig) {
      fetchAppConfig();
    }
  }, [isOpen, appConfig, fetchAppConfig]);

  
  const formatPrice = (weiPrice: string): string => {
    try {
      const value = BigInt(weiPrice);
      const divisor = BigInt(10 ** 18);
      const floa = Number(value) / Number(divisor);

      return floa.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    } catch (error) {
      return "0";
    }
  };

  
  const handleConfirmPayment = async () => {
    if (!appConfig?.createPrice) {
      addToast({
        title: t("common.error"),
        description: t("createAgent.configNotLoaded"),
        color: "danger",
        severity: "danger",
      });
      return;
    }

    try {
      setIsPreCreating(true);

      
      const preCreateResponse = await agentApi.preCreate();

      if (preCreateResponse.code !== 0 || !preCreateResponse.data?.id) {
        throw new Error(preCreateResponse.message || "Pre-create failed");
      }

      const digitalHumanId = preCreateResponse.data.id;
      setPreCreatedId(digitalHumanId);

      addToast({
        title: t("createAgent.preCreateSuccess"),
        description: t("createAgent.preCreateSuccessDesc"),
        color: "primary",
        severity: "primary",
      });

      
      await createAvatar({
        amount: appConfig.createPrice,
        level: 1, 
        avatarId: digitalHumanId,
      });
    } catch (error: any) {
      addToast({
        title: t("createAgent.paymentFailed"),
        description: error?.message || t("createAgent.paymentFailedDesc"),
        color: "danger",
        severity: "danger",
      });

      
      setPreCreatedId(null);
    } finally {
      setIsPreCreating(false);
    }
  };

  const price = appConfig?.createPrice || "0";
  const isLoading = isPreCreating || isProcessing;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
      classNames={{
        base: "bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30",
        closeButton: "text-yellow-400 hover:bg-yellow-400/20",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-yellow-400 font-w-black-italic text-xl">
          {t("createAgent.paymentTitle")}
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="space-y-4">
            {}
            <div className="bg-black/30 rounded-lg p-4 border border-yellow-400/20">
              <div className="text-white/60 text-sm mb-2">
                {t("createAgent.createPrice")}:
              </div>
              <div className="text-yellow-400 font-bold text-2xl font-w-black-italic">
                {formatPrice(price)} $FLOA
              </div>
            </div>

            {}
            <div className="text-white/70 text-sm leading-relaxed space-y-2">
              <p>{t("createAgent.paymentDescription")}</p>
              {isPreCreating && (
                <p className="text-yellow-400">
                  {t("createAgent.preCreating")}...
                </p>
              )}
              {isProcessing && !isPreCreating && (
                <p className="text-yellow-400">
                  {t("createAgent.processing")}...
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="gap-3">
          <Button
            variant="light"
            onPress={onClose}
            isDisabled={isLoading}
            className="text-white/80 hover:text-white font-w-black-italic"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onPress={handleConfirmPayment}
            isLoading={isLoading}
            isDisabled={isLoading}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold font-w-black-italic"
          >
            {t("createAgent.confirmPayment")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
