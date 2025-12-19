import React from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useTranslation } from "react-i18next";

interface WithdrawModalProps {
  
  isOpen: boolean;
  
  onOpenChange: () => void;
  
  withdrawAmount: string;
  
  onWithdrawAmountChange: (value: string) => void;
  
  totalEarningsAmount: number;
  
  isWithdrawing: boolean;
  
  onConfirmWithdraw: () => void;
  
  onMaxWithdraw: () => void;
  
  todayWithdrawalCount?: number;
  
  dailyWithdrawalLimit?: string;
  
  maxWithdrawalAmount?: string;
  
  isMobile?: boolean;
}


export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onOpenChange,
  withdrawAmount,
  onWithdrawAmountChange,
  totalEarningsAmount,
  isWithdrawing,
  onConfirmWithdraw,
  onMaxWithdraw,
  todayWithdrawalCount = 0,
  dailyWithdrawalLimit,
  maxWithdrawalAmount,
  isMobile = false,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      placement={isMobile ? "center" : undefined}
      classNames={{
        base: isMobile
          ? "bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30 mx-3 my-auto"
          : "bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30",
        header: isMobile
          ? "border-b border-yellow-400/30 px-4 py-3"
          : "border-b border-yellow-400/30",
        body: isMobile ? "py-4 px-4" : "py-6",
        footer: isMobile ? "px-4 py-3" : undefined,
        closeButton:
          "hover:bg-yellow-400/20 text-yellow-400 hover:text-yellow-300",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className={`${isMobile ? 'text-base sm:text-lg' : 'text-xl'} font-bold text-yellow-400 font-w-black-italic`}>
                {t("myEarnings.withdrawEarnings")}
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className={isMobile ? "space-y-3" : "space-y-4"}>
                {}
                <div className={`bg-black/30 rounded-lg ${isMobile ? 'p-3' : 'p-4'} border border-yellow-400/20`}>
                  <p className={`text-white/60 ${isMobile ? 'text-xs mb-1.5' : 'text-sm mb-2'}`}>
                    {t("myEarnings.availableBalance")}
                  </p>
                  <p className={`text-yellow-400 ${isMobile ? 'text-xl sm:text-2xl' : 'text-2xl'} font-bold font-w-black-italic`}>
                    {(totalEarningsAmount / 1e18).toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })}{" "}
                    $FLOA
                  </p>
                </div>

                {}
                <div className={isMobile ? "space-y-1.5" : "space-y-2"}>
                  <label className={`text-white/80 ${isMobile ? 'text-xs sm:text-sm' : 'text-sm'} font-medium`}>
                    {t("myEarnings.withdrawAmount")}
                  </label>
                  <div className="relative">
                    <Input
                      value={withdrawAmount}
                      onValueChange={onWithdrawAmountChange}
                      min="0"
                      step="0.0001"
                      placeholder="0.0000"
                      variant="bordered"
                      type="number"
                      size={isMobile ? "sm" : undefined}
                      classNames={{
                        input: isMobile ? "bg-transparent text-sm" : "bg-transparent",
                        inputWrapper:
                          "border-default-200 data-[hover=true]:border-default-400",
                      }}
                      endContent={
                        <div className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                          <span className={`text-white/60 ${isMobile ? 'text-xs' : 'text-sm'}`}>$FLOA</span>
                          <Button
                            size="sm"
                            className={`bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 ${isMobile ? 'min-w-[50px] h-6 text-xs' : 'min-w-[60px]'}`}
                            onPress={onMaxWithdraw}
                          >
                            {t("common.max")}
                          </Button>
                        </div>
                      }
                    />
                  </div>

                  {}
                  {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                    <div className="space-y-1">
                      {}
                      {dailyWithdrawalLimit && (
                        <p className="text-white/60 text-xs">
                          {t("myEarnings.dailyWithdrawalCountTip", {
                            current: todayWithdrawalCount,
                            limit: dailyWithdrawalLimit,
                          })}
                        </p>
                      )}

                      {}
                      {maxWithdrawalAmount &&
                        parseFloat(withdrawAmount) * 1e18 >
                          parseFloat(maxWithdrawalAmount) && (
                          <p className="text-blue-400 text-xs flex items-start gap-1">
                            <span>ℹ️</span>
                            <span>
                              {t("myEarnings.exceedsMaxAmountTip", {
                                max: (
                                  parseFloat(maxWithdrawalAmount) / 1e18
                                ).toFixed(4),
                              })}
                            </span>
                          </p>
                        )}
                    </div>
                  )}
                </div>

                {}
                <div className={`bg-yellow-400/10 rounded-lg ${isMobile ? 'p-2.5' : 'p-3'} border border-yellow-400/20`}>
                  <p className={`text-yellow-400/80 ${isMobile ? 'text-[12px] sm:text-xs' : 'text-xs'} leading-relaxed`}>
                    {t("myEarnings.withdrawTip")}
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                size={isMobile ? "sm" : undefined}
                className={`text-white/60 hover:text-white ${isMobile ? 'text-xs sm:text-sm' : ''}`}
              >
                {t("common.cancel")}
              </Button>
              <Button
                size={isMobile ? "sm" : undefined}
                className={`bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold ${isMobile ? 'text-xs sm:text-sm' : ''}`}
                onPress={onConfirmWithdraw}
                isLoading={isWithdrawing}
                isDisabled={
                  !withdrawAmount ||
                  parseFloat(withdrawAmount) <= 0 ||
                  
                  parseFloat(withdrawAmount) * 1e18 > totalEarningsAmount + 1e14
                }
              >
                {t("myEarnings.confirmWithdraw")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
