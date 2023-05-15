import DefaultButton from '@/components/buttons/DefaultButton';
import Spinner from '@/components/common/Spinner';
import FileList from '@/components/files/FileList';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/useToast';
import { RawFile } from '@/types/file';
import { useEffect, useState } from 'react';
export default function files() {
  const [files, setFilesInput] = useState<RawFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      await getFiles();
    };
    fetchData();
  }, []);

  const getFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/file', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      setFilesInput([...data]);
    } catch (error) {
      showToast('warn', '데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const mutateFileById = async (type: string, target: string) => {
    if (type == 'delete') {
      console.log('delete');
      const newFiles = files.filter((item: any) => item.id !== target);
      setFilesInput(newFiles);
    } else if (type == 'cancel') {
      const newFiles = files.map(file => {
        if (file.id === target) {
          return { ...file, status: 'cancelled' };
        }
        return file;
      });
      setFilesInput(newFiles);
    }
  };

  return (
    <Layout>
      <div className="content-wrap">
        <div>
          <DefaultButton label="새로고침" isLoading={isLoading} onClick={getFiles} />
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            {files.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-100">
                {files.map((file: RawFile) => (
                  <FileList file={file} key={file.id} onFileAction={mutateFileById}></FileList>
                ))}
              </ul>
            ) : (
              <div className="text-center py-7">등록된 파일이 없습니다.</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
