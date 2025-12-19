import React, { useState, useMemo } from "react";
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
import { MdVerified } from "react-icons/md";
import { formatEther } from "viem";
import { agentApi, type DigitalHuman } from "@/services";
import { useConfigStore } from "@/stores/useConfigStore";
import { useAvatarManagement } from "@/hooks/useAvatarManagement";

interface VerifyAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: DigitalHuman | null;
  onSuccess?: () => void; 
}

export const VerifyAgentModal: React.FC<VerifyAgentModalProps> = ({
  isOpen,
  onClose,
  agent,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { appConfig } = useConfigStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const verifyCost = useMemo(() => {
    if (!appConfig?.certifyAvatarPrice) return "1000";
    return formatEther(BigInt(appConfig.certifyAvatarPrice));
  }, [appConfig?.certifyAvatarPrice]);

  
  const {
    certifyAvatar,
    isProcessing: isPaymentProcessing,
    currentStep,
  } = useAvatarManagement({
    onSuccess: () => {
      
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  
  const handleConfirmVerify = async () => {
    if (!agent || isSubmitting || isPaymentProcessing) return;

    
    if (agent.verifyState === 1) {
      addToast({
        title: t("verifyAgent.alreadySubmitted"),
        description: t("verifyAgent.alreadySubmittedDesc"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    
    if (agent.verifyState === 2) {
      if (!appConfig?.certifyAvatarPrice) {
        addToast({
          title: t("common.error"),
          description: t("verifyAgent.configLoadFailed"),
          color: "danger",
          severity: "danger",
        });
        return;
      }

      
      await certifyAvatar({
        amount: appConfig.certifyAvatarPrice,
        avatarId: agent.id,
      });
      return;
    }

    
    setIsSubmitting(true);
    try {
      await agentApi.submitReview(agent.id);

      addToast({
        title: t("verifyAgent.submitSuccess"),
        description: t("verifyAgent.submitSuccessDesc"),
        color: "success",
        severity: "success",
      });
      onClose();

      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      addToast({
        title: t("verifyAgent.submitFailed"),
        description: error?.message || t("verifyAgent.submitFailedDesc"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!agent) return null;

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
          <MdVerified className={agent.verifyState === 2 ? "text-green-500" : agent.verifyState === 3 ? "text-red-500" : "text-blue-500"} />
          {agent.verifyState === 2
            ? t("verifyAgent.paymentTitle")
            : agent.verifyState === 3
            ? t("verifyAgent.rejectedTitle")
            : t("verifyAgent.title")}
        </ModalHeader>

        <ModalBody className="py-4">
          <div className="space-y-4">
            {}
            {agent.verifyState === 2 ? (
              <>
                <p className="text-white/90 text-sm">
                  {t("verifyAgent.paymentIntro")}
                </p>

                {}
                <div className="p-3 bg-green-400/10 rounded-lg border border-green-400/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-xs mb-1">
                        {t("verifyAgent.verifyCost")}
                      </p>
                      <p className="text-yellow-400 font-bold text-xl font-w-black-italic">
                        {verifyCost} $FLOA
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-400">
                      <MdVerified className="text-2xl" />
                      <span className="font-semibold text-sm">
                        {t("verifyAgent.blueBadge")}
                      </span>
                    </div>
                  </div>
                </div>

                {}
                <p className="text-white/70 leading-relaxed text-sm">
                  {t("verifyAgent.agentInfo")}: <span className="text-yellow-400 font-bold">{agent.name}</span> (Lv.{agent.level || 1})
                </p>
              </>
            ) : agent.verifyState === 3 ? (
              
              <>
                <div className="p-3 bg-red-400/10 rounded-lg border border-red-400/30">
                  <p className="text-red-300 text-sm font-semibold mb-2">
                    {t("verifyAgent.reviewRejected")}
                  </p>
                  <p className="text-white/70 text-sm">
                    {t("verifyAgent.rejectedReason")}
                  </p>
                </div>

                <p className="text-white/90 text-sm">
                  {t("verifyAgent.resubmitIntro")}
                </p>

                {}
                <p className="text-white/70 leading-relaxed text-sm">
                  {t("verifyAgent.agentInfo")}: <span className="text-yellow-400 font-bold">{agent.name}</span> (Lv.{agent.level || 1})
                </p>
              </>
            ) : (
              
              <>
                <p className="text-white/90 text-sm">
                  {t("verifyAgent.intro")}
                </p>

                {}
                <div className="space-y-2.5 pl-1">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-yellow-400 font-bold text-sm">1.</span>
                    <div className="flex-1">
                      <span className="text-white/90 font-semibold text-sm">
                        {t("verifyAgent.step1Title")}
                      </span>
                      <p className="text-white/60 text-sm">
                        {t("verifyAgent.step1Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2.5">
                    <span className="text-yellow-400 font-bold text-sm">2.</span>
                    <div className="flex-1">
                      <span className="text-white/90 font-semibold text-sm">
                        {t("verifyAgent.step2Title")}
                      </span>
                      <p className="text-white/60 text-sm">
                        {t("verifyAgent.step2Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2.5">
                    <span className="text-yellow-400 font-bold text-sm">3.</span>
                    <div className="flex-1">
                      <span className="text-white/90 font-semibold text-sm">
                        {t("verifyAgent.step3Title")}
                      </span>
                      <p className="text-white/60 text-sm">
                        {t("verifyAgent.step3Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-yellow-400 font-bold text-sm">4.</span>
                    <div className="flex-1">
                      <span className="text-white/90 font-semibold text-sm">
                        {t("verifyAgent.step4Title")}
                      </span>
                      <p className="text-white/60 text-sm">
                        {t("verifyAgent.step4Desc")}
                      </p>
                    </div>
                  </div>
                </div>

                {}
                <div className="p-3 bg-blue-400/10 rounded-lg border border-blue-400/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-xs mb-1">
                        {t("verifyAgent.verifyCost")}
                      </p>
                      <p className="text-yellow-400 font-bold text-xl font-w-black-italic">
                        {verifyCost} $FLOA
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <MdVerified className="text-2xl" />
                      <span className="font-semibold text-sm">
                        {t("verifyAgent.blueBadge")}
                      </span>
                    </div>
                  </div>
                </div>

                {}
                <div className="p-3 bg-orange-400/10 rounded-lg">
                  <p className="text-orange-300 leading-relaxed text-sm">
                    {t("verifyAgent.notice")}
                  </p>
                </div>

                {}
                <p className="text-white/70 leading-relaxed text-sm">
                  {t("verifyAgent.agentInfo")}: <span className="text-yellow-400 font-bold">{agent.name}</span> (Lv.{agent.level || 1})
                </p>

                {}
                {agent.verifyState === 1 && (
                  <div className="p-3 bg-orange-400/10 rounded-lg border border-orange-400/30">
                    <p className="text-orange-300 text-sm font-semibold">
                      {t("verifyAgent.reviewInProgress")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="gap-3">
          <Button
            variant="light"
            onPress={onClose}
            isDisabled={isSubmitting || isPaymentProcessing}
            className="text-white/80 hover:text-white font-w-black-italic"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onPress={handleConfirmVerify}
            isLoading={isSubmitting || isPaymentProcessing}
            isDisabled={isSubmitting || isPaymentProcessing || agent.verifyState === 1}
            className={
              agent.verifyState === 2
                ? "bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold font-w-black-italic"
                : "bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold font-w-black-italic"
            }
          >
            {isPaymentProcessing
              ? currentStep === 'approving'
                ? t("shoppingMall.tokenAuthRequired")
                : currentStep === 'executing'
                ? t("shoppingMall.confirmTransaction")
                : currentStep === 'confirming'
                ? t("shoppingMall.confirming")
                : t("common.processing")
              : agent.verifyState === 1
              ? t("verifyAgent.reviewInProgress")
              : agent.verifyState === 2
              ? t("verifyAgent.payNow")
              : agent.verifyState === 3
              ? t("verifyAgent.resubmit")
              : t("verifyAgent.confirmApply")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
