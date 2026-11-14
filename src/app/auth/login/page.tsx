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
        router.push('/farmatrack');
      } else {
        alert(result.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bhemed-ice-blue to-bhemed-ocean-blue/20 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto h-16 w-16 bg-bhemed-ocean-blue rounded-full flex items-center justify-center"
          >
            <LogIn className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Bienvenido a BHEMED
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>
        <Card className="mt-8">
          <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link href="/auth/register" className="font-medium text-bhemed-ocean-blue hover:text-bhemed-petroleum-blue">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}