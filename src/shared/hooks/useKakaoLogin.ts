export const useKakaoLogin = () => {
  const login = () => {
    const kakaoAuthUrl = import.meta.env.VITE_KAKAO_LOGIN_URL;
    window.location.href = kakaoAuthUrl;
  };

  const adminLogin = () => {
    const kakaoAuthUrl = import.meta.env.VITE_KAKAO_LOGIN_URL;
    // ROLE_USER를 ROLE_ADMIN으로 교체하거나, role 파라미터가 없다면 추가
    const adminUrl = kakaoAuthUrl.includes('ROLE_USER')
      ? kakaoAuthUrl.replace('ROLE_USER', 'ROLE_ADMIN')
      : `${kakaoAuthUrl}&role=ROLE_ADMIN`;
    window.location.href = adminUrl;
  };

  return { login, adminLogin };
};
