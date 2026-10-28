import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Sahifa topilmadi</h1>
      <p className="text-sm text-slate-500 max-w-md mt-2">
        Siz qidirayotgan sahifa o'chirilgan, nomi o'zgargan yoki vaqtincha mavjud emas.
      </p>
      <div className="mt-6">
        <Link to="/admin/dashboard">
          <Button leftIcon={<Home className="w-4 h-4" />}>
            Boshqaruv paneliga qaytish
          </Button>
        </Link>
      </div>
    </div>
  );
};

