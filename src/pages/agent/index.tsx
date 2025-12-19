import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdOutlineAddCircle, MdVerified } from "react-icons/md";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { Tabs, Tab } from "@heroui/tabs";
import { agentApi, type DigitalHuman } from "@/services";
import { PATHS } from "@/router/paths";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTranslation } from "react-i18next";
import { CreateAgentPaymentModal } from "@/components/CreateAgentPaymentModal";
import CreateAgentGuidelinesModal from "@/components/CreateAgentGuidelinesModal";

type CategoryType = "all" | "hot" | "token";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userInfo } = useWalletStore();
  const [agents, setAgents] = useState<DigitalHuman[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const pageSize = 24;



  
  useEffect(() => {
    fetchAgents();
  }, [currentPage, activeCategory]);

  
  const getGetOrderType = (category: CategoryType): string | undefined => {
    switch (category) {
      case "hot":
        return "hot"; 
      case "token":
        return "token"; 
      case "all":
      default:
        return undefined; 
    }
  };

  const fetchAgents = async (keyword?: string) => {
    setIsLoading(true);
    try {
      const orderType = getGetOrderType(activeCategory);
      const response = await agentApi.getList({
        page: currentPage,
        pageSize: pageSize,
        orderType: orderType,
        status: 1, 
        keyword: keyword || searchKeyword || undefined,
      });
      setAgents(response.data.list || []);
      setTotalPages(Math.ceil(response.data.total / pageSize));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category);
    setCurrentPage(1); 
  };

  const handleAgentClick = (agent: DigitalHuman) => {
    
    const isMyAgent = userInfo && agent.userId === userInfo.id;
    const chatPath = isMyAgent ? PATHS.AGENT_CHAT : PATHS.AGENT_CHAT;
    navigate(`${chatPath}/${agent.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleBannerClick = () => {
    
    setShowGuidelinesModal(true);
  };

  const handleProceedToPayment = () => {
    
    setShowGuidelinesModal(false);
    setShowPaymentModal(true);
  };

  return (
    <div className="px-4 space-y-6">

      {}
      <CreateAgentGuidelinesModal
        isOpen={showGuidelinesModal}
        onClose={() => setShowGuidelinesModal(false)}
        onProceed={handleProceedToPayment}
      />

      {}
      <CreateAgentPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />

      <div className="w-full mx-auto cursor-pointer bg-linear-to-r from-[#CC9100] to-[#C2590C] rounded-xl bg-[url('/img/agent-bg.png')] bg-cover">
        <div className="flex items-center justify-center py-20">
          <div
            className="w-[300px] h-[50px] text-white flex items-center justify-center gap-2"
            onClick={handleBannerClick}
          >
            <MdOutlineAddCircle className="text-2xl" />
            <span className="font-w-black-italic">{t("agent.create")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between pb-4 border-b-[1px] border-b-primary/30">
        <h1 className="text-primary text-xl font-bold font-w-mianfeiziti">
          {t("home.title")}
        </h1>
        <div className="text-sm text-primary">
          <Input
            variant="bordered"
            type="search"
            labelPlacement="outside"
            placeholder={t("home.searchPlaceholder")}
            value={searchKeyword}
            onValueChange={setSearchKeyword}
            onKeyDown={handleKeyDown}
            startContent={
              <FaSearch className="text-xl text-default-400 pointer-events-none shrink-0" />
            }
            endContent={
              <Button
                size="sm"
                onPress={handleSearch}
                className="font-w-black-italic"
              >
                {t("common.search")}
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
      <Tabs
        size="sm"
        variant="light"
        color="primary"
        className="flex-wrap"
        selectedKey={activeCategory}
        onSelectionChange={(key) => handleCategoryChange(key as CategoryType)}
        classNames={{
          tab: "data-[selected=true]:font-bold",
        }}
      >
        <Tab
          key="all"
          title={t("home.categoryAll")}
          className="w-[80px] h-[30px] text-sm"
        />
        <Tab
          key="hot"
          title={t("home.categoryHot")}
          className="w-[80px] h-[30px] text-sm"
        />
      </Tabs>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : agents.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-default-500">{t("agent.noAgents")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="relative overflow-hidden rounded-lg cursor-pointer transition-all active:scale-[0.98]"
                onClick={() => handleAgentClick(agent)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAgentClick(agent);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${t("home.viewDetails")} ${agent.name}`}
              >
                <div className="flex flex-col border border-yellow-400/20 rounded-lg bg-[#1A1A1A] hover:border-yellow-400/40 transition-colors">
                  <div className="relative w-full bg-black rounded-t-lg overflow-hidden">
                    <img
                      src={agent.imageUrl || agent.avatarUrl}
                      alt={agent.name}
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: "1148/1480" }}
                    />
                    {Boolean(agent.isVerify) && (
                      <div className="absolute top-1.5 right-1.5 bg-black/70 rounded-full p-0.5">
                        <MdVerified className="text-blue-500 text-2xl" />
                      </div>
                    )}
                  </div>

                  <div className="p-2">
                    <h3 className="text-yellow-400 font-bold text-sm truncate font-w-black-italic mb-1.5">
                      {agent.name}
                    </h3>

                    <div className="h-px bg-yellow-400/20 mb-1.5" />

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">{t("myAgent.level")}</span>
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
                  </div>

                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
                </div>
              </div>
            ))}
          </div>

          {}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                showControls
                color="primary"
                size="lg"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
