import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useTranslation } from "react-i18next";
import { addToast } from "@heroui/toast";
import { userApi } from "@/services";

interface BindInvitationCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const BindInvitationCodeModal: React.FC<
    BindInvitationCodeModalProps
> = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [inviteCode, setInviteCode] = useState("");
    const [isBinding, setIsBinding] = useState(false);

    
    const handleBindInvitationCode = async () => {
        if (!inviteCode.trim()) {
            addToast({
                title: t("common.warning"),
                description: t("agent.inviteCodeRequired"),
                color: "warning",
                severity: "warning",
            });
            return;
        }

        try {
            setIsBinding(true);

            const response = await userApi.bindInvitationCode({
                invitationCode: inviteCode.trim(),
            });

            if (response.code === 0) {
                addToast({
                    title: t("common.success"),
                    description: t("agent.inviteCodeSuccess"),
                    color: "success",
                    severity: "success",
                });

                
                if (onSuccess) {
                    onSuccess();
                }

                
                handleClose();
            } else {
                throw new Error(response.message || t("agent.inviteCodeFailed"));
            }
        } catch (error: any) {
            addToast({
                title: t("common.error"),
                description: error?.message || t("agent.inviteCodeFailed"),
                color: "danger",
                severity: "danger",
            });
        } finally {
            setIsBinding(false);
        }
    };

    
    const handleClose = () => {
        setInviteCode("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            placement="center"
            isDismissable={!isBinding}
            hideCloseButton={isBinding}
            classNames={{
                base: "bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30",
                closeButton: "text-yellow-400 hover:bg-yellow-400/20",
            }}
        >
            <ModalContent>
                <ModalHeader className="text-yellow-400 font-w-black-italic text-xl">
                    {t("myCenter.bindInvitationCode")}
                </ModalHeader>
                <ModalBody className="py-6">
                    <div className="space-y-4">
                        {}
                        <Input
                            variant="bordered"
                            type="text"
                            labelPlacement="outside"
                            placeholder={t("agent.inviteCodePlaceholder")}
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            autoFocus
                            isDisabled={isBinding}
                            size="md"
                        />
                    </div>
                </ModalBody>
                <ModalFooter className="gap-3">
                    <Button
                        variant="light"
                        onPress={handleClose}
                        isDisabled={isBinding}
                        className="text-white/80 hover:text-white font-w-black-italic"
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button
                        onPress={handleBindInvitationCode}
                        isLoading={isBinding}
                        isDisabled={isBinding || !inviteCode.trim()}
                        className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold font-w-black-italic"
                    >
                        {t("common.confirm")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
