import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaHistory } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import { addToast } from "@heroui/toast";
import { userApi, type UserTrainingRecord } from "@/services";
import { useWalletStore } from "@/stores/useWalletStore";
import { useWithdrawEarnings } from "@/hooks/useWithdrawEarnings";
import { WithdrawalRecordsModal } from "@/components/myCenter/WithdrawalRecordsModal";
import { WithdrawModal } from "@/components/myCenter/WithdrawModal";
import { PATHS } from "@/router/paths";
import { Link } from "react-router-dom";
import { useConfigStore } from "@/stores/useConfigStore";

const MyEarnings: React.FC = () => {
  const { t } = useTranslation();
  const { userInfo, refreshUserInfo } = useWalletStore();
  const { appConfig } = useConfigStore();
  const [showAmount, setShowAmount] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isWithdrawModalOpen,
    onOpen: onWithdrawModalOpen,
    onOpenChange: onWithdrawModalOpenChange,
  } = useDisclosure();
  const [records, setRecords] = useState<UserTrainingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [totalEarningsAmount, setTotalEarningsAmount] = useState(0);
  const [todayWithdrawalCount, setTodayWithdrawalCount] = useState(0);
  const pageSize = 10;

  
  const { withdraw, isWithdrawing } = useWithdrawEarnings();

  
  const fetchUserEarnings = async () => {
    try {
      const response = await userApi.getCurrentUser();

      if (response.data?.wallet1) {
        
        const earnings = parseFloat(response.data.wallet1);
        setTotalEarningsAmount(earnings);
      }

      
      await fetchTodayWithdrawalCount();
    } catch (error) {
    }
  };

  
  const fetchTodayWithdrawalCount = async () => {
    try {
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();

      const response = await userApi.getWithdrawalSignList({
        page: 1,
        size: 100, 
      });

      
      const todayCount = (response.data.list || []).filter((record) => {
        const recordDate = new Date(record.createdAt);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === todayTimestamp && record.status !== 4;
      }).length;

      setTodayWithdrawalCount(todayCount);
    } catch (error) {
    }
  };

  
  const fetchRecords = async (page: number = 1) => {
    if (!userInfo) return;

    setIsLoading(true);
    try {
      const response = await userApi.getUserTrainingRecords({
        page,
        pageSize,
      });

      setRecords(response.data.list || []);
      const total = response.data.total || 0;
      setTotalCount(total);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (error) {
      addToast({
        title: t("common.getFailed"),
        description: t("myEarnings.fetchFailed"),
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRecords(page);
  };

  
  const getUserRolesAndRewards = (record: UserTrainingRecord) => {
    const currentAccount = userInfo?.account?.toLowerCase();
    const roles: Array<{ role: string; reward: string; roleText: string }> = [];

    
    if (record.userAccount?.toLowerCase() === currentAccount) {
      roles.push({
        role: "trainer",
        reward: record.trainerReward,
        roleText: t("myEarnings.trainerRole"),
      });
    }

    
    if (record.parentAccount?.toLowerCase() === currentAccount) {
      roles.push({
        role: "parent",
        reward: record.parentReward,
        roleText: t("myEarnings.parentRole"),
      });
    }

    
    if (record.creatorAccount?.toLowerCase() === currentAccount) {
      roles.push({
        role: "creator",
        reward: record.creatorReward,
        roleText: t("myEarnings.creatorRole"),
      });
    }

    if (roles.length === 0) {
      roles.push({
        role: "unknown",
        reward: "0",
        roleText: t("common.unknown"),
      });
    }

    return roles;
  };

  
  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      addToast({
        title: t("common.error"),
        description: t("myEarnings.pleaseEnterAmount"),
        color: "warning",
      });
      return;
    }

    const amountInWei = (parseFloat(withdrawAmount) * 1e18).toString();

    
    if (parseFloat(amountInWei) > totalEarningsAmount) {
      addToast({
        title: t("common.error"),
        description: t("myEarnings.insufficientBalance"),
        color: "warning",
      });
      return;
    }

    
    if (appConfig?.dailyWithdrawalLimit) {
      const dailyLimit = parseInt(appConfig.dailyWithdrawalLimit);
      if (todayWithdrawalCount >= dailyLimit) {
        addToast({
          title: t("common.error"),
          description: t("myEarnings.dailyLimitExceeded", {
            limit: dailyLimit,
          }),
          color: "warning",
        });
        return;
      }
    }

    
    if (appConfig?.maxWithdrawalAmount) {
      const maxAmount = parseFloat(appConfig.maxWithdrawalAmount);
      if (parseFloat(amountInWei) > maxAmount) {
        addToast({
          title: t("common.info"),
          description: t("myEarnings.manualReviewRequired"),
          color: "primary",
        });
      }
    }

    const success = await withdraw(amountInWei);
    if (success) {
      
      setWithdrawAmount("");
      onWithdrawModalOpenChange();
      handleWithdrawSuccess();
    }
  };

  
  const handleMaxWithdraw = () => {
    
    const maxInEther = totalEarningsAmount / 1e18;
    
    const maxAmount = Math.floor(maxInEther * 10000) / 10000;
    setWithdrawAmount(maxAmount.toString());
  };

  
  const refreshAllData = () => {
    fetchUserEarnings();
    fetchRecords(currentPage);
  };

  
  const handleWithdrawSuccess = () => {
    
    refreshAllData();
    
    refreshUserInfo?.();
  };

  
  useEffect(() => {
    if (userInfo) {
      fetchUserEarnings();
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
                {t("myEarnings.myEarnings")}
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
                  <FaHistory className="text-lg" />
                </Button>
              </div>
            </div>

            {}
            <h1 className="text-[40px] font-bold font-w-black-italic text-yellow-400 mb-10 tracking-wider">
              {showAmount
                ? (totalEarningsAmount / 1e18).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "••••••"}
              {showAmount && (
                <span className="text-2xl ml-2 text-yellow-400/80">$FLOA</span>
              )}
            </h1>

            {}
            <div className="flex justify-end">
              <Button
                onPress={onWithdrawModalOpen}
                isDisabled={totalEarningsAmount === 0}
                className="w-[180px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 font-w-black-italic tracking-wider hover:scale-105"
              >
                {t("myEarnings.withdraw").toUpperCase()}
              </Button>
            </div>
          </div>

          {}
          <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400/20 pointer-events-none" />
        </div>

        {}
        <Link to={PATHS.AGENT} className="flex-1/2">
          <img
            className="w-full h-full object-cover rounded-2xl"
            src="/img/myEarnings.png"
            alt="ad"
          />
        </Link>
      </div>

      {}
      <div className="space-y-3">
        {}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-xl border border-yellow-400/30 text-yellow-400 font-bold text-sm">
          <div className="col-span-1 text-left">{t("myEarnings.index")}</div>
          <div className="col-span-2 text-left">{t("myEarnings.time")}</div>
          <div className="col-span-3 text-left">{t("myEarnings.source")}</div>
          <div className="col-span-3 text-left">
            {t("myEarnings.digitalHumanInfo")}
          </div>
          <div className="col-span-3 text-right">
            {t("myEarnings.quantity")}
          </div>
        </div>

        {}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {records.map((item, index) => {
                const roles = getUserRolesAndRewards(item);
                const totalReward = roles.reduce(
                  (sum, role) => sum + parseFloat(role.reward || "0"),
                  0
                );
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
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {}
                      <div className="col-span-3 text-left">
                        {roles.length > 1 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {roles.map((roleInfo, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center justify-center px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full border border-yellow-400/30"
                              >
                                <span className="text-yellow-400 font-medium text-xs">
                                  {roleInfo.roleText}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full border border-yellow-400/30">
                            <span className="text-yellow-400 font-medium text-sm">
                              {roles[0].roleText}
                            </span>
                          </div>
                        )}
                      </div>

                      {}
                      <div className="col-span-3 flex items-center justify-start gap-2">
                        {item.digitalHumanAvatarUrl ? (
                          <Avatar size="sm" src={item.digitalHumanAvatarUrl} />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <RiRobot2Fill className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <span className="text-white/90 text-sm font-medium">
                          {item.digitalHumanName || t("common.unknown")}
                        </span>
                      </div>

                      {}
                      <div className="col-span-3 text-right">
                        {roles.length === 1 ? (
                          
                          <span className="text-green-400 font-bold text-base font-w-black-italic">
                            +{(totalReward / 1e18).toFixed(4)} $FLOA
                          </span>
                        ) : (
                          
                          <div className="flex flex-col items-end gap-1">
                            {roles.map((roleInfo, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <span className="text-white/60 text-xs">
                                  {roleInfo.roleText}:
                                </span>
                                <span className="text-green-400 font-medium text-sm">
                                  +
                                  {(
                                    parseFloat(roleInfo.reward || "0") / 1e18
                                  ).toFixed(4)}
                                </span>
                              </div>
                            ))}
                            <div className="flex items-center gap-2 pt-1 border-t border-yellow-400/20 mt-1">
                              <span className="text-yellow-400/80 text-xs font-bold">
                                总计:
                              </span>
                              <span className="text-green-400 font-bold text-base font-w-black-italic">
                                +{(totalReward / 1e18).toFixed(4)} $FLOA
                              </span>
                            </div>
                          </div>
                        )}
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

            {}
            {records.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                {}
                <div className="relative mb-8">
                  {}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl scale-150" />

                  {}
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border-2 border-yellow-400/30 flex items-center justify-center">
                    {}
                    <svg
                      className="w-16 h-16 text-yellow-400/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>

                {}
                <h3 className="text-2xl font-bold text-white/80 mb-3 font-w-black-italic">
                  {t("myEarnings.noRecords")}
                </h3>
                <p className="text-white/50 text-base max-w-md text-center leading-relaxed">
                  {t("myEarnings.noRecordsDesc")}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {}
      <WithdrawalRecordsModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      {}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onOpenChange={onWithdrawModalOpenChange}
        withdrawAmount={withdrawAmount}
        onWithdrawAmountChange={setWithdrawAmount}
        totalEarningsAmount={totalEarningsAmount}
        isWithdrawing={isWithdrawing}
        onConfirmWithdraw={handleWithdraw}
        onMaxWithdraw={handleMaxWithdraw}
        todayWithdrawalCount={todayWithdrawalCount}
        dailyWithdrawalLimit={appConfig?.dailyWithdrawalLimit}
        maxWithdrawalAmount={appConfig?.maxWithdrawalAmount}
      />
    </div>
  );
};

export default MyEarnings;
