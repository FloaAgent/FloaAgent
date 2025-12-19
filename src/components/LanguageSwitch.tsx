import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";

import { useLangStore, LANG_MAP, type Language } from "@/stores/useLangStore";

const LanguageIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z"
      fill="currentColor"
    />
  </svg>
);

export function LanguageSwitch() {
  const { t } = useTranslation();
  const { lang, setLang } = useLangStore();

  const handleLanguageChange = (key: React.Key) => {
    setLang(key as Language);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          size="md"
          startContent={<LanguageIcon size={18} />}
          isIconOnly
        >
          {}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        selectedKeys={new Set([lang])}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];

          if (selectedKey) {
            handleLanguageChange(selectedKey);
          }
        }}
      >
        <DropdownItem key="en" textValue="English">
          {t("language.english")}
        </DropdownItem>
        <DropdownItem key="zh" textValue="简体中文">
          {t("language.chinese")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
