import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { useDisclosure } from "@heroui/modal";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaUsers } from "react-icons/fa";
import { addToast } from "@heroui/toast";
import { userApi, type TicketPurchaseRecord } from "@/services";
import { useWalletStore } from "@/stores/useWalletStore";
import { InvitationListModal } from "@/components/myCenter/InvitationListModal";

const MyPromotion: React.FC = () => {
  const { t } = useTranslation();
  const { userInfo } = useWalletStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showAmount, setShowAmount] = useState(true);
  const [records, setRecords] = useState<TicketPurchaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReward, setTotalReward] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  
  const couponImages: { [key: number]: string } = {
    1: "/img/level/tickets-1.png",
    2: "/img/level/tickets-2.png",
    3: "/img/level/tickets-3.png",
    4: "/img/level/tickets-4.png",
    5: "/img/level/tickets-5.png",
    6: "/img/level/tickets-6.png",
  };

  
  const fetchRecords = async (page: number = 1) => {
    if (!userInfo) return;

    setIsLoading(true);
    try {
      const response = await userApi.getTicketPurchaseRecords({
        page,
        pageSize,
      });

      setRecords(response.data.list || []);
      const total = response.data.total || 0;
      const totalReward = response.data.totalReward || 0;
      setTotal(total);
      setTotalReward(totalReward);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (error) {
      addToast({
        title: t("common.error"),
        description: "error",
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRecords(page);
  };

  
  const formatAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  
  useEffect(() => {
    if (userInfo) {
      fetchRecords(currentPage);
    }
  }, [userInfo]);

  return (
    <div className="space-y-4 px-4">
      <div className="flex gap-4">
        {}
        <div className="flex-1/2 rounded-2xl px-9 py-8 flex flex-col justify-center relative overflow-hidden shadow-2xl bg-gradient-to-br from-[#5F4001] to-[#371B00]">
          {}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl" />
          </div>

          {}
          <div className="relative">
            {}
            <div className="flex justify-between items-center mb-4">
              <p className="text-yellow-400/80 text-sm font-medium">
                {t("myPromotion.totalRebate")}
              </p>
              <div className="flex gap-2">
                {}
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setShowAmount(!showAmount)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  {showAmount ? (
                    <FaEye className="text-lg" />
                  ) : (
                    <FaEyeSlash className="text-lg" />
                  )}
                </Button>
                {}
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={onOpen}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <FaUsers className="text-lg" />
                </Button>
              </div>
            </div>

            {}
            <h1 className="text-[40px] font-bold font-w-black-italic text-yellow-400 mb-10 tracking-wider">
              {showAmount ? totalReward / 1e18 : "••••••"}
              {showAmount && (
                <span className="text-2xl ml-2 text-yellow-400/80">$FLOA</span>
              )}
            </h1>

            {}
            <div className="flex justify-start">
              <p className="text-yellow-400/60 text-sm">
                {t("myPromotion.rebateRate")}
              </p>
            </div>
          </div>

          {}
          <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400/20 pointer-events-none" />
        </div>

        {}
        <div className="flex-1/2">
          <img
            src="/img/myPromotion.png"
            alt="ad"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>

      {}
      <div className="space-y-3">
        {}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-xl border border-yellow-400/30 text-yellow-400 font-bold text-sm">
          <div className="col-span-1 text-left">{t("myPromotion.index")}</div>
          <div className="col-span-2 text-left">
            {t("myPromotion.purchaseTime")}
          </div>
          <div className="col-span-3 text-left">
            {t("myPromotion.userAddress")}
          </div>
          <div className="col-span-2 text-center">
            {t("myPromotion.trainingCoupon")}
          </div>
          <div className="col-span-4 text-right">
            {t("myPromotion.rebateAmount")} (5%)
          </div>
        </div>

        {}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" color="primary" />
          </div>
        ) : records.length === 0 ? (
          
          <div className="flex flex-col items-center justify-center py-12 px-6">
            {}
            <div className="relative mb-8">
              {}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl scale-150" />

              {}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border-2 border-yellow-400/30 flex items-center justify-center">
                <FaUsers className="w-16 h-16 text-yellow-400/60" />
              </div>
            </div>

            {}
            <h3 className="text-2xl font-bold text-white/80 mb-3 font-w-black-italic">
              {t("myPromotion.noRecords")}
            </h3>
            <p className="text-white/50 text-base max-w-md text-center leading-relaxed">
              {t("myPromotion.noRecordsDesc")}
            </p>
          </div>
        ) : (
          <>
            {}
            <div className="space-y-2">
              {records.map((item, index) => {
                const rewardAmount = (
                  parseFloat(item.inviterReward || "0") / 1e18
                ).toFixed(2);
                const couponLevel = item.ticketLevel || 1;

                return (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.01] shadow-md hover:shadow-lg bg-gradient-to-br from-[#5F4001]/20 to-[#371B00]/20"
                  >
                    {}
                    <div className="relative grid grid-cols-12 gap-4 items-center px-6 py-3">
                      {}
                      <div className="col-span-1 flex justify-start">
                        <span className="text-xl font-bold font-w-black-italic text-white/80">
                          {(currentPage - 1) * pageSize + index + 1}
                        </span>
                      </div>

                      {}
                      <div className="col-span-2 text-left">
                        <span className="text-white/90 text-sm">
                          {item.createdAt}
                        </span>
                      </div>

                      {}
                      <div className="col-span-3 text-left">
                        <div className="inline-flex items-center justify-center px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full border border-yellow-400/30">
                          <span className="text-yellow-400 font-medium text-sm font-mono">
                            {item.userAccount
                              ? formatAddress(item.userAccount)
                              : "Unknown"}
                          </span>
                        </div>
                      </div>

                      {}
                      <div className="col-span-2 flex justify-center">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400/20 to-orange-500/20 p-1 shadow-lg border border-yellow-400/30">
                          <div className="w-full h-full flex items-center justify-center overflow-hidden">
                            <img
                              src={couponImages[couponLevel]}
                              alt={`${couponLevel}级训练券`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="col-span-4 text-right">
                        <span className="text-green-400 font-bold text-lg font-w-black-italic">
                          +{rewardAmount} $FLOA
                        </span>
                      </div>
                    </div>

                    {}
                    <div className="absolute inset-0 rounded-xl border border-yellow-400/10 pointer-events-none" />
                  </div>
                );
              })}
            </div>

            {}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 pb-2">
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
      <InvitationListModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default MyPromotion;
