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
  BOOKING_LIST_STACK: 'BookingListScreen',
  QR_STACK: 'QRScreen',
  // TIMER_STACK: 'TimerScreen',
  HISTORY_STACK: 'HistoryScreen',
  PROFILE_STACK: 'ProfileScreen',
  MY_VEHICLE_STACK: 'MY_VEHICLE_STACK',
  MY_ADDRESS_STACK: 'MY_ADDRESS_STACK',
  SUPPORT_STACK: 'SUPPORT_STACK',
  PRIVACY_STACK: 'PRIVACY_STACK',
  FAQ_STACK: 'FAQ_STACK',
} as const;

const STACKS_ADMIN = {
  DASHBOARD: 'DashboardTabScreen',
  HOME_STACK: 'HomeTabScreen',
  PROFILE_STACK: 'HomeTabScreen',
  QR_SCAN: 'QRTabScreen',
};

const TABS_ADMIN = {
  HOME_TAB: 'HomeAdminTabScreen',
  PROFILE_TAB: 'ProfileAdminTabScreen',
};

const MAIN = {
  DASHBOARD: 'DASHBOARD_SCREEN',
};

export {ONBOARDING, STACKS_ADMIN, TABS_ADMIN, AUTH, TABS, MAIN, STACKS};
