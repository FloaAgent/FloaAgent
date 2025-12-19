import React, { useState, useEffect } from "react";
import { Spinner } from "@heroui/spinner";
import { useTranslation } from "react-i18next";
import { addToast } from "@heroui/toast";
import { configApi, type FloaOverviewResponse } from "@/services";
import { useConfigStore } from "@/stores/useConfigStore";
import {
  FaRobot,
  FaTicketAlt,
  FaCoins,
  FaUsers,
  FaChartLine,
  FaFire,
  FaWallet,
} from "react-icons/fa";


const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { appConfig } = useConfigStore();
  const [overviewData, setOverviewData] = useState<FloaOverviewResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  
  const fetchOverviewData = async () => {
    setIsLoading(true);
    try {
      const response = await configApi.getFloaOverview();
      setOverviewData(response.data);
    } catch (error) {
      addToast({
        title: t("common.error"),
        description: t("dashboard.fetchFailed"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  
  const digitalHumansByLevel = [
    {
      level: 1,
      count: overviewData?.digitalHumanLevelCounts?.["1"] || 0,
      color: "from-gray-500 to-gray-600",
    },
    {
      level: 2,
      count: overviewData?.digitalHumanLevelCounts?.["2"] || 0,
      color: "from-green-500 to-green-600",
    },
    {
      level: 3,
      count: overviewData?.digitalHumanLevelCounts?.["3"] || 0,
      color: "from-blue-500 to-blue-600",
    },
    {
      level: 4,
      count: overviewData?.digitalHumanLevelCounts?.["4"] || 0,
      color: "from-purple-500 to-purple-600",
    },
    {
      level: 5,
      count: overviewData?.digitalHumanLevelCounts?.["5"] || 0,
      color: "from-orange-500 to-orange-600",
    },
    {
      level: 6,
      count: overviewData?.digitalHumanLevelCounts?.["6"] || 0,
      color: "from-red-500 to-red-600",
    },
  ];

  
  const totalDigitalHumans = digitalHumansByLevel.reduce(
    (sum, item) => sum + item.count,
    0
  );

  
  const ticketData = [
    { level: 1, count: overviewData?.ticketSalesByLevel?.["1"] || 0 },
    { level: 2, count: overviewData?.ticketSalesByLevel?.["2"] || 0 },
    { level: 3, count: overviewData?.ticketSalesByLevel?.["3"] || 0 },
    { level: 4, count: overviewData?.ticketSalesByLevel?.["4"] || 0 },
    { level: 5, count: overviewData?.ticketSalesByLevel?.["5"] || 0 },
    { level: 6, count: overviewData?.ticketSalesByLevel?.["6"] || 0 },
  ];
  const totalTickets = overviewData?.totalTicketCirculation || 0; 

  
  const tokenTotalSupply = overviewData?.tokenTotalSupply
    ? parseFloat(overviewData.tokenTotalSupply) / 1e18
    : 100000000; 
  const tokenCirculation = overviewData?.tokenCirculation
    ? parseFloat(overviewData.tokenCirculation) / 1e18
    : 0;
  const tokenBurned = overviewData?.tokenBurned
    ? parseFloat(overviewData.tokenBurned) / 1e18
    : 0;

  
  const chainUsers = overviewData?.onChainUserCount || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-4">
      {}
      <div className="relative overflow-hidden rounded-xl px-6 py-4 bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30">
        {}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-400/30 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <h1 className="text-3xl font-bold text-yellow-400 font-w-black-italic tracking-wider mb-1">
            {t("dashboard.title")}
          </h1>
          <p className="text-yellow-400/70 text-xs">
            {t("dashboard.subtitle")}
          </p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-[#1A1A1A] to-[#262626] border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
          {}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl" />

          <div className="relative">
            {}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center border border-yellow-400/30">
                <FaRobot className="text-yellow-400 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-400 font-w-black-italic">
                  {t("dashboard.digitalHumansByLevel")}
                </h3>
                <p className="text-white/50 text-xs">
                  {t("dashboard.totalDigitalHumans")}: {totalDigitalHumans}
                </p>
              </div>
            </div>

            {}
            <div className="space-y-2">
              {digitalHumansByLevel.map((item) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`/img/level/lv-${item.level}.png`}
                      alt={`Level ${item.level}`}
                      className="w-7 h-7"
                    />
                    <span className="text-white/80 text-sm font-medium">
                      Level {item.level}
                    </span>
                  </div>
                  <span className="text-yellow-400 font-bold font-mono text-sm">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-[#1A1A1A] to-[#262626] border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
          {}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 rounded-full blur-3xl" />

          <div className="relative">
            {}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-500/20 flex items-center justify-center border border-purple-400/30">
                <FaTicketAlt className="text-purple-400 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-400 font-w-black-italic">
                  {t("dashboard.trainingTickets")}
                </h3>
                <p className="text-white/50 text-xs">
                  {t("dashboard.totalCirculation")}:{" "}
                  {totalTickets.toLocaleString()}
                </p>
              </div>
            </div>

            {}
            <div className="space-y-2">
              {}
              <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/30">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <img
                      src="/img/level/founding-ticket.png"
                      alt="Founding Ticket"
                      className="w-6 h-6"
                      onError={(e) => {
                        
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-400 to-orange-500 hidden items-center justify-center">
                      <FaTicketAlt className="text-white text-xs" />
                    </div>
                    <span className="text-yellow-400 font-bold text-sm">
                      {t("dashboard.foundingTicket")}
                    </span>
                  </div>
                  <span className="text-yellow-400 font-bold font-mono text-base">
                    700
                  </span>
                </div>
                <p className="text-white/60 text-xs">
                  {t("dashboard.foundingTicketNote")}
                </p>
              </div>

              {}
              {ticketData.map((item) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`/img/level/tickets-${item.level}.png`}
                      alt={`Level ${item.level} Ticket`}
                      className="w-7 h-7"
                      onError={(e) => {
                        
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                    <div className="w-7 h-7 rounded-lg bg-purple-400/20 hidden items-center justify-center border border-purple-400/30">
                      <span className="text-purple-400 text-xs font-bold">
                        L{item.level}
                      </span>
                    </div>
                    <span className="text-white/80 text-sm">
                      {t("dashboard.levelTicket", { level: item.level })}
                    </span>
                  </div>
                  <span className="text-purple-400 font-bold font-mono text-sm">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-[#1A1A1A] to-[#262626] border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
          {}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 rounded-full blur-3xl" />

          <div className="relative">
            {}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center border border-green-400/30">
                <FaCoins className="text-green-400 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-400 font-w-black-italic">
                  $FLOA {t("dashboard.tokenMetrics")}
                </h3>
                <p className="text-white/50 text-xs">
                  {t("dashboard.totalSupply")}:{" "}
                  {tokenTotalSupply.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>

            {}
            <div className="space-y-3">
              {}
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-400/10 to-emerald-500/10 border border-green-400/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-green-400 font-bold text-sm flex items-center gap-1.5">
                    <FaChartLine className="text-xs" />
                    {t("dashboard.circulation")}
                  </span>
                  <span className="text-green-400 font-bold font-mono text-base">
                    {tokenCirculation.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(tokenCirculation / tokenTotalSupply) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-white/60 text-xs mt-1.5">
                  {((tokenCirculation / tokenTotalSupply) * 100).toFixed(2)}%{" "}
                  {t("dashboard.ofTotalSupply")}
                </p>
              </div>

              {}
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-400/10 to-orange-500/10 border border-red-400/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-red-400 font-bold text-sm flex items-center gap-1.5">
                    <FaFire className="text-xs" />
                    {t("dashboard.burned")}
                  </span>
                  <span className="text-red-400 font-bold font-mono text-base">
                    {tokenBurned.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(tokenBurned / tokenTotalSupply) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-white/60 text-xs mt-1.5">
                  {((tokenBurned / tokenTotalSupply) * 100).toFixed(2)}%{" "}
                  {t("dashboard.ofTotalSupply")}
                </p>
              </div>

              {}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-white/70 text-sm">
                  {t("dashboard.totalSupply")}
                </span>
                <span className="text-yellow-400 font-bold font-mono text-sm">
                  {tokenTotalSupply.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-[#1A1A1A] to-[#262626] border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
          {}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl" />

          <div className="relative">
            {}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400/20 to-cyan-500/20 flex items-center justify-center border border-blue-400/30">
                <FaUsers className="text-blue-400 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-400 font-w-black-italic">
                  {t("dashboard.chainUsers")}
                </h3>
                <p className="text-white/50 text-xs">
                  {t("dashboard.tokenHolders")}
                </p>
              </div>
            </div>

            {}
            <div className="space-y-3">
              {}
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border-4 border-blue-400/30 mb-3">
                  <FaWallet className="text-blue-400 text-4xl" />
                </div>
                <div className="space-y-1">
                  <p className="text-5xl font-bold font-w-black-italic bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {chainUsers.toLocaleString()}
                  </p>
                  <p className="text-white/60 text-xs">
                    {t("dashboard.uniqueAddresses")}
                  </p>
                </div>
              </div>

              {}
              <div className="p-2.5 rounded-lg bg-blue-400/10 border border-blue-400/20">
                <p className="text-white/70 text-xs text-center leading-relaxed">
                  {t("dashboard.chainUsersDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
