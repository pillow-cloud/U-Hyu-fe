import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@user/api/userApi';
import { userKeys } from '@user/hooks/useUserQuery';

import { useModalStore } from '@/shared/store';
import { userStore } from '@user/store/userStore';
import { toast } from '@/shared/components/shadcn/ui/use-toast';

export const useDemoLogin = () => {
  const queryClient = useQueryClient();
  const closeModal = useModalStore(state => state.closeModal);

  const { mutate: login, isPending } = useMutation({
    mutationFn: userApi.demoLogin,
    onSuccess: async () => {
      const { userInfo } = userStore.getState();
      await userInfo(); // Zustand 상태 즉시 업데이트

      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast({
        title: '데모 로그인 성공',
        description: '데모 계정으로 로그인되었습니다.',
      });
      closeModal();
    },
    onError: (error: Error) => {
      toast({
        title: '데모 로그인 실패',
        description: error.message || '로그인 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    },
  });

  return { login, isPending };
};
