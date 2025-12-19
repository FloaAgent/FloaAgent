import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { useTranslation } from "react-i18next";
import { PATHS } from "@/router/paths";

interface CreateAgentGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const CreateAgentGuidelinesModal: React.FC<CreateAgentGuidelinesModalProps> = ({
  isOpen,
  onClose,
  onProceed,
}) => {
  const { t } = useTranslation();
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const handleProceed = () => {
    if (agreedToTerms) {
      onProceed();
    }
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    window.open(PATHS.TERMS_OF_SERVICE, "_blank");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="2xl"
      classNames={{
        base: "bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30",
        closeButton: "text-yellow-400 hover:bg-yellow-400/20",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-yellow-400 font-w-black-italic text-xl">
          {t("createAgent.guidelinesTitle")}
        </ModalHeader>

        <ModalBody className="py-4">
          <div className="space-y-4">
            {}
            <p className="text-white/90 text-sm">
              {t("createAgent.guidelinesIntro")}
            </p>

            {}
            <div className="space-y-2.5 pl-1">
              <div className="flex items-start gap-2.5">
                <span className="text-yellow-400 font-bold text-sm">1.</span>
                <p className="text-white/80 leading-relaxed flex-1 text-sm">
                  {t("createAgent.guidelinesRule1")}
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-yellow-400 font-bold text-sm">2.</span>
                <p className="text-white/80 leading-relaxed flex-1 text-sm">
                  {t("createAgent.guidelinesRule2")}
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-yellow-400 font-bold text-sm">3.</span>
                <p className="text-white/80 leading-relaxed flex-1 text-sm">
                  {t("createAgent.guidelinesRule3")}
                </p>
              </div>
            </div>

            {}
            <div className="p-3 bg-orange-400/10 rounded-lg">
              <p className="text-orange-300 leading-relaxed text-sm">
                {t("createAgent.guidelinesWarning")}
              </p>
            </div>

            {}
            <p className="text-white/70 leading-relaxed text-sm">
              {t("createAgent.guidelinesThanks")}
            </p>
            <div className="text-white/80 mb-2.5 text-sm">
              <span>{t("createAgent.agreeTermsPrefix")}</span>
              <a
                href={PATHS.TERMS_OF_SERVICE}
                onClick={handleTermsClick}
                className="text-yellow-400 hover:text-yellow-300 underline cursor-pointer mx-1"
              >
                {t("createAgent.termsLink")}
              </a>
              <span>{t("createAgent.agreeTermsSuffix")}</span>
            </div>

            {}
            <div className="pt-2 border-t border-white/10">
              <Checkbox
                isSelected={agreedToTerms}
                onValueChange={setAgreedToTerms}
                classNames={{
                  base: "max-w-full",
                  label: "text-white/80 text-sm",
                }}
              >
                {t("createAgent.agreeCheckbox")}
              </Checkbox>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="gap-3">
          <Button
            variant="light"
            onPress={onClose}
            className="text-white/80 hover:text-white font-w-black-italic"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onPress={handleProceed}
            isDisabled={!agreedToTerms}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold font-w-black-italic"
          >
            {t("createAgent.proceedToPayment")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAgentGuidelinesModal;
