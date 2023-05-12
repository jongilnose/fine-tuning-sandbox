import { useToast } from '@/hooks/useToast';
import formatDate from '@/lib/utils';
import { Model } from '@/types/model';
import { useState } from 'react';
import DefaultButton from '../buttons/DefaultButton';
import Badge from '../common/Badge';
interface ModelListProps {
  model: Model;
  onModelAction: () => void;
}
export default function ModelList({ model, onModelAction }: ModelListProps) {
  const [deleteModelIsLoading, setDeleteModelIsLoading] = useState(false);
  const [cancelFinetuneIsLoading, setCancelFinetuneIsLoading] = useState(false);
  const showToast = useToast();

  const HandleDeleteModel = async () => {
    try {
      setDeleteModelIsLoading(true);
      const response = await fetch(`/api/model?id=${model.fine_tuned_model}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      showToast('info', `모델을 삭제했습니다.`);
    } catch (error) {
      showToast('warn', '삭제할 수 없는 모델입니다.');
    } finally {
      onModelAction();
      setDeleteModelIsLoading(false);
    }
  };

  const HandleCancelFinetuneModel = async () => {
    try {
      setCancelFinetuneIsLoading(true);
      const response = await fetch(`/api/model?id=${model.id}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      showToast('info', `Fine tune을 취소했습니다.`);
    } catch (error) {
      console.error('Error deleting file:', error);
      showToast('warn', 'Fine tune을 취소하는 과정에서 오류가 발생했습니다.');
    } finally {
      onModelAction();
      setCancelFinetuneIsLoading(false);
    }
  };

  return (
    <li className="flex justify-between gap-x-6 py-5 text-sm">
      <div className="flex gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{model.id}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            <Badge label={model.status} color={model.status === 'cancelled' ? 'gray' : 'green'} />
            {`- ${model.fine_tuned_model ? model.fine_tuned_model : 'none'}`}
          </p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{model.model}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{formatDate(model.created_at)}</p>
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-col sm:items-end">
        <div className="mt-1 flex items-center gap-x-1.5">
          {model.fine_tuned_model ? <DefaultButton label="Delete Model" className="mr-2" isLoading={deleteModelIsLoading} onClick={HandleDeleteModel} /> : ''}
          {model.status !== 'cancelled' && model.status !== 'succeeded' ? (
            <DefaultButton label="Cancel Fine Tune Model" className="mr-2" isLoading={cancelFinetuneIsLoading} onClick={HandleCancelFinetuneModel} />
          ) : (
            ''
          )}
        </div>
      </div>
    </li>
  );
}
