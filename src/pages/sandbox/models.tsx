import DefaultButton from '@/components/buttons/DefaultButton';
import Spinner from '@/components/common/Spinner';
import Layout from '@/components/layout/Layout';
import ModelList from '@/components/models/ModelList';
import { Model } from '@/types/model';
import { useEffect, useState } from 'react';

export default function models() {
  const [models, setModelsInput] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getModels();
    };
    fetchData();
  }, []);

  const getModels = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/model', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      setModelsInput([...data]);
      console.log(models);
    } catch (error) {
      console.error('Error fine tuning file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mutateModelById = async (type: string, target: string) => {
    if (type == 'delete') {
      const newModels = models.filter((item: any) => item.id !== target);
      setModelsInput(newModels);
    } else if (type == 'cancel') {
      const newModels = models.map(model => {
        if (model.id === target) {
          return { ...model, status: 'cancelled' };
        }
        return model;
      });
      setModelsInput(newModels);
    }
  };

  return (
    <Layout>
      <div className="content-wrap">
        <div>
          <DefaultButton label="새로고침" isLoading={isLoading} onClick={getModels} />
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            {models.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-100">
                {models.map((model: Model) => (
                  <ModelList model={model} key={model.id} onModelAction={mutateModelById}></ModelList>
                ))}
              </ul>
            ) : (
              <div className="text-center py-7">등록된 모델이 없습니다.</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
