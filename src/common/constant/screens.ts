const ONBOARDING = {
  ONBOARDING: 'ONBOARDING',
};

const AUTH = {
  LOGIN: 'LOGIN_SCREEN',
  SIGN_UP: 'SIGN_UP_SCREEN',
};

const TABS = {
  FIND: 'FindTabScreen',
  HISTORY: 'HistoryTabScreen',
  PROFILE: 'ProfileTabScreen',
};

const STACKS = {
  DASHBOARD: 'DashboardTabScreen',
  FIND_STACK: 'FindScreen',
  HISTORY_STACK: 'HistoryScreen',
  PROFILE_STACK: 'ProfileScreen',
  MY_VEHICLE_STACK: 'MY_VEHICLE_STACK',
  MY_ADDRESS_STACK: 'MY_ADDRESS_STACK',
  SUPPORT_STACK: 'SUPPORT_STACK',
  PRIVACY_STACK: 'PRIVACY_STACK',
  FAQ_STACK: 'FAQ_STACK',
} as const;

const MAIN = {
  DASHBOARD: 'DASHBOARD_SCREEN',
};

export {ONBOARDING, AUTH, TABS, MAIN, STACKS};
