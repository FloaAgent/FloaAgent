import { Link, useLocation } from "react-router-dom";
import { PATHS } from "@/router/paths";
import { useTranslation } from "react-i18next";

export interface NavItem {
  titleKey: string;
  path: string;
}

export const headNavItems: NavItem[] = [
  {
    titleKey: "nav.agent",
    path: PATHS.AGENT,
  },
  {
    titleKey: "nav.shoppingMall",
    path: PATHS.SHOPPING_MALL,
  },
  {
    titleKey: "nav.rank",
    path: PATHS.RANK,
  },
  {
    titleKey: "nav.myCenter",
    path: PATHS.MY_AGENT,
  },
];

interface HeadNavItemProps {
  items?: NavItem[];
}

export const HeadNavItem: React.FC<HeadNavItemProps> = ({
  items = headNavItems,
}) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      {items.map((item, i) => (
        <Link
          key={i}
          to={item.path}
          className={`px-4 py-1 font-w-mianfeiziti font-bold text-black italic text-sm transition-colors rounded-md ${
            location.pathname === item.path
              ? "text-default bg-black"
              : "hover:bg-black hover:text-default"
          }`}
        >
          {t(item.titleKey)}
        </Link>
      ))}
    </>
  );
};
