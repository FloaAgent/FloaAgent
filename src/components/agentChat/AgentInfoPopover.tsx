import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { FaChevronDown } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { formatEther } from "viem";
import { useTranslation } from "react-i18next";
import { useConfigStore } from "@/stores/useConfigStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { PATHS } from "@/router/paths";
import type { DigitalHuman, Slot } from "@/services";
import { UpgradeAgentModal } from "@/components/myCenter/UpgradeAgentModal";

interface AgentInfoPopoverProps {
  agent: DigitalHuman;
  slots: Slot[];
  onRefresh?: () => void; 
}


export const AgentInfoPopover: React.FC<AgentInfoPopoverProps> = ({
  agent,
  slots,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getTrainingTicketConfig, getDigitalHumanLevelConfig } =
    useConfigStore();
  const { userInfo } = useWalletStore();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  
  const isOwnAgent = userInfo && agent.userId === userInfo.id;

  return (
    <>
      <Popover
        placement="bottom-start"
        showArrow
        onOpenChange={(isOpen) => {
          
          if (isOpen && onRefresh) {
            onRefresh();
          }
        }}
      >
        <PopoverTrigger>
          <div className="cursor-pointer flex items-center gap-2 sm:gap-2 hover:opacity-80 transition-opacity">
            <div className="relative">
              <Avatar
                src={agent.avatarUrl}
                size="sm"
                name={agent.name}
                isBordered
                color="primary"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              {Boolean(agent.isVerify) && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-black/50 rounded-full p-0.5">
                  <MdVerified className="text-blue-500 text-xs" />
                </div>
              )}
            </div>
            <FaChevronDown className="text-default-500 text-xs" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="overflow-hidden p-0 w-[300px] sm:w-[500px]">
          <div className="p-2 sm:p-4 space-y-2 sm:space-y-3 bg-gradient-to-br from-[#5F4001] to-[#371B00] max-h-[70vh] w-full overflow-y-auto">
            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar
                      src={agent.avatarUrl}
                      size="sm"
                      name={agent.name}
                      className="ring-2 ring-yellow-400/50 w-8 h-8 sm:w-10 sm:h-10"
                    />
                    {Boolean(agent.isVerify) && (
                      <div className="absolute -bottom-1 -right-1 bg-black/50 rounded-full p-0.5">
                        <MdVerified className="text-blue-500 text-xs sm:text-sm" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-yellow-400 truncate">
                      {agent.name}
                    </h3>
                    <Chip
                      className="bg-yellow-400/20 text-yellow-400 text-[10px] h-5"
                      variant="flat"
                      size="sm"
                    >
                      {agent.personalityType}
                    </Chip>
                  </div>
                </div>

                {}
                <div className="hidden sm:block space-y-1.5">
                  <div>
                    <p className="text-[10px] text-white/60 mb-0.5">
                      {t("agentChat.introduction")}
                    </p>
                    <p className="text-xs text-white/90 line-clamp-2 leading-tight">
                      {agent.introduction || t("agentChat.noIntroduction")}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/60 mb-0.5">
                      {t("agentChat.skill")}
                    </p>
                    <p className="text-xs text-white/90 line-clamp-2 leading-tight">
                      {agent.skill || t("agentChat.noSkills")}
                    </p>
                  </div>
                </div>
              </div>

              {}
              <div className="space-y-1.5 sm:space-y-2 bg-black/30 rounded-lg p-2 sm:p-3 border border-yellow-400/20">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/60">ID</span>
                    <span className="text-xs font-mono text-yellow-400">
                      #{agent.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/60">
                      {t("agentChat.level")}
                    </span>
                    <div className="flex items-center gap-1">
                      {agent.level && agent.level >= 1 && agent.level <= 6 && (
                        <img
                          src={`/img/level/lv-${agent.level}.png`}
                          alt={`Level ${agent.level}`}
                          className="w-4 h-4 object-contain"
                        />
                      )}
                      <span className="text-xs font-semibold text-yellow-400">
                        Lv.{agent.level || 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/60">
                      {t("agentChat.trainingEarnings")}
                    </span>
                    <span className="text-xs font-semibold text-yellow-400 truncate max-w-[120px]">
                      {agent.totalTrainingToken
                        ? `${formatEther(BigInt(agent.totalTrainingToken))} $FLOA`
                        : "0 $FLOA"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/60">
                      {t("agentChat.trainingUsers")}
                    </span>
                    <span className="text-xs font-semibold text-yellow-400">
                      {agent.trainingUserCount || 0}
                    </span>
                  </div>
                </div>

                <Divider className="bg-yellow-400/20 my-1 sm:my-1.5" />

                {}
                <div>
                  <p className="text-[10px] text-white/60 mb-1.5">
                    {t("agentChat.upgradePath")}
                  </p>
                  <div className="flex items-center justify-between gap-0.5">
                    {[1, 2, 3, 4, 5, 6].map((level, index) => (
                      <React.Fragment key={level}>
                        {index > 0 && (
                          <div
                            className={`h-px flex-1 ${
                              (agent.level || 1) >= level
                                ? "bg-yellow-400"
                                : "bg-white/20"
                            }`}
                          />
                        )}
                        <div className="relative">
                          <img
                            src={`/img/level/lv-${level}.png`}
                            alt={`Level ${level}`}
                            className={`w-5 h-5 object-contain ${
                              (agent.level || 1) >= level
                                ? "opacity-100"
                                : "opacity-30"
                            }`}
                          />
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="text-[10px] text-white/40 ml-0.5">...</div>
                  </div>
                </div>
              </div>
            </div>

            <Divider className="bg-yellow-400/20" />

            {}
            {slots.filter((slot) => slot.lock === 1).length > 0 && (
              <div className="space-y-2">
                {}
                <div className="bg-black/30 rounded-lg p-2 border border-yellow-400/20">
                  <p className="text-[10px] text-white/60 mb-1.5">
                    {t("agentChat.totalUpgradeTraining")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {slots
                      .filter((slot) => slot.lock === 1 && slot.emotions)
                      .map((slot) => {
                        const config = getDigitalHumanLevelConfig(slot.level);
                        const maxCount = config?.upgradeRequireTrainCount || 0;

                        return (
                          <div
                            key={slot.id}
                            className="flex items-center gap-1 bg-black/40 rounded px-1.5 py-0.5"
                          >
                            {slot.emotions.split(",").map((emotion, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] text-yellow-400"
                              >
                                {emotion.trim()}
                              </span>
                            ))}
                            <span className="text-[10px] text-white/70">
                              {slot.totalTrainCount}/{maxCount}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {}
                <div className="bg-black/30 rounded-lg p-2 border border-yellow-400/20">
                  <p className="text-[10px] text-white/60 mb-1.5">
                    {t("agentChat.dailyActionTraining")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {slots
                      .filter((slot) => slot.lock === 1 && slot.emotions)
                      .map((slot) => {
                        const config = getTrainingTicketConfig(slot.level);
                        const maxCount = config?.dailyMaxAttempt || 0;

                        return (
                          <div
                            key={slot.id}
                            className="flex items-center gap-1 bg-black/40 rounded px-1.5 py-0.5"
                          >
                            {slot.emotions.split(",").map((emotion, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] text-orange-400"
                              >
                                {emotion.trim()}
                              </span>
                            ))}
                            <span className="text-[10px] text-white/70">
                              {slot.todayTrainCount}/{maxCount}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {}
            {isOwnAgent && (
              <div className="flex gap-2 mt-2">
                <Button
                  variant="solid"
                  size="sm"
                  className="hidden sm:flex flex-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold text-xs h-8"
                  onPress={() => {
                    navigate(`${PATHS.AGENT_CREATE}/${agent.id}`);
                  }}
                >
                  {t("agentChat.addAction")}
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold text-xs h-8"
                  onPress={() => {
                    setIsUpgradeModalOpen(true);
                  }}
                >
                  {t("agentChat.upgrade")}
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {}
      <UpgradeAgentModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        agent={{
          ...agent,
          slots: agent.slots ? agent.slots : agent.activeSlots,
        }}
        onSuccess={() => {
          
          if (onRefresh) {
            onRefresh();
          }
        }}
      />
    </>
  );
};
