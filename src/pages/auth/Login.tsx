import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';

const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'Foydalanuvchi nomi kiritilishi shart' }),
  password: z.string().min(1, { message: 'Parol kiritilishi shart' }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage('');
      await login(data);
      success('Tizimga muvaffaqiyatli kirildi', `Xush kelibsiz, ${data.username}!`);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kirishda xatolik yuz berdi';
      setErrorMessage(msg);
      error('Xatolik', msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-3">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">MedAdmin Portal</h1>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Tizimga kirish</h2>
            <p className="text-xs text-slate-400 mt-0.5">Admin login va parolini kiriting</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Foydalanuvchi nomi (username)"
              placeholder="Username"
              type="text"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.username?.message}
              {...register('username')}
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-400"
            />

            <Input
              label="Maxfiy Parol"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-400"
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full mt-4"
              size="lg"
            >
              Tizimga kirish
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

