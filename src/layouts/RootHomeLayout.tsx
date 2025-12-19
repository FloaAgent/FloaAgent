import { Outlet } from "react-router-dom";

import { Provider } from "@/provider";
import { HeadNav } from "@/components/HeadNav";
const RootLayout: React.FC = () => {
  return (
    <Provider>
      <div className="fixed top-0 w-full z-20">
        <HeadNav showNavItems={true} />
      </div>
      <Outlet />
    </Provider>
  );
};
export default RootLayout;
