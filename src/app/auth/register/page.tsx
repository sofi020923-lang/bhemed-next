'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AuthShell from '@/components/layout/AuthShell';
import Link from 'next/link';

const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingrese un email válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  telefono: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  aceptaTerminos: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono || null,
          fechaNacimiento: data.fechaNacimiento || null,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert('Registro exitoso. Ahora inicia sesión.');
        router.push('/auth/login');
      } else {
        alert(result.error || 'Error al registrar');
      }
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Crear cuenta"
      subtitle="Regístrate para comenzar a usar BHEMED"
      icon={<UserPlus className="h-6 w-6" />}
      footer={(
        <p>
          ¿Ya tienes una cuenta?{' '}
          <Link href="/auth/login" className="font-semibold text-bhemed-ocean-blue hover:text-bhemed-petroleum-blue transition-colors">
            Inicia sesión aquí
          </Link>
        </p>
      )}
    >
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.nombre?.message}
                {...register('nombre')}
              />
              <Input
                label="Apellido"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.apellido?.message}
                {...register('apellido')}
              />
            </div>
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
                autoComplete="new-password"
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
            <Input
              label="Confirmar contraseña"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Input
              label="Teléfono (opcional)"
              type="tel"
              leftIcon={<User className="w-4 h-4" />}
              {...register('telefono')}
            />
            <Input
              label="Fecha de nacimiento (opcional)"
              type="date"
              {...register('fechaNacimiento')}
            />
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acepta-terminos"
                  type="checkbox"
                  className="h-4 w-4 text-bhemed-ocean-blue focus:ring-bhemed-ocean-blue border-gray-300 rounded"
                  {...register('aceptaTerminos')}
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="acepta-terminos" className="text-gray-700 dark:text-gray-300">
                  Acepto los{' '}
                  <a href="#" className="text-bhemed-ocean-blue hover:text-bhemed-petroleum-blue">
                    términos y condiciones
                  </a>
                </label>
                {errors.aceptaTerminos && (
                  <p className="text-error">{errors.aceptaTerminos.message}</p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Crear cuenta
            </Button>
          </form>
        </Card>
    </AuthShell>
  );
}