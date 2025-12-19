import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import { PATHS } from "./paths";
import { ProtectedRoute } from "./ProtectedRoute";

import { Loading } from "@/components/Loading";

import RootNavLayout from "@/layouts/RootNavLayout";
import RootHomeLayout from "@/layouts/RootHomeLayout";
import MyCenterLayout from "@/pages/myCenter";


const HomePage = lazy(() => import("@/pages/home/index"));
const AgentPage = lazy(() => import("@/pages/agent/index"));
const AgentCreatePage = lazy(() => import("@/pages/agent/create/index"));
const AgentChatPage = lazy(() => import("@/pages/agent/agentChat"));
const RankPage = lazy(() => import("@/pages/rank"));
const SubscribePage = lazy(() => import("@/pages/subscribe"));
const ShoppingMallPage = lazy(() => import("@/pages/shoppingMall"));
const ExchangePage = lazy(() => import("@/pages/exchange"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));

const MyAgentPage = lazy(() => import("@/pages/myCenter/myAgent"));
const MyEarningsPage = lazy(() => import("@/pages/myCenter/myEarnings"));
const MyTrainingPage = lazy(() => import("@/pages/myCenter/myTraining"));
const MyPromotionPage = lazy(() => import("@/pages/myCenter/myPromotion"));
const MyCreationsPage = lazy(() => import("@/pages/myCenter/myCreations"));
const TermsOfServicePage = lazy(() => import("@/pages/termsOfService"));

const NotFoundPage = lazy(() => import("@/pages/NotFound"));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

const ROUTES = [
  {
    path: "/",
    element: <RootNavLayout />,
    children: [
      {
        path: PATHS.AGENT,
        element: (
          <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
            {withSuspense(AgentPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.RANK,
        element: (
          <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
            {withSuspense(RankPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.SUBSCRIBE,
        element: (
          <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
            {withSuspense(SubscribePage)}
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.SHOPPING_MALL,
        element: (
          <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
            {withSuspense(ShoppingMallPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.EXCHANGE,
        element: (
          <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
            {withSuspense(ExchangePage)}
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.DASHBOARD,
        element: (
          <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
            {withSuspense(DashboardPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: <MyCenterLayout />,
        children: [
          {
            path: PATHS.MY_AGENT,
            element: (
              <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
                {withSuspense(MyAgentPage)}
              </ProtectedRoute>
            ),
          },
          {
            path: PATHS.X_CALLBACK,
            element: (
              <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
                {withSuspense(MyAgentPage)}
              </ProtectedRoute>
            ),
          },
          {
            path: PATHS.MY_EARNINGS,
            element: (
              <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
                {withSuspense(MyEarningsPage)}
              </ProtectedRoute>
            ),
          },
          {
            path: PATHS.MY_TRAINING,
            element: (
              <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
                {withSuspense(MyTrainingPage)}
              </ProtectedRoute>
            ),
          },
          {
            path: PATHS.MY_INVITATION,
            element: (
              <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
                {withSuspense(MyPromotionPage)}
              </ProtectedRoute>
            ),
          },
          {
            path: PATHS.MY_CREATIONS,
            element: (
              <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
                {withSuspense(MyCreationsPage)}
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <RootHomeLayout />,
    children: [
      {
        path: `${PATHS.AGENT_CREATE}/:id`,
        element: (
          <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
            <div className="mt-[64px]"> {withSuspense(AgentCreatePage)}</div>
          </ProtectedRoute>
        ),
      },
      {
        path: `${PATHS.AGENT_CHAT}/:id`,
        element: (
          <ProtectedRoute requireLogin={true} requireInvitationCode={true}>
            <div className="mt-[64px]">{withSuspense(AgentChatPage)}</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: PATHS.HOME,
    element: <RootHomeLayout />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: PATHS.TERMS_OF_SERVICE,
        element: (
          <div className="mt-[64px]">{withSuspense(TermsOfServicePage)}</div>
        ),
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(NotFoundPage),
  },
];

export const router = createBrowserRouter([...ROUTES]);
