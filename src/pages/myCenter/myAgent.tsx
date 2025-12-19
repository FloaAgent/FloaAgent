import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdVerified, MdEdit } from "react-icons/md";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { addToast } from "@heroui/toast";
import { useTranslation } from "react-i18next";
import { agentApi, type DigitalHuman } from "@/services";
import { useWalletStore } from "@/stores/useWalletStore";
import { PATHS } from "@/router/paths";
import { RiRobot2Fill } from "react-icons/ri";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { GiArtificialIntelligence } from "react-icons/gi";
import { VerifyAgentModal } from "@/components/myCenter/VerifyAgentModal";

const MyAgent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userInfo } = useWalletStore();
  const [agents, setAgents] = useState<DigitalHuman[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const pageSize = 24;
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<DigitalHuman | null>(null);

  useEffect(() => {
    fetchAgents();
  }, [userInfo, currentPage]);

  const fetchAgents = async (keyword?: string) => {
    if (!userInfo) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await agentApi.getList({
        page: currentPage,
        pageSize: pageSize,
        userId: userInfo.id,
        keyword: keyword || searchKeyword || undefined, 
      });

      setAgents(response.data.list || []);
      setTotalCount(response.data.total || 0);
      setTotalPages(Math.ceil(response.data.total / pageSize));
    } catch (error) {
      addToast({
        title: t("myAgent.fetchFailed"),
        description: t("myAgent.fetchFailedDesc"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleAgentClick = (agent: DigitalHuman) => {
    
    if (!agent.avatarUrl) {
      navigate(`${PATHS.AGENT_CREATE}/${agent.id}`);
    }
    
  };

  
  const handleTrainClick = (e: React.MouseEvent, agent: DigitalHuman) => {
    e.stopPropagation();
    navigate(`${PATHS.AGENT_CHAT}/${agent.id}`);
  };

  
  const handleEditClick = (e: React.MouseEvent, agent: DigitalHuman) => {
    e.stopPropagation();
    navigate(`${PATHS.AGENT_CREATE}/${agent.id}`);
  };

  
  const handleVerifyClick = (e: React.MouseEvent, agent: DigitalHuman) => {
    e.stopPropagation();
    setSelectedAgent(agent);
    setIsVerifyModalOpen(true);
  };

  const handleSearch = () => {
    
    setCurrentPage(1);
    fetchAgents(searchKeyword);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        {}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border-2 border-yellow-400/20 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-yellow-400/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {}
        <h3 className="text-xl font-bold text-white/70 mb-2 font-w-black-italic">
          {t("myAgent.pleaseLogin")}
        </h3>
        <p className="text-white/50 text-sm">{t("myAgent.pleaseLoginDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b-[1px] border-b-primary/30">
        <h1 className="text-primary text-xl font-bold">
          {t("myAgent.title")}（{totalCount}）
        </h1>
        <div className="text-sm text-primary">
          <Input
            variant="bordered"
            type="search"
            labelPlacement="outside"
            placeholder={t("myAgent.searchInputPlaceholder")}
            value={searchKeyword}
            onValueChange={setSearchKeyword}
            onKeyDown={handleKeyDown}
            startContent={
              <FaSearch className="text-xl text-default-400 pointer-events-none shrink-0" />
            }
            endContent={
              <Button size="sm" onPress={handleSearch}>
                {t("myAgent.searchButton")}
              </Button>
            }
            classNames={{
              input: "bg-transparent",
              inputWrapper:
                "bg-black/50 border-default-200 data-[hover=true]:border-default-400",
            }}
          />
        </div>
      </div>

      {}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          {}
          <div className="relative mb-8">
            {}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl scale-150" />

            {}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border-2 border-yellow-400/30 flex items-center justify-center">
              <RiRobot2Fill className="w-16 h-16 text-yellow-400/60" />
            </div>
          </div>

          {}
          <h3 className="text-2xl font-bold text-white/80 mb-3 font-w-black-italic">
            {searchKeyword
              ? t("myAgent.noMatchingAgents")
              : t("myAgent.noData")}
          </h3>
          <p className="text-white/50 text-base max-w-md text-center leading-relaxed mb-6">
            {searchKeyword
              ? t("myAgent.noMatchingAgentsDesc")
              : t("myAgent.noDataDesc")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4">
            {agents.map((agent) => {
              const isIncomplete = !agent.avatarUrl; 

              return (
                <div
                  key={agent.id}
                  className={`relative overflow-hidden rounded-lg transition-all ${
                    isIncomplete
                      ? "cursor-pointer active:scale-[0.98]"
                      : ""
                  }`}
                  onClick={() => isIncomplete && handleAgentClick(agent)}
                  onKeyDown={(e) => {
                    if (isIncomplete && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      handleAgentClick(agent);
                    }
                  }}
                  role={isIncomplete ? "button" : undefined}
                  tabIndex={isIncomplete ? 0 : undefined}
                  aria-label={
                    isIncomplete
                      ? `${t("myAgent.viewAgent")} ${agent.name}`
                      : undefined
                  }
                >
                  <div
                    className={`flex flex-col border rounded-lg transition-colors ${
                      isIncomplete
                        ? "border-yellow-400/30 border-dashed bg-gradient-to-br from-yellow-400/10 to-orange-500/10"
                        : "border-yellow-400/20 bg-[#1A1A1A] hover:border-yellow-400/40"
                    }`}
                  >
                    <div className="relative w-full bg-black rounded-t-lg overflow-hidden group">
                      {isIncomplete ? (
                        
                        <div
                          className="w-full flex flex-col items-center justify-center text-yellow-400/60"
                          style={{ aspectRatio: "1148/1480" }}
                        >
                          <RiRobot2Fill className="w-16 h-16 mb-4" />
                          <span className="text-sm font-w-black-italic">
                            {t("myAgent.incompleteBadge")}
                          </span>
                          <span className="text-xs text-yellow-400/40 mt-2">
                            {t("myAgent.clickToContinue")}
                          </span>
                        </div>
                      ) : (
                        
                        <>
                          <img
                            src={agent.imageUrl || agent.avatarUrl}
                            alt={agent.name}
                            className="w-full h-auto object-cover transition-all group-hover:brightness-75"
                            style={{ aspectRatio: "1148/1480" }}
                          />
                          {}
                          {Boolean(agent.isVerify) && (
                            <div className="absolute top-1.5 right-1.5 bg-black/70 rounded-full p-0.5">
                              <MdVerified className="text-blue-500 text-2xl" />
                            </div>
                          )}

                          {}
                          {!Boolean(agent.isVerify) && agent.verifyState === 1 && (
                            <div className="absolute top-1.5 right-1.5 bg-orange-500/90 text-white text-xs px-2 py-1 rounded-full font-bold">
                              {t("myAgent.verifyPending")}
                            </div>
                          )}

                          {}
                          {!Boolean(agent.isVerify) && agent.verifyState === 2 && (
                            <div className="absolute top-1.5 right-1.5 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full font-bold">
                              {t("myAgent.verifyApproved")}
                            </div>
                          )}

                          {}
                          {!Boolean(agent.isVerify) && agent.verifyState === 3 && (
                            <div className="absolute top-1.5 right-1.5 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-bold">
                              {t("myAgent.verifyRejected")}
                            </div>
                          )}

                          {}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="flex flex-col gap-2">
                              {}
                              <button
                                onClick={(e) => handleTrainClick(e, agent)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                                title={t("myAgent.train")}
                              >
                                <GiArtificialIntelligence className="text-lg" />
                                <span className="text-sm">{t("myAgent.train")}</span>
                              </button>

                              {}
                              <button
                                onClick={(e) => handleEditClick(e, agent)}
                                className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm text-yellow-400 font-bold rounded-lg border border-yellow-400/30 hover:border-yellow-400 hover:shadow-lg hover:scale-105 transition-all"
                                title={t("myAgent.editProfile")}
                              >
                                <MdEdit className="text-lg" />
                                <span className="text-sm">{t("myAgent.editProfile")}</span>
                              </button>

                              {}
                              {!Boolean(agent.isVerify) && (
                                <>
                                  {}
                                  {agent.verifyState === 0 && (
                                    <button
                                      onClick={(e) => handleVerifyClick(e, agent)}
                                      className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm text-blue-400 font-bold rounded-lg border border-blue-400/30 hover:border-blue-400 hover:shadow-lg hover:scale-105 transition-all"
                                      title={t("myAgent.applyVerify")}
                                    >
                                      <IoMdCheckmarkCircle className="text-lg" />
                                      <span className="text-sm">{t("myAgent.applyVerify")}</span>
                                    </button>
                                  )}

                                  {}
                                  {agent.verifyState === 1 && (
                                    <button
                                      disabled
                                      className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm text-orange-400 font-bold rounded-lg border border-orange-400/30 cursor-not-allowed opacity-70"
                                      title={t("myAgent.verifyInReview")}
                                    >
                                      <IoMdCheckmarkCircle className="text-lg" />
                                      <span className="text-sm">{t("myAgent.verifyInReview")}</span>
                                    </button>
                                  )}

                                  {}
                                  {agent.verifyState === 2 && (
                                    <button
                                      onClick={(e) => handleVerifyClick(e, agent)}
                                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                                      title={t("myAgent.payForVerify")}
                                    >
                                      <IoMdCheckmarkCircle className="text-lg" />
                                      <span className="text-sm">{t("myAgent.payForVerify")}</span>
                                    </button>
                                  )}

                                  {}
                                  {agent.verifyState === 3 && (
                                    <button
                                      onClick={(e) => handleVerifyClick(e, agent)}
                                      className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm text-red-400 font-bold rounded-lg border border-red-400/30 hover:border-red-400 hover:shadow-lg hover:scale-105 transition-all"
                                      title={t("myAgent.reapplyVerify")}
                                    >
                                      <IoMdCheckmarkCircle className="text-lg" />
                                      <span className="text-sm">{t("myAgent.reapplyVerify")}</span>
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-2">
                      <h3 className="text-yellow-400 font-bold text-sm truncate font-w-black-italic mb-1.5">
                        {isIncomplete && agent.name === ""
                          ? t("myAgent.incompleteTitle")
                          : agent.name || t("myAgent.incompleteTitle")}
                      </h3>

                      <div className="h-px bg-yellow-400/20 mb-1.5" />

                      {!isIncomplete ? (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">
                            {t("myAgent.level")}
                          </span>
                          <div className="flex items-center gap-1">
                            {agent.level &&
                              agent.level >= 1 &&
                              agent.level <= 6 && (
                                <img
                                  src={`/img/level/lv-${agent.level}.png`}
                                  alt={`Level ${agent.level}`}
                                  className="w-3.5 h-3.5 object-contain"
                                />
                              )}
                            <span className="text-yellow-400 font-semibold font-mono">
                              Lv.{agent.level || 1}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-default-300 truncate">
                          {t("myAgent.incompleteStatus")}
                        </p>
                      )}
                    </div>

                    {!isIncomplete && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
                color="primary"
              />
            </div>
          )}
        </>
      )}

      {}
      <VerifyAgentModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        agent={selectedAgent}
        onSuccess={() => {
          
          fetchAgents();
        }}
      />
    </div>
  );
};

export default MyAgent;
