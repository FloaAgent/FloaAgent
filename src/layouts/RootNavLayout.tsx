import { Outlet } from "react-router-dom";

import { Provider } from "@/provider";
import { HeadNav } from "@/components/HeadNav";
import { LeftNav } from "@/components/LeftNav";
const RootLayout: React.FC = () => {
  return (
    <Provider>
      <HeadNav />
      <div className="flex">
        <div className="w-[200px]">
          <LeftNav />
        </div>
        <div className="fixed left-[200px] top-0 w-[calc(100%-200px)] h-[100vh] overflow-auto">
          <div className="py-[80px]">
            <Outlet />
          </div>
        </div>
      </div>
    </Provider>
  );
};
export default RootLayout;
