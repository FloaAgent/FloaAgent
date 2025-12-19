export const PATHS = {
  HOME: "/",
  AGENT: "/agent",
  AGENT_CREATE: "/agent/create",
  AGENT_CHAT: "/agent/chat",
  RANK: "/rank",
  SUBSCRIBE: "/subscribe",
  SHOPPING_MALL: "/shopping-mall",
  EXCHANGE: "/exchange",
  DASHBOARD: "/dashboard",
  MY_AGENT: "/myAgent",
  MY_INVITATION: "/myPromotion",
  MY_EARNINGS: "/myEarnings",
  MY_TRAINING: "/myTraining",
  MY_CREATIONS: "/myCreations",
  TERMS_OF_SERVICE: "/terms-of-service",
  X_CALLBACK: "/callback",

  // 移动端路由
  M_TRAINING: "/m",
  M_SHOPPING_MALL: "/m/shopping-mall",
  M_AGENT_CHAT: "/m/agent/chat",
  M_MY: "/m/myCenter",
  M_MY_AGENT: "/m/myAgent",
  M_MY_EARNINGS: "/m/myEarnings",
  M_MY_WITHDRAWAL_RECORDS: "/m/my-withdrawal-records",
  M_MY_INVITATION_RECORDS: "/m/my-invitation-records",
  M_MY_TRAINING: "/m/myTraining",
  M_MY_PROMOTION: "/m/myPromotion",

} as const;

export type PathKeys = keyof typeof PATHS;
export type PathValues = (typeof PATHS)[PathKeys];
