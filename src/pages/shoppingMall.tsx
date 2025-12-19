import React, { useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { useConfigStore } from "@/stores/useConfigStore";
import { useBuyTrainingTicket } from "@/hooks/useBuyTrainingTicket";

interface TrainingCoupon {
  level: number;
  titleKey: string;
  descKey: string;
  couponImage: string;
  levelIcons: string[];
  price: string; 
  priceFormatted: string; 
  maxSuccessCount: number;
  dailyMaxSuccess: number;
  dailyMaxAttempt: number;
  returnRate: number;
}

const ShoppingMallPage: React.FC = () => {
  const { t } = useTranslation();
  const { fetchAppConfig, appConfig } = useConfigStore();

  
  const { buyTrainingTicket, isProcessing } = useBuyTrainingTicket();

  
  const [processingLevel, setProcessingLevel] = React.useState<number | null>(
    null
  );

  
  const formatPrice = useCallback((weiPrice: string): string => {
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
  }, []);

  
  useEffect(() => {
    fetchAppConfig();
  }, [fetchAppConfig]);

  
  const maxTrainingTicketLevel = useMemo(() => {
    if (!appConfig?.maxTrainingTicketLevel) {
      return 6; 
    }
    return parseInt(appConfig.maxTrainingTicketLevel, 10);
  }, [appConfig]);

  
  const tickets: TrainingCoupon[] = useMemo(() => {
    if (!appConfig?.trainingTicketConfig) {
      return [];
    }

    return appConfig.trainingTicketConfig
      .filter((config) => config.status === 1) 
      .map((config) => {
        
        const levelIcons: string[] = [];
        for (
          let i = config.minDigitalHumanLevel;
          i <= config.maxDigitalHumanLevel;
          i++
        ) {
          levelIcons.push(`/img/level/lv-${i}.png`);
        }

        return {
          level: config.level,
          titleKey: `shoppingMall.level${config.level}Title`,
          descKey: `shoppingMall.level${config.level}Desc`,
          couponImage: `/img/level/tickets-${config.level}.png`,
          levelIcons,
          price: config.price,
          priceFormatted: formatPrice(config.price),
          maxSuccessCount: config.maxSuccessCount,
          dailyMaxSuccess: config.dailyMaxSuccess,
          dailyMaxAttempt: config.dailyMaxAttempt,
          returnRate: config.returnRate,
        };
      });
  }, [appConfig, formatPrice]);

  
  const isTicketAvailable = (level: number): boolean => {
    return level <= maxTrainingTicketLevel;
  };

  
  const handlePurchase = async (level: number) => {
    
    if (!isTicketAvailable(level)) {
      return;
    }

    const ticket = tickets.find((t) => t.level === level);
    if (!ticket) return;

    
    setProcessingLevel(level);

    await buyTrainingTicket({
      amount: ticket.price, 
      level: ticket.level,
      
    });

    
    setProcessingLevel(null);
  };

  return (
    <div className="container mx-auto space-y-4 mt-4 px-4">
      {}
      <div className="space-y-2">
        <div className="text-2xl text-default font-w-mianfeiziti text-center font-bold tracking-wider">
          {t("shoppingMall.title").toUpperCase()}
        </div>
        <div className="text-xs text-white/80 text-center max-w-3xl mx-auto leading-relaxed">
          {t("shoppingMall.notes")}
        </div>
      </div>

      {}
      {tickets.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/60 text-sm">
            {t("shoppingMall.comingSoon")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {tickets.map((ticket) => {
            const isAvailable = isTicketAvailable(ticket.level);

            return (
              <div
                key={ticket.level}
                className={`relative overflow-hidden rounded-xl shadow-2xl transform transition-all duration-300 ${
                  isAvailable
                    ? "hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]"
                    : "opacity-90 grayscale cursor-not-allowed"
                }`}
                style={{
                  background: isAvailable
                    ? "linear-gradient(135deg, #5F4001 0%, #371B00 100%)"
                    : "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
                }}
              >
                {}
                {!isAvailable && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-red-500/90 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    {t("shoppingMall.notAvailable")}
                  </div>
                )}

                {}
                <div className="absolute inset-0 opacity-20">
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 ${
                      isAvailable ? "bg-yellow-400/40" : "bg-gray-400/40"
                    } rounded-full blur-3xl ${isAvailable ? "animate-pulse" : ""}`}
                  />
                  <div
                    className={`absolute bottom-0 left-0 w-32 h-32 ${
                      isAvailable ? "bg-orange-400/40" : "bg-gray-400/40"
                    } rounded-full blur-3xl ${isAvailable ? "animate-pulse" : ""}`}
                    style={{ animationDelay: "1s" }}
                  />
                </div>

                {}
                <div className="relative p-4 flex flex-col items-center space-y-2">
                  {}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {ticket.levelIcons.map((icon, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-[1px] shadow-lg"
                      >
                        <div className="w-full h-full rounded-full bg-[#371B00] flex items-center justify-center overflow-hidden">
                          <img
                            src={icon}
                            alt={`Level ${ticket.level} icon ${index + 1}`}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {}
                  <div className="w-32 h-32 flex items-center justify-center my-2">
                    <div className="relative">
                      {}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/50 to-orange-500/50 rounded-lg blur-xl animate-pulse" />
                      <img
                        src={ticket.couponImage}
                        alt={t(ticket.titleKey)}
                        className="relative w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>

                  {}
                  <h3 className="text-base font-bold text-yellow-400 text-center font-w-black-italic tracking-wide">
                    {t(ticket.titleKey)}
                  </h3>

                  {}
                  <p className="text-xs text-white/70 text-center">
                    {t(ticket.descKey)}
                  </p>

                  {}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent my-1" />

                  {}
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between px-3 py-1 bg-black/30 rounded-lg border border-yellow-400/20">
                      <span className="text-xs text-white/80 font-medium">
                        {t("shoppingMall.trainingSessions")}:
                      </span>
                      <span className="text-sm font-bold text-yellow-400 font-w-black-italic">
                        {ticket.maxSuccessCount}
                      </span>
                    </div>
                  </div>

                  {}
                  <Button
                    size="sm"
                    onPress={() => handlePurchase(ticket.level)}
                    isLoading={processingLevel === ticket.level}
                    isDisabled={!isAvailable || isProcessing}
                    className={`w-full font-bold text-sm rounded-lg shadow-lg transition-all duration-300 font-w-black-italic tracking-wider ${
                      isAvailable
                        ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black hover:shadow-yellow-500/50 hover:scale-105"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {processingLevel === ticket.level
                      ? t("shoppingMall.processing")
                      : `${ticket.priceFormatted} $FLOA`}
                  </Button>
                </div>

                {}
                <div
                  className={`absolute inset-0 rounded-2xl border-2 pointer-events-none ${
                    isAvailable ? "border-yellow-400/20" : "border-gray-600/20"
                  }`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShoppingMallPage;
