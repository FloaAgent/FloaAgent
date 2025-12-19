import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";
import { FaHome } from "react-icons/fa";
import { MdError } from "react-icons/md";

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  
  const isMobile = window.innerWidth < 768;

  const handleGoHome = () => {
    navigate(isMobile ? "/m" : "/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 sm:px-6 py-8">
      <div className="max-w-2xl w-full">
        {}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5F4001] to-[#371B00] border-2 border-yellow-400/30 p-6 sm:p-10">
          {}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-yellow-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-orange-500 rounded-full blur-3xl" />
          </div>

          {}
          <div className="relative z-10 text-center">
            {}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                {}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-2xl scale-150" />

                {}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/50 flex items-center justify-center">
                  <MdError className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400" />
                </div>
              </div>
            </div>

            {}
            <h1 className="text-6xl sm:text-8xl font-bold font-w-black-italic text-yellow-400 mb-3 sm:mb-4 tracking-wider">
              404
            </h1>

            {}
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 font-w-black-italic">
              {t("notFound.title")}
            </h2>
            <p className="text-white/70 text-sm sm:text-base mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">
              {t("notFound.description")}
            </p>

            {}
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mb-8 sm:mb-10" />

            {}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                onPress={handleGoHome}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold font-w-black-italic text-sm sm:text-base px-6 sm:px-8 py-6 sm:py-7 shadow-lg hover:shadow-yellow-500/50 transition-all duration-300"
                startContent={<FaHome className="text-lg sm:text-xl" />}
              >
                {t("notFound.goHome")}
              </Button>
            </div>

            {}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-yellow-400/20">
              <p className="text-white/50 text-xs sm:text-sm">
                {t("notFound.hint")}
              </p>
            </div>
          </div>

          {}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-orange-500" />
        </div>

        {}
        <div className="mt-6 sm:mt-8 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400/30"
              style={{
                animation: `pulse 2s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
