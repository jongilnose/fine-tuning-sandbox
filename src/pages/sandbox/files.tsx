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
      setIsLoading(true);
      await getFiles();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getFiles = async () => {
    try {
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
      showToast('warn', '삭제 도중에 오류가 발생했습니다.');
    }
  };

  return (
    <Layout>
      <div className="content-wrap">
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            {files.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-100">
                {files.map((file: RawFile) => (
                  <FileList file={file} key={file.id} onFileAction={getFiles}></FileList>
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
