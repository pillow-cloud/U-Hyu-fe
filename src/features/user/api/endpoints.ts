const USER = '/user';

export const USER_ENDPOINTS = {
  USER: {
    ROOT: USER,
    EXTRA_INFO: `${USER}/onboarding`,
    CHECK_EMAIL: `${USER}/check-email`,
  },
  GUEST: {
    DEMO_LOGIN: '/guest/demo-login',
  },
  LOGOUT: '/auth/logout',
};
