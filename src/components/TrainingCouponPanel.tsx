import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/router/paths";
import { AiFillCaretDown } from "react-icons/ai";
import { agentApi } from "@/services";
import type { UserTrainingTicket } from "@/services";
import { IoReturnDownBackOutline } from "react-icons/io5";

interface CouponData {
  level: number;
  count: number;
  availableTrainings: number;
}

export const TrainingCouponPanel: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [couponData, setCouponData] = useState<CouponData[]>([
    { level: 1, count: 0, availableTrainings: 0 },
    { level: 2, count: 0, availableTrainings: 0 },
    { level: 3, count: 0, availableTrainings: 0 },
    { level: 4, count: 0, availableTrainings: 0 },
    { level: 5, count: 0, availableTrainings: 0 },
    { level: 6, count: 0, availableTrainings: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  
  const fetchTrainingTickets = async () => {
    try {
      setIsLoading(true);
      const response = await agentApi.getAllTrainingTickets();

      if (response.code === 0 && response.data?.tickets) {
        
        const levelStats = new Map<
          number,
          { count: number; totalSuccess: number }
        >();

        response.data.tickets.forEach((ticket) => {
          const level = ticket.ticketLevel;
          const current = levelStats.get(level) || {
            count: 0,
            totalSuccess: 0,
          };

          levelStats.set(level, {
            count: current.count + 1,
            totalSuccess: current.totalSuccess + ticket.remainingSuccess,
          });
        });

        
        const updatedData: CouponData[] = [1, 2, 3, 4, 5, 6].map((level) => {
          const stats = levelStats.get(level);
          return {
            level,
            count: stats?.count || 0,
            availableTrainings: stats?.totalSuccess || 0,
          };
        });

        setCouponData(updatedData);
      }
    } catch (error) {
    } finally{
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    fetchTrainingTickets();
  }, []);

  
  useEffect(() => {
    if (isOpen) {
      fetchTrainingTickets();
    }
  }, [isOpen]);

  const handlePurchase = () => {
    const isMobile = window.innerWidth < 768;
    navigate(isMobile ? PATHS.M_SHOPPING_MALL : PATHS.SHOPPING_MALL);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {}
      <Button
        onPress={() => setIsOpen(!isOpen)}
        className="relative bg-black border-2 text-primary font-w-black-italic font-bold italic h-7 sm:h-10 px-1.5 sm:px-3 min-w-[60px] sm:min-w-[80px]"
      >
        <img
          src="/img/ico-1911.png"
          alt={t("trainingCoupon.icon")}
          className="w-5 h-5 sm:w-8 sm:h-8"
        />
        <AiFillCaretDown className="text-yellow-400 text-xs sm:text-base ml-0.5 sm:ml-1" />
      </Button>

      {}
      {isOpen && (
        <>
          {}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {}
          <div className="fixed sm:absolute left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 top-14 sm:top-full sm:right-0 sm:mt-2 w-[90vw] max-w-[320px] sm:w-[400px] z-50 bg-gradient-to-br from-[#5F4001] to-[#371B00] rounded-xl sm:rounded-2xl shadow-2xl border-2 border-yellow-400/30 p-3 sm:p-4 max-h-[calc(100vh-64px)] sm:max-h-none flex flex-col">
            {}
            <div className="flex items-center justify-between mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-yellow-400/30">
              <h3 className="text-sm sm:text-lg font-bold text-yellow-400 font-w-black-italic">
                {t("trainingCoupon.myTickets")}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-yellow-400/60 hover:text-yellow-400 transition-colors text-base sm:text-xl"
              >
                ✕
              </button>
            </div>

            {}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="col-span-3 flex items-center justify-center py-6 sm:py-10">
                  <div className="text-yellow-400/60 text-xs sm:text-sm">
                    {t("common.loading")}...
                  </div>
                </div>
              ) : (
                couponData.map((tickets) => (
                  <div
                    key={tickets.level}
                    className="relative bg-black/20 rounded-lg p-1.5 sm:p-2 border border-yellow-400/20 hover:border-yellow-400/40 transition-all"
                  >
                    {}
                    <div className="relative flex items-center justify-center mb-1 sm:mb-2">
                      {tickets.count > 0 ? (
                        <Badge
                          content={tickets.count}
                          color="warning"
                          placement="top-right"
                          showOutline={false}
                          classNames={{
                            badge:
                              "bg-[#ff0000] text-white text-[10px] sm:text-xs",
                          }}
                        >
                          <div className="w-12 h-12 sm:w-16 sm:h-16">
                            <div className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={`/img/level/tickets-${tickets.level}.png`}
                                alt={`${t("trainingCoupon.levelSuffix", { level: tickets.level })}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </Badge>
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16">
                          <div className="w-full h-full flex items-center justify-center overflow-hidden">
                            <img
                              src={`/img/level/tickets-${tickets.level}.png`}
                              alt={`${t("trainingCoupon.levelSuffix", { level: tickets.level })}`}
                              className="w-full h-full object-contain grayscale"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {}
                    <div className="text-yellow-400 font-bold text-[10px] sm:text-xs font-w-black-italic text-center mb-0.5 sm:mb-1">
                      {t("trainingCoupon.levelSuffix", {
                        level: tickets.level,
                      })}
                    </div>

                    {}
                    <div className="text-center">
                      <div className="text-white/60 text-[8px] sm:text-[10px]">
                        {t("trainingCoupon.availableTrainings")}
                      </div>
                      <div className="text-green-400 font-semibold text-[10px] sm:text-xs">
                        {tickets.availableTrainings}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {}
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-yellow-400/30">
              <Button
                onPress={handlePurchase}
                size="sm"
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 font-w-black-italic tracking-wider hover:scale-105 text-xs sm:text-sm h-8 sm:h-10"
              >
                {t("trainingCoupon.goPurchase")}
              </Button>
            </div>
          </div>
        </>
      )}

      {}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.5);
        }
      `}</style>
    </div>
  );
};
