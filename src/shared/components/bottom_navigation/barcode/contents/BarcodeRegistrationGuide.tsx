import { ScanBarcode } from 'lucide-react';

import { PrimaryButton } from '@/shared/components';

interface BarcodeRegistrationGuideProps {
  onRegister: () => void;
}

export const BarcodeRegistrationGuide = ({
  onRegister,
}: BarcodeRegistrationGuideProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-10 gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <ScanBarcode size={32} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-gray-900">
            바코드를 등록해주세요
          </h3>
          <p className="text-gray-500 text-sm">
            멤버십 바코드를 등록하고
            <br />
            간편하게 적립/사용하세요
          </p>
        </div>
      </div>
      <PrimaryButton className="w-full" onClick={onRegister}>
        바코드 등록하기
      </PrimaryButton>
    </div>
  );
};
