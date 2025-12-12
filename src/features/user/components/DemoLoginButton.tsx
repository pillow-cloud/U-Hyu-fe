import { useDemoLogin } from '@user/hooks/useDemoLogin';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/shadcn/ui/button';

interface DemoLoginButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost'; // 필요에 따라 확장
  label?: string;
}

export const DemoLoginButton = ({
  className,
  variant = 'ghost',
  label = '데모 계정으로 체험하기',
}: DemoLoginButtonProps) => {
  const { login, isPending } = useDemoLogin();

  return (
    <Button
      variant={variant}
      onClick={() => login()}
      disabled={isPending}
      className={cn('w-full text-muted-foreground hover:text-primary', className)}
    >
      {isPending ? '로그인 중...' : label}
    </Button>
  );
};
