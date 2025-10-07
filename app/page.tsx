"use client"
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/create-quiz');
  };

  return (
    <div>
      <h1>トップページ</h1>
      <button onClick={handleLoginClick} style={{ marginBottom: '16px' }}>
        問題作成へ
      </button>
    </div>
  );
}