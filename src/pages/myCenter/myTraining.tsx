import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { RiRobot2Fill } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { agentApi, type DigitalHuman, type Slot } from "@/services";
import { useWalletStore } from "@/stores/useWalletStore";
import { useConfigStore } from "@/stores/useConfigStore";
import { PATHS } from "@/router/paths";
import { UpgradeAgentModal } from "@/components/myCenter/UpgradeAgentModal";


const MyTraining: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userInfo } = useWalletStore();
  const { getDigitalHumanLevelConfig } = useConfigStore();
  const [agents, setAgents] = useState<DigitalHuman[]>([]);
  const [agentSlots, setAgentSlots] = useState<Record<number, Slot[]>>({}); 
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 9;

  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedAgentForUpgrade, setSelectedAgentForUpgrade] =
    useState<DigitalHuman | null>(null);

  
  const fetchChatHistory = async (page: number = 1) => {
    if (!userInfo) return;

    setIsLoading(true);
    try {
      const response = await agentApi.getChatHistoryList({
        page: String(page),
        pageSize: String(pageSize),
      });

      
      const agentList = response.data.list || [];

      
      const updatedAgents = agentList.map((agent) => {
        if (agent.stats) {
          
          return {
            ...agent,
            level: agent.stats.level,
            trainingUserCount: agent.stats.trainingUserCount,
            totalTrainingToken: agent.stats.totalTrainingToken,
          };
        }
        return agent;
      });

      setAgents(updatedAgents);
      const total = response.data.total || 0;
      setTotalCount(total);
      setTotalPages(Math.ceil(total / pageSize));

      
      const slotsMap: Record<number, Slot[]> = {};
      updatedAgents.forEach((agent) => {
        if (agent.slots) {
          slotsMap[agent.id] = agent.slots as Slot[];
        }
      });
      setAgentSlots(slotsMap);
    } catch (error) {
      addToast({
        title: t("common.getFailed"),
        description: t("myTraining.fetchFailed"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchChatHistory(page);
  };

  
  const handleUpgradeClick = (agent: DigitalHuman) => {
    setSelectedAgentForUpgrade(agent);
    setIsUpgradeModalOpen(true);
  };

  
  const handleUpgradeSuccess = () => {
    
    fetchChatHistory(currentPage);
    addToast({
      title: t("common.success"),
      description: t("upgradeAgent.upgradeSuccess"),
      color: "success",
      severity: "success",
    });
  };

  
  useEffect(() => {
    if (userInfo) {
      fetchChatHistory(currentPage);
    }
  }, [userInfo]);

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-[1px] border-b-primary/30">
        <h1 className="text-primary text-xl font-bold">
          {t("myTraining.title")}（{totalCount}）
        </h1>
      </div>

      {}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner size="lg" color="primary" />
          </div>
        ) : agents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 px-6">
            {}
            <div className="relative mb-8">
              {}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-3xl scale-150" />

              {}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/10 to-blue-500/10 border-2 border-purple-400/30 flex items-center justify-center">
                <RiRobot2Fill className="w-16 h-16 text-purple-400/60" />
              </div>
            </div>

            {}
            <h3 className="text-2xl font-bold text-white/80 mb-3 font-w-black-italic">
              {t("myTraining.noRecords")}
            </h3>
            <p className="text-white/50 text-base max-w-md text-center leading-relaxed">
              {t("myTraining.noRecordsDesc")}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {agents.map((agent) => {
                const slots = agentSlots[agent.id] || [];
                return (
                  <Card
                    key={agent.id}
                    className="bg-gradient-to-br from-[#5F4001]/80 to-[#371B00]/80 hover:from-[#5F4001] hover:to-[#371B00] transition-all duration-300"
                  >
                    <CardBody className="p-4 space-y-3">
                      {}
                      <div className="grid grid-cols-2 gap-4">
                        {}
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar
                                src={agent.avatarUrl}
                                size="lg"
                                name={agent.name}
                                className="ring-2 ring-yellow-400/50"
                              />
                              {Boolean(agent.isVerify) && (
                                <div className="absolute -bottom-1 -right-1 bg-black/50 rounded-full p-0.5">
                                  <MdVerified className="text-blue-500 text-base" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-yellow-400">
                                {agent.name}
                              </h3>

                              <div className="flex items-center gap-2">
                                <Chip
                                  className="bg-yellow-400/20 text-yellow-400 text-xs h-6"
                                  variant="flat"
                                  size="sm"
                                >
                                  {agent.personalityType}
                                </Chip>
                                {}
                                {agent.user?.twitterUsername && (
                                  <a
                                    href={`https://twitter.com/${agent.user.twitterUsername}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FaXTwitter className="text-sm" />
                                    <span>@{agent.user.twitterUsername}</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {}
                        <div className="flex items-start justify-end gap-2">
                          {}
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black font-bold text-sm h-8 min-w-16"
                            onPress={() => {
                              navigate(`${PATHS.AGENT_CHAT}/${agent.id}`);
                            }}
                          >
                            {t("myTraining.train")}
                          </Button>

                          {}
                          {agent.userId === userInfo?.id && (
                            <>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-bold text-sm h-8 min-w-16"
                                onPress={() => handleUpgradeClick(agent)}
                              >
                                {t("myTraining.upgrade")}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black font-bold text-sm h-8 min-w-20"
                                onPress={() => {
                                  navigate(`${PATHS.AGENT_CREATE}/${agent.id}`);
                                }}
                              >
                                {t("myTraining.addAction")}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {}
                      <div className="space-y-2 bg-black/30 rounded-lg p-3 border border-yellow-400/20">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/60">ID</span>
                            <span className="text-sm font-mono text-yellow-400">
                              #{agent.id}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/60">{t("myTraining.level")}</span>
                            <div className="flex items-center gap-1">
                              {agent.level &&
                                agent.level >= 1 &&
                                agent.level <= 6 && (
                                  <img
                                    src={`/img/level/lv-${agent.level}.png`}
                                    alt={`Level ${agent.level}`}
                                    className="w-5 h-5 object-contain"
                                  />
                                )}
                              <span className="text-sm font-semibold text-yellow-400">
                                Lv.{agent.level || 1}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/60">
                              {t("myTraining.trainingEarnings")}
                            </span>
                            <span className="text-sm font-semibold text-yellow-400">
                              {agent.totalTrainingToken
                                ? `${(
                                  parseFloat(agent.totalTrainingToken) / 1e18
                                ).toFixed(2)} $FLOA`
                                : "0 $FLOA"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/60">
                              {t("myTraining.trainingUsers")}
                            </span>
                            <span className="text-sm font-semibold text-yellow-400">
                              {agent.trainingUserCount || 0}
                            </span>
                          </div>
                        </div>

                        <Divider className="bg-yellow-400/20 my-2" />

                        {}
                        <div>
                          <p className="text-xs text-white/60 mb-2">{t("myTraining.upgradePath")}</p>
                          <div className="flex items-center justify-between gap-0.5">
                            {[1, 2, 3, 4, 5, 6].map((level, index) => (
                              <React.Fragment key={level}>
                                {index > 0 && (
                                  <div
                                    className={`h-px flex-1 ${(agent.level || 1) >= level
                                      ? "bg-yellow-400"
                                      : "bg-white/20"
                                      }`}
                                  />
                                )}
                                <div className="relative">
                                  <img
                                    src={`/img/level/lv-${level}.png`}
                                    alt={`Level ${level}`}
                                    className={`w-6 h-6 object-contain ${(agent.level || 1) >= level
                                      ? "opacity-100"
                                      : "opacity-30"
                                      }`}
                                  />
                                </div>
                              </React.Fragment>
                            ))}
                            <div className="text-xs text-white/40 ml-0.5">
                              ...
                            </div>
                          </div>
                        </div>
                      </div>

                      <Divider className="bg-yellow-400/20" />

                      {}
                      {slots.length > 0 && (
                        <div className="space-y-2">
                          {}
                          <div className="bg-black/30 rounded-lg p-2 border border-yellow-400/20">
                            <p className="text-[10px] text-white/60 mb-1.5">
                              {t("myTraining.totalUpgradeTraining")}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {slots.map((slot) => {
                                const config = getDigitalHumanLevelConfig(
                                  slot.level
                                );
                                const maxCount = config?.upgradeRequireTrainCount || 0;

                                return slot.emotions ? (
                                  <div
                                    key={slot.id}
                                    className="flex items-center gap-1 bg-black/40 rounded px-1.5 py-0.5"
                                  >
                                    {slot.emotions
                                      .split(",")
                                      .map((emotion, idx) => (
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
                                ) : null;
                              })}
                            </div>
                          </div>

                          {}
                          <div className="bg-black/30 rounded-lg p-2 border border-yellow-400/20">
                            <p className="text-[10px] text-white/60 mb-1.5">
                              {t("myTraining.dailyActionTraining")}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {slots.map((slot) => {
                                const config = getDigitalHumanLevelConfig(
                                  slot.level
                                );
                                const maxCount = config?.dailyMaxAttempt || 0;

                                return slot.emotions ? (
                                  <div
                                    key={slot.id}
                                    className="flex items-center gap-1 bg-black/40 rounded px-1.5 py-0.5"
                                  >
                                    {slot.emotions
                                      .split(",")
                                      .map((emotion, idx) => (
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
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })}
            </div>

            {}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 pb-4">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  showControls
                  color="primary"
                />
              </div>
            )}
          </>
        )}
      </div>

      {}
      <UpgradeAgentModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        agent={selectedAgentForUpgrade}
        onSuccess={handleUpgradeSuccess}
      />
    </div>
  );
};

export default MyTraining;
