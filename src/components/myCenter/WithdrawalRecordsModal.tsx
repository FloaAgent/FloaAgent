import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { useTranslation } from "react-i18next";
import { userApi } from "@/services";
import type { WithdrawalSignRecord } from "@/services/api/user";
import { addToast } from "@heroui/toast";
import { useWithdrawEarnings } from "@/hooks/useWithdrawEarnings";

interface WithdrawalRecordsModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onWithdrawSuccess?: () => void;
}


export const WithdrawalRecordsModal: React.FC<WithdrawalRecordsModalProps> = ({
  isOpen,
  onOpenChange,
  onWithdrawSuccess,
}) => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<WithdrawalSignRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;
  const { withdrawWithSignature, isWithdrawing } = useWithdrawEarnings();

  
  const totalPages = Math.ceil(totalRecords / pageSize);

  
  const fetchRecords = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await userApi.getWithdrawalSignList({
        page,
        size: pageSize,
      });

      setRecords(response.data.list || []);
      setTotalRecords(response.data.total || 0);
      setCurrentPage(response.data.page || page);
    } catch (error: any) {
      addToast({
        title: t("common.error"),
        description: error?.message || t("common.getFailed"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    if (isOpen) {
      fetchRecords(1);
    }
  }, [isOpen]);

  
  const handlePageChange = (page: number) => {
    fetchRecords(page);
  };

  
  const formatAmount = (amount: string) => {
    try {
      const floaAmount = parseFloat(amount) / 1e18;
      return floaAmount;
    } catch {
      return "0";
    }
  };

  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return t("myEarnings.statusPending");
      case 1:
        return t("myEarnings.statusReceived");
      case 2:
        return t("myEarnings.statusExpired");
      case 3:
        return t("myEarnings.statusReviewing");
      case 4:
        return t("myEarnings.statusRejected");
      default:
        return t("common.unknown");
    }
  };

  
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "text-yellow-400";
      case 1:
        return "text-green-400";
      case 2:
        return "text-red-400";
      case 3:
        return "text-blue-400";
      case 4:
        return "text-red-400";
      default:
        return "text-white/50";
    }
  };

  
  const handleReapply = async (record: WithdrawalSignRecord) => {
    try {
      
      const success = await withdrawWithSignature({
        tokenAddress: record.tokenAddress,
        amount: record.amount,
        nonce: record.nonce,
        deadline: record.deadline,
        signature: record.signature,
      });

      if (success) {
        addToast({
          title: t("common.success"),
          description: t("myEarnings.reapplySuccess"),
          color: "success",
          severity: "success",
        });

        
        setTimeout(() => {
          fetchRecords(currentPage);
          onWithdrawSuccess?.();
        }, 1500);
      }
    } catch (error) {
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30",
        header: "border-b border-yellow-400/30",
        body: "py-6",
        footer: "border-t border-yellow-400/30",
        closeButton:
          "hover:bg-yellow-400/20 text-yellow-400 hover:text-yellow-300",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-yellow-400 font-[W-BlackItalic]">
                {t("myEarnings.withdrawalRecords")}
              </h2>
            </ModalHeader>
            <ModalBody>
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Spinner size="lg" color="warning" />
                </div>
              ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
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
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                  </div>

                  {}
                  <h3 className="text-2xl font-bold text-white/80 mb-3 font-[W-BlackItalic]">
                    {t("myEarnings.noWithdrawalRecords")}
                  </h3>
                  <p className="text-white/50 text-base max-w-md text-center leading-relaxed">
                    {t("myEarnings.noWithdrawalRecordsDesc")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {}
                  <div className="grid grid-cols-12 gap-3 px-4 py-2 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-lg border border-yellow-400/30 text-yellow-400 font-bold text-xs">
                    <div className="col-span-3">
                      {t("myEarnings.withdrawalTime")}
                    </div>
                    <div className="col-span-4">{t("myEarnings.amount")}</div>
                    <div className="col-span-2">{t("myEarnings.status")}</div>
                    <div className="col-span-3 text-right">
                      {t("myEarnings.action")}
                    </div>
                  </div>

                  {}
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.01] shadow-sm hover:shadow-md bg-gradient-to-br from-[#5F4001]/20 to-[#371B00]/20"
                    >
                      {}
                      <div className="relative grid grid-cols-12 gap-3 items-center px-4 py-2">
                        {}
                        <div className="col-span-3">
                          <span className="text-white/90 text-xs">
                            {formatDate(record.createdAt)}
                          </span>
                        </div>

                        {}
                        <div className="col-span-4">
                          <span className="text-yellow-400 font-bold text-sm font-[W-BlackItalic]">
                            {formatAmount(record.amount)} $FLOA
                          </span>
                        </div>

                        {}
                        <div className="col-span-2">
                          <div className="inline-flex items-center justify-center px-2 py-0.5 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full border border-yellow-400/30">
                            <span
                              className={`font-medium text-xs ${getStatusColor(record.status)}`}
                            >
                              {getStatusText(record.status)}
                            </span>
                          </div>
                        </div>

                        {}
                        <div className="col-span-3 flex justify-end">
                          {record.status === 0 ? (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold text-xs h-7 min-w-14"
                              onPress={() => handleReapply(record)}
                              isLoading={isWithdrawing}
                            >
                              {t("myEarnings.reapply")}
                            </Button>
                          ) : (
                            <span className="text-white/40 text-xs">-</span>
                          )}
                        </div>
                      </div>

                      {}
                      <div className="absolute inset-0 rounded-lg border border-yellow-400/10 pointer-events-none" />
                    </div>
                  ))}
                </div>
              )}

              {}
              {!isLoading && totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    showControls
                    color="warning"
                  />
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
