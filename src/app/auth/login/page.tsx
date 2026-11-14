'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AuthShell from '@/components/layout/AuthShell';
import Modal, { type ModalVariant } from '@/components/ui/Modal';
import { useAuth } from '@/store/AuthContext';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Ingrese un email válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message?: string; variant: ModalVariant } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const result = await res.json();
      if (result.success) {
        login(result.data.user, result.data.token, result.data.refreshToken);
        router.push('/farmatrack/dashboard');
      } else {
        setDialog({
          title: 'No pudimos iniciar sesión',
          message: result.error || 'Verifica tu correo y contraseña e intenta de nuevo.',
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error en login:', error);
      setDialog({
        title: 'Error de conexión',
        message: 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Bienvenido a BHEMED"
      subtitle="Inicia sesión para acceder a tu cuenta"
      icon={<LogIn className="h-6 w-6" />}
      footer={(
        <p>
          ¿No tienes una cuenta?{' '}
          <Link href="/auth/register" className="font-semibold text-bhemed-ocean-blue hover:text-bhemed-petroleum-blue transition-colors">
            Regístrate aquí
          </Link>
        </p>
      )}
    >
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-bhemed-ocean-blue focus:ring-bhemed-ocean-blue border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Recordarme
                </label>
              </div>
              <Link href="/auth/recover" className="text-sm text-bhemed-ocean-blue hover:text-bhemed-petroleum-blue">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Iniciar sesión
            </Button>
          </form>
        </Card>
        <Modal
          open={dialog !== null}
          onClose={() => setDialog(null)}
          title={dialog?.title ?? ''}
          message={dialog?.message}
          variant={dialog?.variant ?? 'info'}
        />
    </AuthShell>
  );
}