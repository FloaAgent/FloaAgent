import React, { useMemo, useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { SelectItem } from "@heroui/select";
import { useTranslation } from "react-i18next";
import { addToast } from "@heroui/toast";
import { FaMicrophone, FaPlay, FaStop } from "react-icons/fa";
import { formatEther } from "viem";
import { useConfigStore } from "@/stores/useConfigStore";
import { useAvatarManagement } from "@/hooks/useAvatarManagement";
import { CustomSelect } from "@/components/ui";
import type { VoiceModel } from "@/services";

interface ChangeVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarId: number | null;
  currentVoiceGender: string; 
  currentVoiceType: string; 
  voiceModels: VoiceModel[]; 
  onSuccess?: () => void;
}


const getVoiceModelLocalizedName = (
  voiceId: number,
  currentLang: string
): string => {
  const voiceNameMap: Record<number, { zh: string; en: string }> = {
    1: { zh: "淘气女孩", en: "Naughty Girl" },
    2: { zh: "迷人女孩", en: "Alluring Girl" },
    3: { zh: "成熟女孩", en: "Mature Girl" },
    4: { zh: "机器男孩", en: "Machine Boy" },
    5: { zh: "中年男孩", en: "Middle Aged Boy" },
    15: { zh: "年轻男孩", en: "Young Boy" },
    16: { zh: "聪明男孩", en: "Wise Boy" },
  };

  const nameObj = voiceNameMap[voiceId];
  if (!nameObj) return "";

  
  return currentLang.startsWith("zh") ? nameObj.zh : nameObj.en;
};

export const ChangeVoiceModal: React.FC<ChangeVoiceModalProps> = ({
  isOpen,
  onClose,
  avatarId,
  currentVoiceGender,
  currentVoiceType,
  voiceModels,
  onSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const { appConfig } = useConfigStore();
  const [newVoiceGender, setNewVoiceGender] = useState(currentVoiceGender);
  const [newVoiceType, setNewVoiceType] = useState(currentVoiceType);

  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  
  const changeVoiceCost = useMemo(() => {
    if (!appConfig?.changeVoiceModelPrice) return "100";
    return formatEther(BigInt(appConfig.changeVoiceModelPrice));
  }, [appConfig?.changeVoiceModelPrice]);

  
  const VOICE_GENDER_OPTIONS = [
    { value: "1", label: t("voiceGender.male") },
    { value: "2", label: t("voiceGender.female") },
  ];

  
  const filteredVoiceModels = useMemo(() => {
    if (!newVoiceGender) return [];
    return voiceModels.filter(
      (voice) => voice.gender === Number(newVoiceGender)
    );
  }, [voiceModels, newVoiceGender]);

  
  const currentVoiceModel = useMemo(() => {
    return voiceModels.find((v) => v.id.toString() === currentVoiceType);
  }, [voiceModels, currentVoiceType]);

  
  const newVoiceModel = useMemo(() => {
    return voiceModels.find((v) => v.id.toString() === newVoiceType);
  }, [voiceModels, newVoiceType]);

  
  const formatVoiceDisplay = (genderId: string, voiceModel?: VoiceModel) => {
    if (!voiceModel) return "-";
    
    const genderLabel =
      genderId === "1"
        ? t("voiceGender.male")
        : genderId === "2"
          ? t("voiceGender.female")
          : "";
    const voiceName = getVoiceModelLocalizedName(voiceModel.id, i18n.language);
    return `${genderLabel} - ${voiceName}`;
  };

  
  const { changeVoiceModel, isProcessing, currentStep } = useAvatarManagement({
    onSuccess: () => {
      
      onClose();
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2500);
      }
    },
  });

  
  const handleGenderChange = (value: string) => {
    setNewVoiceGender(value);
    setNewVoiceType(""); 
  };

  
  const handlePlayVoice = () => {
    if (!newVoiceType) {
      addToast({
        title: t("common.hint"),
        description: t("agentCreate.basicInfo.selectVoiceFirst"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    const selectedVoice = voiceModels.find(
      (v) => v.id.toString() === newVoiceType
    );
    if (!selectedVoice) return;

    const lang = i18n.language.startsWith("zh") ? "zh" : "en";
    const audioPath = `/audio/${lang}/${selectedVoice.model}.mp3`;

    
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
      return;
    }

    
    const audio = new Audio(audioPath);
    audioRef.current = audio;

    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => {
      setIsPlayingAudio(false);
      addToast({
        title: t("common.error"),
        description: t("agentCreate.basicInfo.audioLoadFailed"),
        color: "danger",
        severity: "danger",
      });
    };

    audio
      .play()
      .then(() => {
        setIsPlayingAudio(true);
      })
      .catch((error) => {
        setIsPlayingAudio(false);
        addToast({
          title: t("common.error"),
          description: t("agentCreate.basicInfo.audioPlayFailed"),
          color: "danger",
          severity: "danger",
        });
      });
  };

  
  const handleConfirmChange = async () => {
    if (!avatarId || isProcessing) return;

    
    if (!newVoiceGender || !newVoiceType) {
      addToast({
        title: t("common.hint"),
        description: t("agentCreate.changeVoice.voiceRequired"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    
    if (
      newVoiceGender === currentVoiceGender &&
      newVoiceType === currentVoiceType
    ) {
      addToast({
        title: t("common.hint"),
        description: t("agentCreate.changeVoice.voiceSameAsOld"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    if (!appConfig?.changeVoiceModelPrice || !newVoiceModel) {
      addToast({
        title: t("common.error"),
        description: t("agentCreate.changeVoice.configLoadFailed"),
        color: "danger",
        severity: "danger",
      });
      return;
    }

    
    await changeVoiceModel({
      amount: appConfig.changeVoiceModelPrice,
      avatarId,
      newModelName: newVoiceModel.model, 
    });
  };

  
  const handleClose = () => {
    if (!isProcessing) {
      setNewVoiceGender(currentVoiceGender);
      setNewVoiceType(currentVoiceType);
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
          <FaMicrophone className="text-purple-400" />
          {t("agentCreate.changeVoice.title")}
        </ModalHeader>

        <ModalBody className="py-4">
          <div className="space-y-4">
            {}
            <p className="text-white/90 text-sm leading-relaxed">
              {t("agentCreate.changeVoice.intro")}
            </p>

            {}
            <div>
              <label className="text-white/70 text-sm mb-2 block">
                {t("agentCreate.changeVoice.currentVoice")}
              </label>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white font-medium">
                  {formatVoiceDisplay(currentVoiceGender, currentVoiceModel)}
                </p>
              </div>
            </div>

            {}
            <div className="space-y-3">
              <label className="text-white/70 text-sm block">
                {t("agentCreate.changeVoice.newVoice")}
              </label>

              <div className="flex gap-2">
                {}
                <CustomSelect
                  label={t("agentCreate.basicInfo.voiceGenderLabel")}
                  placeholder={t(
                    "agentCreate.basicInfo.voiceGenderPlaceholder"
                  )}
                  selectedKeys={newVoiceGender ? [newVoiceGender] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    handleGenderChange(value || "");
                  }}
                  isDisabled={isProcessing}
                  classNames={{
                    trigger: "bg-transparent",
                  }}
                >
                  {VOICE_GENDER_OPTIONS.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </CustomSelect>

                {}
                <CustomSelect
                  label={t("agentCreate.basicInfo.voiceModelLabel")}
                  placeholder={t("agentCreate.basicInfo.voiceModelPlaceholder")}
                  selectedKeys={newVoiceType ? [newVoiceType] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setNewVoiceType(value || "");
                  }}
                  isDisabled={isProcessing || !newVoiceGender}
                  classNames={{
                    trigger: "bg-transparent",
                  }}
                >
                  {filteredVoiceModels.length > 0 ? (
                    filteredVoiceModels.map((voice) => {
                      const voiceName = getVoiceModelLocalizedName(
                        voice.id,
                        i18n.language
                      );
                      return (
                        <SelectItem
                          key={voice.id.toString()}
                          value={voice.id.toString()}
                        >
                          {voiceName}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem key="no-voice" value="">
                      {t("agentCreate.basicInfo.noVoiceAvailable")}
                    </SelectItem>
                  )}
                </CustomSelect>

                {}
                {newVoiceType && (
                  <Button
                    size="sm"
                    onPress={handlePlayVoice}
                    isDisabled={isProcessing}
                    className="bg-gradient-to-r h-auto from-green-500 to-green-600 text-white font-semibold min-w-fit px-3"
                    startContent={
                      isPlayingAudio ? (
                        <FaStop className="text-sm" />
                      ) : (
                        <FaPlay className="text-sm" />
                      )
                    }
                  >
                    {isPlayingAudio
                      ? t("agentCreate.basicInfo.stopVoice")
                      : t("agentCreate.basicInfo.playVoice")}
                  </Button>
                )}
              </div>
            </div>

            {}
            <div className="p-3 bg-purple-400/10 rounded-lg border border-purple-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs mb-1">
                    {t("agentCreate.changeVoice.cost")}
                  </p>
                  <p className="text-yellow-400 font-bold text-xl font-w-black-italic">
                    {changeVoiceCost} $FLOA
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-purple-400">
                  <FaMicrophone className="text-xl" />
                  <span className="font-semibold text-sm">
                    {t("agentCreate.changeVoice.changeAction")}
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="p-3 bg-orange-400/10 rounded-lg">
              <p className="text-orange-300 leading-relaxed text-sm">
                {t("agentCreate.changeVoice.warning")}
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
            onPress={handleConfirmChange}
            isLoading={isProcessing}
            isDisabled={isProcessing || !newVoiceGender || !newVoiceType}
            className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold font-w-black-italic"
          >
            {isProcessing
              ? currentStep === "approving"
                ? t("shoppingMall.tokenAuthRequired")
                : currentStep === "executing"
                  ? t("shoppingMall.confirmTransaction")
                  : currentStep === "confirming"
                    ? t("shoppingMall.confirming")
                    : t("common.processing")
              : t("agentCreate.changeVoice.confirmButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
