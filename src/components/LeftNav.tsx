import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHouseUser,
  FaGithub,
  FaTelegramPlane,
  FaShoppingCart,
  FaChartBar,
} from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import { ReactNode } from "react";
import { PATHS } from "@/router/paths";
import { useTranslation } from "react-i18next";

interface NavItem {
  id: number;
  titleKey: string;
  icon: ReactNode;
  path: string;
  disabled?: boolean;
}

interface ContactItem {
  id: number;
  title: string;
  icon: ReactNode;
  link: string;
}
export const LeftNav: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  
  const isActive = (item: NavItem) => {
    const currentPath = location.pathname;

    
    if (item.id === 7) {
      return currentPath.includes("my") || currentPath.startsWith("/my");
    }

    
    if (item.path === "/") {
      return currentPath === "/";
    }

    
    return currentPath === item.path || currentPath.startsWith(item.path + "/");
  };

  const nav: NavItem[] = [
    { id: 1, titleKey: "nav.agent", icon: <RiRobot2Fill />, path: PATHS.AGENT },
    {
      id: 5,
      titleKey: "nav.shoppingMall",
      icon: <FaShoppingCart />,
      path: PATHS.SHOPPING_MALL,
    },

    {
      id: 3,
      titleKey: "nav.rank",
      icon: (
        <img
          alt={t("nav.rank")}
          className="w-6 h-6"
          src={import.meta.env.VITE_IMG_URL + "ico-rank.png"}
        />
      ),
      path: PATHS.RANK,
    },
    {
      id: 6,
      titleKey: "nav.dashboard",
      icon: <FaChartBar />,
      path: PATHS.DASHBOARD,
    },
    
    
    
    
    
    

    
    
    
    
    
    

    {
      id: 7,
      titleKey: "nav.myCenter",
      icon: <FaHouseUser />,
      path: PATHS.MY_AGENT,
    },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.disabled) return;
    navigate(item.path);
  };

  const contact: ContactItem[] = [
    {
      id: 1,
      title: "Telegram",
      icon: <FaTelegramPlane />,
      link: "",
    },
    {
      id: 2,
      title: "Twitter",
      icon: <FaXTwitter />,
      link: "https://x.com/Floa_AI",
    },
    {
      id: 3,
      title: "Github",
      icon: <FaGithub />,
      link: "https://docs.floahive.com",
    },
  ];

  return (
    <div className="fixed z-9 left-0 top-0 w-[200px] h-[100vh] bg-[#392900]">
      <div className="flex flex-col justify-between items-start h-full py-[70px]">
        <nav className="w-full h-full text-sm text-primary">
          {nav.map((item, i) => (
            <button
              key={i}
              onClick={() => handleNavClick(item)}
              disabled={item.disabled}
              className={`flex items-center w-full h-[50px] p-4 ${
                item.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:text-black hover:bg-[#FEB80B]"
              } ${isActive(item) && !item.disabled ? "text-black bg-[#FEB80B]" : ""}`}
              type="button"
              tabIndex={item.disabled ? -1 : 0}
            >
              <span className="mr-2 text-[24px]">{item.icon}</span>
              <span className={`font-w-black-italic ${i18n.language === 'zh' ? 'text-[14px] font-bold' : 'text-[12px]'}`}>
                {t(item.titleKey)}
              </span>
            </button>
          ))}
        </nav>
        <footer className="w-full">
          {contact.map((item) => (
            <a
              key={item.title}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center w-full px-4 py-1 text-[#7C7C7C] hover:text-primary transition-colors cursor-pointer`}
            >
              <span className="mr-2 text-[24px] text-primary">{item.icon}</span>

              <span className="text-sm">{item.title}</span>
            </a>
          ))}
        </footer>
      </div>
    </div>
  );
};
