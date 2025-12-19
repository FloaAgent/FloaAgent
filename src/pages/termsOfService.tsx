import React from "react";
import { useTranslation } from "react-i18next";

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-transparent to-gray-900/20" />

      {}
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-yellow-400/3 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="text-sm text-gray-400">
                {t("termsOfService.lastUpdated")}
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {t("termsOfService.title")}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t("termsOfService.subtitle")}
          </p>
        </div>

        {}
        <div className="space-y-6">
          {}
          <div className="relative bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="absolute -left-3 top-6 w-6 h-6 bg-yellow-400 rounded flex items-center justify-center font-bold text-xs text-black">
              01
            </div>
            <h2 className="text-xl font-bold text-white mb-3">
              {t("termsOfService.article1.title")}
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {t("termsOfService.article1.content")}
            </p>
          </div>

          {}
          <div className="relative bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="absolute -left-3 top-6 w-6 h-6 bg-yellow-400 rounded flex items-center justify-center font-bold text-xs text-black">
              02
            </div>
            <h2 className="text-xl font-bold text-white mb-3">
              {t("termsOfService.article2.title")}
            </h2>
            <p className="text-gray-400 mb-5 leading-relaxed">
              {t("termsOfService.article2.intro")}
            </p>

            <div className="space-y-5">
              {}
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  {t("termsOfService.article2.section1.title")}
                </h3>
                <p className="text-gray-400 mb-3 text-sm">
                  {t("termsOfService.article2.section1.intro")}
                </p>
                <div className="space-y-2">
                  {[
                    "adultContent",
                    "violence",
                    "hate",
                    "ipInfringement",
                    "personalRights",
                  ].map((item) => (
                    <div
                      key={item}
                      className="bg-black/30 border border-gray-800 rounded-lg p-3"
                    >
                      <h4 className="font-semibold text-white text-sm mb-1">
                        {t(
                          `termsOfService.article2.section1.items.${item}.title`
                        )}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {t(
                          `termsOfService.article2.section1.items.${item}.desc`
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  {t("termsOfService.article2.section2.title")}
                </h3>
                <p className="text-gray-400 mb-3 text-sm">
                  {t("termsOfService.article2.section2.intro")}
                </p>
                <div className="space-y-2">
                  {["illegalActivities", "falseInfo", "harassment"].map(
                    (item) => (
                      <div
                        key={item}
                        className="bg-black/30 border border-gray-800 rounded-lg p-3"
                      >
                        <h4 className="font-semibold text-white text-sm mb-1">
                          {t(
                            `termsOfService.article2.section2.items.${item}.title`
                          )}
                        </h4>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {t(
                            `termsOfService.article2.section2.items.${item}.desc`
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="relative bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="absolute -left-3 top-6 w-6 h-6 bg-yellow-400 rounded flex items-center justify-center font-bold text-xs text-black">
              03
            </div>
            <h2 className="text-xl font-bold text-white mb-3">
              {t("termsOfService.article3.title")}
            </h2>
            <p className="text-gray-400 mb-5 leading-relaxed">
              {t("termsOfService.article3.intro")}
            </p>

            <div className="space-y-5">
              {}
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  {t("termsOfService.article3.section1.title")}
                </h3>
                <div className="space-y-2">
                  {["warning", "restriction", "termination"].map((item) => (
                    <div
                      key={item}
                      className="bg-black/30 border border-gray-800 rounded-lg p-3"
                    >
                      <h4 className="font-semibold text-white text-sm mb-1">
                        {t(
                          `termsOfService.article3.section1.items.${item}.title`
                        )}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {t(
                          `termsOfService.article3.section1.items.${item}.desc`
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  {t("termsOfService.article3.section2.title")}
                </h3>
                <div className="bg-black/30 border border-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t("termsOfService.article3.section2.content")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
