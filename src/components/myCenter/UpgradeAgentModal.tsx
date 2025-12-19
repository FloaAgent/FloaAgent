import React, { useEffect, useCallback } from "react";
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
import { useConfigStore } from "@/stores/useConfigStore";
import { useUpgradeAvatar } from "@/hooks/useUpgradeAvatar";
import type { DigitalHuman } from "@/services";

interface UpgradeAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: DigitalHuman | null;
  onSuccess?: () => void;
}

export const UpgradeAgentModal: React.FC<UpgradeAgentModalProps> = ({
  isOpen,
  onClose,
  agent,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { appConfig, fetchAppConfig, getDigitalHumanLevelConfig } =
    useConfigStore();

  
  const { upgradeAvatar, isProcessing } = useUpgradeAvatar({
    onSuccess: () => {
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    },
  });

  
  useEffect(() => {
    if (isOpen && !appConfig) {
      fetchAppConfig();
    }
  }, [isOpen, appConfig, fetchAppConfig]);

  if (!agent) return null;

  const currentLevel = agent.level || 1;
  const targetLevel = currentLevel + 1;
  const currentLevelConfig = getDigitalHumanLevelConfig(currentLevel);

  
  const maxDigitalHumanLevel = appConfig?.maxDigitalHumanLevel
    ? parseInt(appConfig.maxDigitalHumanLevel, 10)
    : 6; 

  
  const isTargetLevelExceeded = targetLevel > maxDigitalHumanLevel;

  
  const isVerified = Boolean(agent.isVerify);

  
  const isVerifiedUpgradeFrom1To2 = isVerified && currentLevel === 1;

  
  const upgradeCost = isVerifiedUpgradeFrom1To2
    ? appConfig?.verifyUpgradePrice || "0"
    : currentLevelConfig?.upgradeCost || "0";

  
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

  
  const checkUpgradeConditions = (): {
    canUpgrade: boolean;
    missingConditions: string[];
    lockedSlotCount: number; 
    qualifiedSlotCount: number; 
  } => {
    
    if (isTargetLevelExceeded) {
      return {
        canUpgrade: false,
        missingConditions: [
          t("upgradeAgent.maxLevelReached", {
            maxLevel: maxDigitalHumanLevel,
          }),
        ],
        lockedSlotCount: 0,
        qualifiedSlotCount: 0,
      };
    }

    
    if (isVerifiedUpgradeFrom1To2) {
      const lockedSlots = agent.slots?.filter((slot: any) => slot.lock === 1) || [];
      return {
        canUpgrade: true,
        missingConditions: [],
        lockedSlotCount: lockedSlots.length,
        qualifiedSlotCount: lockedSlots.length,
      };
    }

    if (!currentLevelConfig) {
      return {
        canUpgrade: false,
        missingConditions: [t("upgradeAgent.configNotFound")],
        lockedSlotCount: 0,
        qualifiedSlotCount: 0,
      };
    }

    const missingConditions: string[] = [];

    
    const lockedSlots = agent.slots?.filter((slot: any) => slot.lock === 1) || [];
    const lockedSlotCount = lockedSlots.length;
    const requiredSlotCount = currentLevelConfig.upgradeRequireSlotCount;

    
    if (lockedSlotCount < requiredSlotCount) {
      missingConditions.push(
        t("upgradeAgent.insufficientValidSlots", {
          current: lockedSlotCount,
          required: requiredSlotCount,
        })
      );
    }

    
    const requiredTrainCountPerSlot = currentLevelConfig.upgradeRequireTrainCount;
    const qualifiedSlots = lockedSlots.filter(
      (slot: any) => (slot.totalTrainCount || 0) >= requiredTrainCountPerSlot
    );
    const qualifiedSlotCount = qualifiedSlots.length;

    if (qualifiedSlotCount < requiredSlotCount) {
      missingConditions.push(
        t("upgradeAgent.insufficientSlotTraining", {
          current: qualifiedSlotCount,
          required: requiredSlotCount,
          trainCount: requiredTrainCountPerSlot,
        })
      );
    }

    return {
      canUpgrade: missingConditions.length === 0,
      missingConditions,
      lockedSlotCount,
      qualifiedSlotCount,
    };
  };

  const { canUpgrade, missingConditions, lockedSlotCount, qualifiedSlotCount } =
    checkUpgradeConditions();

  
  const handleConfirmUpgrade = async () => {
    if (!canUpgrade) {
      addToast({
        title: t("upgradeAgent.conditionsNotMet"),
        description: missingConditions.join("; "),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    if (!appConfig?.interactionContractAddress) {
      addToast({
        title: t("common.error"),
        description: t("upgradeAgent.configNotLoaded"),
        color: "danger",
        severity: "danger",
      });
      return;
    }

    try {
      
      await upgradeAvatar({
        amount: upgradeCost,
        level: targetLevel,
        avatarId: agent.id,
      });
    } catch (error: any) {
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="lg"
      isDismissable={!isProcessing}
      hideCloseButton={isProcessing}
      classNames={{
        base: "bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30 mx-3 my-auto",
        header: "border-b border-yellow-400/30 px-4 sm:px-6 py-3 sm:py-4",
        body: "px-4 sm:px-6 py-3 sm:py-4",
        footer: "border-t border-yellow-400/30 px-4 sm:px-6 py-3 sm:py-4",
        closeButton: "text-yellow-400 hover:bg-yellow-400/20",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-yellow-400 font-w-black-italic text-lg sm:text-xl">
          {t("upgradeAgent.title")}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2.5 sm:space-y-3">
            {}
            <div className="bg-black/30 rounded-lg p-2.5 sm:p-3 border border-yellow-400/20">
              <div className="text-white/60 text-[10px] sm:text-xs mb-1.5 sm:mb-2">
                {t("upgradeAgent.agentInfo")}
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/80">
                    {t("upgradeAgent.agentName")}:
                  </span>
                  <span className="text-yellow-400 font-bold truncate ml-2 max-w-[60%]">
                    {agent.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">
                    {t("upgradeAgent.currentLevel")}:
                  </span>
                  <span className="text-yellow-400 font-bold">
                    Lv.{currentLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">
                    {t("upgradeAgent.targetLevel")}:
                  </span>
                  <span className="text-green-400 font-bold">
                    Lv.{targetLevel}
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="bg-black/30 rounded-lg p-2.5 sm:p-3 border border-yellow-400/20">
              <div className="text-white/60 text-[10px] sm:text-xs mb-1">
                {t("upgradeAgent.upgradeCost")}
              </div>
              <div className="text-yellow-400 font-bold text-lg sm:text-xl font-w-black-italic">
                {formatPrice(upgradeCost)} $FLOA
              </div>
            </div>

            {}
            {isTargetLevelExceeded && (
              <div className="rounded-lg p-2.5 sm:p-3 border bg-red-500/10 border-red-400/30">
                <div className="text-xs sm:text-sm font-bold text-red-400 mb-1.5 sm:mb-2">
                  {t("upgradeAgent.maxLevelReached", {
                    maxLevel: maxDigitalHumanLevel,
                  })}
                </div>
                <div className="text-[10px] sm:text-xs text-white/70">
                  {t("upgradeAgent.maxLevelReachedDesc", {
                    currentLevel,
                    maxLevel: maxDigitalHumanLevel,
                  })}
                </div>
              </div>
            )}

            {}
            {!isVerifiedUpgradeFrom1To2 && !isTargetLevelExceeded && (
              <div
                className={`rounded-lg p-2.5 sm:p-3 border ${
                  canUpgrade
                    ? "bg-green-500/10 border-green-400/30"
                    : "bg-red-500/10 border-red-400/30"
                }`}
              >
                <div
                  className={`text-xs sm:text-sm mb-1.5 sm:mb-2 font-bold ${
                    canUpgrade ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {canUpgrade
                    ? t("upgradeAgent.conditionsMet")
                    : t("upgradeAgent.conditionsNotMet")}
                </div>
                {currentLevelConfig && (
                  <div className="space-y-1 text-[10px] sm:text-xs">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-white/70 flex-1 min-w-0">
                        {t("upgradeAgent.validSlotRequirement")}
                      </span>
                      <span
                        className={`flex-shrink-0 ${
                          lockedSlotCount >=
                          currentLevelConfig.upgradeRequireSlotCount
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {lockedSlotCount} /{" "}
                        {currentLevelConfig.upgradeRequireSlotCount}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <span className="text-white/70 flex-1 min-w-0">
                        {t("upgradeAgent.slotTrainingRequirement", {
                          trainCount:
                            currentLevelConfig.upgradeRequireTrainCount,
                        })}
                      </span>
                      <span
                        className={`flex-shrink-0 ${
                          qualifiedSlotCount >=
                          currentLevelConfig.upgradeRequireSlotCount
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {qualifiedSlotCount} /{" "}
                        {currentLevelConfig.upgradeRequireSlotCount}
                      </span>
                    </div>
                  </div>
                )}

                {}
                {!canUpgrade && missingConditions.length > 0 && (
                  <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-red-400/20">
                    <div className="text-red-400 text-[10px] sm:text-xs space-y-0.5">
                      {missingConditions.map((condition, index) => (
                        <div key={index}>• {condition}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {}
            {isVerifiedUpgradeFrom1To2 && (
              <div className="rounded-lg p-2.5 sm:p-3 border bg-green-500/10 border-green-400/30">
                <div className="text-xs sm:text-sm font-bold text-green-400">
                  ✓ {t("upgradeAgent.verifiedAgent")}
                </div>
                <div className="text-[10px] sm:text-xs text-white/70 mt-1">
                  {t("upgradeAgent.verifiedAgentDesc")}
                </div>
              </div>
            )}

            {}
            {isProcessing && (
              <div className="text-yellow-400 text-[10px] sm:text-xs text-center">
                {t("upgradeAgent.processing")}...
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="gap-2 sm:gap-3">
          <Button
            variant="light"
            onPress={onClose}
            isDisabled={isProcessing}
            size="sm"
            className="text-white/80 hover:text-white font-w-black-italic text-xs sm:text-sm"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onPress={handleConfirmUpgrade}
            isLoading={isProcessing}
            isDisabled={isProcessing || !canUpgrade}
            size="sm"
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold font-w-black-italic text-xs sm:text-sm"
          >
            {t("upgradeAgent.confirmUpgrade")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
