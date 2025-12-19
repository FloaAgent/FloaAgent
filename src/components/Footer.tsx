import { PATHS } from "@/router/paths";
import { FaTelegramPlane, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  const navList = [
    {
      name: "Quick Navigation",
      children: [
        {
          name: "FAQ",
          path: "",
        },
        {
          name: "API Documentation",
          path: "",
        },
        {
          name: "Developer Incentive Program",
          path: "",
        },
      ],
    },
    {
      name: "Community",
      children: [
        {
          name: "Twitter/X",
          path: "https://x.com/Floa_AI",
        },
        {
          name: "Gitbook",
          path: "https://docs.floahive.com/",
        },
        {
          name: "DEX Screener",
          path: "https://dexscreener.com/bsc/0x534a7772740f05dc7055cb371c4d6af5faec3c6e",
        },
        {
          name: "Telegram",
          path: "",
        },
      ],
    },
    {
      name: "Legal Terms",
      children: [
        {
          name: "Terms of Service",
          path: PATHS.TERMS_OF_SERVICE,
        },
        {
          name: "Privacy Policy",
          path: "",
        },
        {
          name: "Cookie Policy",
          path: "",
        },
      ],
    },
  ];

  return (
    <footer className="text-white">
      <div className="w-[90%] md:w-[80%] mx-auto pt-8 md:pt-20 pb-8">
        <div className="flex w-full flex-col gap-4 md:gap-10 md:flex-row md:justify-between">
          <div className="flex gap-10 md:gap-10 lg:gap-20 flex-wrap">
            {navList.map((item) => (
              <div key={item.name}>
                <h3 className="text-lg font-semibold text-[#FEB80B]">
                  {item.name}
                </h3>
                <ul className="my-3 space-y-2">
                  {item.children.map((child) => (
                    <li key={child.name}>
                      <a
                        href={child.path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-200 hover:text-gray-100 text-sm"
                      >
                        {child.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="w-[100%] md:w-[35%] flex flex-col flex-wrap gap-4 items-end">
            <img
              src="/img/logo.png"
              className="h-10 md:h-20 w-auto"
              alt="logo"
            />
            <p className="text-sm text-[#C4C4C4] mb-10">
              On-Chain AI Agent Twin for Everyone: Train & Earn.
            </p>

            <div className="flex gap-4">
              <FaTelegramPlane className="text-3xl" />
              <a href="https://x.com/Floa_AI" target="_blank" rel="noreferrer">
                <FaXTwitter className="text-3xl" />
              </a>
              <a
                href="https://docs.floahive.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub className="text-3xl" />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-6 md:mt-12">
          {}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
