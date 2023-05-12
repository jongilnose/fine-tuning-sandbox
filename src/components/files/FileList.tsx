import { useToast } from '@/hooks/useToast';
import formatDate from '@/lib/utils';
import { RawFile } from '@/types/file';
import { useState } from 'react';
import DefaultButton from '../buttons/DefaultButton';

interface FileListProps {
  file: RawFile;
  onFileAction: () => void;
}

export default function FileList({ file, onFileAction }: FileListProps) {
  const [deleteFileIsLoading, setDeleteFileIsLoading] = useState(false);
  const [createFinetuneIsLoading, setCreateFinetuneIsLoading] = useState(false);
  const showToast = useToast();
  const HandleDeleteFile = async () => {
    try {
      setDeleteFileIsLoading(true);
      const response = await fetch(`/api/file?id=${file.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      showToast('info', `파일을 삭제했습니다.`);
    } catch (error) {
      showToast('warn', '삭제할 수 없는 파일입니다.');
    } finally {
      onFileAction();
      setDeleteFileIsLoading(false);
    }
  };

  const HandleFineTune = async () => {
    try {
      setCreateFinetuneIsLoading(true);
      const response = await fetch('/api/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: file.id,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      showToast('info', `Fine Tune을 생성했습니다.`);
    } catch (error) {
      console.error('Error fine tuning file:', error);
    } finally {
      onFileAction();
      setCreateFinetuneIsLoading(false);
    }
  };
  return (
    <li className="flex justify-between gap-x-6 py-5 text-sm">
      <div className="flex gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{file.id}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">purpose : {file.purpose}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">filename : {file.filename}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">bytes : {file.bytes}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">created_at : {formatDate(file.created_at)}</p>
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-col sm:items-end">
        <div className="mt-1 flex items-center gap-x-1.5">
          <DefaultButton label="Delete File" className="mr-2" isLoading={deleteFileIsLoading} onClick={HandleDeleteFile} />
          <DefaultButton label="Create Fine Tune" isLoading={createFinetuneIsLoading} onClick={HandleFineTune} />
        </div>
      </div>
    </li>
  );
}
