import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Avatar } from "@heroui/avatar";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { useTranslation } from "react-i18next";
import { userApi } from "@/services";
import type { InvitationRecord } from "@/services/api/user";
import { addToast } from "@heroui/toast";
import { FaUsers } from "react-icons/fa";

interface InvitationListModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}


export const InvitationListModal: React.FC<InvitationListModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<InvitationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  
  const totalPages = Math.ceil(totalRecords / pageSize);

  
  const fetchRecords = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await userApi.getInvitationList({
        page,
        page_size: pageSize,
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

  
  const formatAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
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
                {t("myPromotion.invitationRecords")}
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
                      <FaUsers className="w-16 h-16 text-yellow-400/60" />
                    </div>
                  </div>

                  {}
                  <h3 className="text-2xl font-bold text-white/80 mb-3 font-[W-BlackItalic]">
                    {t("myPromotion.noInvitations")}
                  </h3>
                  <p className="text-white/50 text-base max-w-md text-center leading-relaxed">
                    {t("myPromotion.noInvitationsDesc")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {}
                  <div className="grid grid-cols-12 gap-3 px-4 py-2 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-lg border border-yellow-400/30 text-yellow-400 font-bold text-xs">
                    <div className="col-span-1 text-center">{t("myPromotion.index")}</div>
                    <div className="col-span-3">{t("myPromotion.userName")}</div>
                    <div className="col-span-4">{t("myPromotion.walletAddress")}</div>
                    <div className="col-span-4">{t("myPromotion.registrationTime")}</div>
                  </div>

                  {}
                  {records.map((record, index) => (
                    <div
                      key={record.id}
                      className="relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.01] shadow-sm hover:shadow-md bg-gradient-to-br from-[#5F4001]/20 to-[#371B00]/20"
                    >
                      {}
                      <div className="relative grid grid-cols-12 gap-3 items-center px-4 py-2">
                        {}
                        <div className="col-span-1 flex justify-center">
                          <span className="text-lg font-bold font-w-black-italic text-white/80">
                            {(currentPage - 1) * pageSize + index + 1}
                          </span>
                        </div>

                        {}
                        <div className="col-span-3 flex items-center gap-2">
                          <Avatar
                            size="sm"
                            src={record.avatar_url}
                            name={record.name || "User"}
                            className="flex-shrink-0"
                          />
                          <span className="text-white/90 text-sm font-medium truncate">
                            {record.name || t("common.unknown")}
                          </span>
                        </div>

                        {}
                        <div className="col-span-4">
                          <div className="inline-flex items-center justify-center px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full border border-yellow-400/30">
                            <span className="text-yellow-400 font-medium text-xs font-mono">
                              {formatAddress(record.account)}
                            </span>
                          </div>
                        </div>

                        {}
                        <div className="col-span-4">
                          <span className="text-white/90 text-xs">
                            {formatDate(record.created_at)}
                          </span>
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
