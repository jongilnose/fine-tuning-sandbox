import DefaultButton from '@/components/buttons/DefaultButton';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/useToast';
import { useRef, useState } from 'react';

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      showToast('warn', '업로드할 파일을 선택해주세요');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const response = await fetch('/api/file', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      showToast('info', `파일을 업로드 했습니다.`);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setIsLoading(false);
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };
  return (
    <Layout>
      <div className="content-wrap">
        <div className="shadow-md rounded-md p-5">
          <h2 className="border-b-2 border-gray-500 p-2">Fine Tuning Guide</h2>
          <ul className="list-disc p-5 text-sm">
            <li className="p-2">
              데이터 품질: 고품질의 데이터를 사용하여 모델을 훈련시키는 것이 중요합니다. 잘못된 정보, 불완전한 문장, 오탈자 등으로 인해 모델의 성능이 저하될 수
              있습니다. 데이터 다양성: 다양한 주제, 스타일, 출처 등의 데이터를 포함시켜 모델이 다양한 상황에 적응할 수 있도록 합니다.
            </li>
            <li className="p-2">데이터 다양성: 다양한 주제, 스타일, 출처 등의 데이터를 포함시켜 모델이 다양한 상황에 적응할 수 있도록 합니다.</li>
            <li className="p-2">
              편향성: 훈련 데이터에 편향이 존재하면, 모델 또한 편향된 결과를 생성할 수 있습니다. 편향을 최소화하려면 다양한 관점과 배경을 가진 데이터를
              사용하고, 민감한 주제에 대해서는 중립적인 관점을 유지하는 것이 좋습니다.
            </li>
            <li className="p-2">
              데이터 균형: 특정 주제나 범주에 대한 데이터가 지나치게 많으면, 모델이 해당 주제에 과도하게 치우칠 수 있습니다. 균형잡힌 데이터를 사용하여 모델의
              일반화 능력을 향상시키세요.
            </li>
            <li className="p-2">
              데이터 보안 및 개인정보: 훈련 데이터에 민감한 정보(개인정보, 기밀 정보 등)가 포함되지 않도록 주의해야 합니다. 이를 위해 개인정보를 제거하거나
              익명화하여 데이터를 처리하세요.
            </li>
            <li className="p-2">
              저작권: 훈련 데이터에 포함된 정보가 저작권 침해를 일으키지 않도록 주의해야 합니다. 합법적인 출처의 데이터를 사용하고, 필요한 경우 사용 허가를
              받아야 합니다.
            </li>
            <li className="p-2">
              데이터 크기: 훈련 데이터의 크기는 모델의 성능에 큰 영향을 미칩니다. 충분한 양의 데이터를 사용하여 모델이 효과적으로 학습할 수 있도록 하세요.
              그러나, 과도한 양의 데이터는 훈련 시간과 비용이 증가할 수 있으니 적절한 균형을 찾아야 합니다.
            </li>
          </ul>
        </div>
        <div className="mt-5">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="file"
                onChange={handleFileChange}
                ref={inputRef}
                className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
            <div className="text-right mt-2">
              <DefaultButton label="업로드" isLoading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
