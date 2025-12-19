import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useTranslation } from "react-i18next";
import { agentApi, type DigitalHuman } from "@/services";
import { addToast } from "@heroui/toast";
import { PATHS } from '@/router/paths'
import { useNavigate } from "react-router-dom";

const RankPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [orderType, setOrderType] = useState<string>("token");
  const [agentList, setAgentList] = useState<DigitalHuman[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  
  const levelOptions = [
    { key: "all", labelKey: "rank.allLevels" },
    { key: "1", labelKey: "rank.level", level: 1 },
    { key: "2", labelKey: "rank.level", level: 2 },
    { key: "3", labelKey: "rank.level", level: 3 },
    { key: "4", labelKey: "rank.level", level: 4 },
    { key: "5", labelKey: "rank.level", level: 5 },
    { key: "6", labelKey: "rank.level", level: 6 },
  ];

  
  const orderOptions = [
    { key: "token", labelKey: "rank.sortByEarnings" },
    { key: "hot", labelKey: "rank.sortByTrainees" },
  ];

  
  const fetchAgentList = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: 1,
        pageSize: 100,
        status: 1, 
        orderType, 
      };

      
      if (levelFilter !== "all") {
        params.level = parseInt(levelFilter);
      }

      
      if (searchQuery.trim()) {
        params.keyword = searchQuery.trim();
      }

      const response = await agentApi.getList(params);
      setAgentList(response.data.list || []);
    } catch (error) {
      addToast({
        title: t("common.getFailed"),
        description: t("rank.fetchFailed"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleSearch = () => {
    fetchAgentList();
  };

  
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || "all";
    setLevelFilter(value);
  };

  
  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || "hot";
    setOrderType(value);
  };

  
  useEffect(() => {
    fetchAgentList();
  }, [levelFilter, orderType]);

  
  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return (
        <img
          className="w-[60%]"
          src={`/img/level/rank-${rank}.png`}
          alt={`Rank ${rank}`}
        />
      );
    }
    return null;
  };

  
  const getRankBackground = (rank: number) => {
    if (rank === 1) {
      return `linear-gradient(180deg, #FDE180 0%, #DD9900 100%)`;
    }
    if (rank === 2) {
      return `linear-gradient(360deg, #555555 0%, #A7A7A7 100%)`;
    }
    if (rank === 3) {
      return `linear-gradient(360deg, #D06240 0%, #E6A082 100%)`;
    }
    return null;
  };

  return (
    <div className="px-4 space-y-6">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b-[1px] border-b-primary/30">
        <h1 className="text-primary text-xl font-bold font-w-mianfeiziti">
          {t("nav.rank")}
        </h1>
        <div className="text-sm text-primary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {}
            <CustomSelect
              labelPlacement="outside-left"
              label={t("rank.filterByLevel")}
              placeholder={t(levelOptions[0].labelKey)}
              selectedKeys={[levelFilter]}
              onChange={handleLevelChange}
            >
              {levelOptions.map((option) => (
                <SelectItem key={option.key}>
                  {option.level
                    ? `${t(option.labelKey)} ${option.level}`
                    : t(option.labelKey)}
                </SelectItem>
              ))}
            </CustomSelect>

            {}
            <CustomSelect
              labelPlacement="outside-left"
              label={t("rank.sortBy")}
              placeholder={t(orderOptions[0].labelKey)}
              selectedKeys={[orderType]}
              onChange={handleOrderChange}
            >
              {orderOptions.map((option) => (
                <SelectItem key={option.key}>{t(option.labelKey)}</SelectItem>
              ))}
            </CustomSelect>

            {}
            <Input
              variant="bordered"
              type="search"
              labelPlacement="outside"
              placeholder={t("rank.searchPlaceholder")}
              value={searchQuery}
              onValueChange={setSearchQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
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
      </div>

      <div className="space-y-6 px-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <>
            {}
            <div className="grid grid-cols-10 gap-4 px-6 py-4 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-xl border border-yellow-400/30 text-yellow-400 font-bold text-sm">
              <div className="col-span-1 text-center">{t("rank.rank")}</div>
              <div className="col-span-4 text-left">{t("rank.agent")}</div>
              <div className="col-span-2 text-left">{t("rank.level")}</div>
              <div className="col-span-2 text-left">
                {t("rank.tokenEarnings")}
              </div>
              <div className="col-span-1 text-right">{t("rank.trainees")}</div>
            </div>

            {}
            {agentList.length > 0 ? (
              <div className="space-y-4">
                {agentList.map((item, index) => {
                  const rank = index + 1;
                  const backgroundImage = getRankBackground(rank);
                  const isTopThree = rank <= 3;

                  return (
                    <div
                      key={item.id}
                      className={`relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] ${isTopThree
                        ? "shadow-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]"
                        : "shadow-lg hover:shadow-xl"
                        }`}
                      style={{
                        background: isTopThree
                          ? "linear-gradient(135deg, #5F4001 0%, #371B00 100%)"
                          : "linear-gradient(135deg, rgba(95,64,1,0.3) 0%, rgba(55,27,0,0.3) 100%)",
                      }}
                      onClick={() => navigate(`${PATHS.AGENT_CHAT}/${item.id}`)}
                    >
                      {}
                      {backgroundImage && (
                        <div
                          className="absolute inset-0 opacity-50 bg-cover bg-center"
                          style={{ background: `${backgroundImage}` }}
                        />
                      )}

                      {}
                      {isTopThree && (
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/30 rounded-full blur-3xl animate-pulse" />
                          <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-400/30 rounded-full blur-3xl animate-pulse" />
                        </div>
                      )}

                      {}
                      <div className="relative grid grid-cols-10 gap-4 items-center px-6 py-3">
                        {}
                        <div className="col-span-1 flex flex-col items-center justify-center">
                          {getRankIcon(rank) || (
                            <span className="text-xl font-bold text-white/80 font-w-black-italic">
                              {rank}
                            </span>
                          )}
                        </div>

                        {}
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/50 to-orange-500/50 rounded-xl blur-md" />
                            <Avatar
                              size="md"
                              radius="lg"
                              src={item.avatarUrl}
                              className="relative border-2 border-yellow-400/30"
                            />
                            {Boolean(item.isVerify) && (
                              <div className="absolute -top-1 -right-1 bg-black/50 rounded-full p-0.5">
                                <MdVerified className="text-blue-500 text-base" />
                              </div>
                            )}
                          </div>
                          <span className="text-white font-bold text-sm font-w-black-italic">
                            {item.name}
                          </span>
                        </div>

                        {}
                        <div className="col-span-2 text-left">
                          <div className="inline-flex items-center justify-center px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full border border-yellow-400/30">
                            <span className="text-yellow-400 font-bold text-sm font-w-black-italic">
                              Lv.{item.level || 1}
                            </span>
                          </div>
                        </div>

                        {}
                        <div className="col-span-2 text-left">
                          <span className="text-base font-bold text-yellow-400 font-w-black-italic">
                            {item.totalTrainingToken
                              ? (
                                parseFloat(item.totalTrainingToken) / 1e18
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                              : "0.00"}{" "}
                            $FLOA
                          </span>
                        </div>

                        {}
                        <div className="col-span-1 text-right">
                          <span className="text-sm font-bold text-white/90 font-w-black-italic">
                            {item.trainingUserCount?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>

                      {}
                      <div
                        className={`absolute inset-0 rounded-2xl pointer-events-none ${isTopThree
                          ? "border-2 border-yellow-400/40"
                          : "border border-yellow-400/20"
                          }`}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/60 text-lg">{t("rank.noData")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RankPage;
