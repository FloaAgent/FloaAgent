import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      },
      fontFamily: {
        'w-regular': ['W-Regular', 'system-ui', 'sans-serif'],
        'w-bold': ['W-Bold', 'system-ui', 'sans-serif'],
        'w-bold-italic': ['W-BoldItalic', 'system-ui', 'sans-serif'],
        'w-black-italic': ['W-BlackItalic', 'system-ui', 'sans-serif'],
        'w-mianfeiziti': ['W-mianfeiziti', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px", // h-divider the default height applied to the divider component
        disabledOpacity: 0.5, // this value is applied as opacity-[value] when the component is disabled
        fontSize: {
          tiny: "0.75rem", // text-tiny
          small: "0.875rem", // text-small
          medium: "1rem", // text-medium
          large: "1.125rem", // text-large
        },
        radius: {
          small: "4px", // rounded-small
          medium: "8px", // rounded-medium
          large: "12px", // rounded-large
        },
        borderWidth: {
          small: "1px", // border-small
          medium: "1px", // border-medium (default)
          large: "3px", // border-large
        },
      },

      themes: {
        dark: {
          colors: {
            default: {
              50: "#332502",
              100: "#664a04",
              200: "#986e07",
              300: "#cb9309",
              400: "#feb80b",
              500: "#fec63c",
              600: "#fed46d",
              700: "#ffe39d",
              800: "#fff1ce",
              900: "#ffffff",
              foreground: "#000",
              DEFAULT: "#feb80b",
            },
            primary: {
              50: "#332502",
              100: "#664a04",
              200: "#986e07",
              300: "#cb9309",
              400: "#feb80b",
              500: "#fec63c",
              600: "#fed46d",
              700: "#ffe39d",
              800: "#fff1ce",
              900: "#ffffff",
              foreground: "#000",
              DEFAULT: "#feb80b",
            },

            background: "#000000",
            foreground: "#ffffff",
            content1: {
              DEFAULT: "#18181b",
              foreground: "#fff",
            },
            content2: {
              DEFAULT: "#27272a",
              foreground: "#fff",
            },
            content3: {
              DEFAULT: "#3f3f46",
              foreground: "#fff",
            },
            content4: {
              DEFAULT: "#52525b",
              foreground: "#fff",
            },
            focus: "#feb80b",
            overlay: "#000000",
          },
        },
      },
    }),
  ],
};
