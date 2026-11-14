'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AuthShell from '@/components/layout/AuthShell';
import Link from 'next/link';

const recoverSchema = z.object({
  email: z.string().email('Ingrese un email válido'),
});

type RecoverFormData = z.infer<typeof recoverSchema>;

export default function RecoverPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverFormData>({
    resolver: zodResolver(recoverSchema),
  });

  const onSubmit = async (data: RecoverFormData) => {
    setIsSubmitting(true);
    try {
      // El flujo de recuperación lo gestiona Neon Auth a través de /api/auth/recover
      const res = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo procesar la solicitud');
      }
      setEmailSent(true);
    } catch (error) {
      console.error('Error en recuperación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"
      icon={<Mail className="h-6 w-6" />}
      footer={(
        <Link href="/auth/login" className="inline-flex items-center font-semibold text-bhemed-ocean-blue hover:text-bhemed-petroleum-blue transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a iniciar sesión
        </Link>
      )}
    >
        <Card>
          {emailSent ? (
            <div className="py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="h-8 w-8 text-green-500" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ¡Email enviado!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Hemos enviado un enlace para restablecer tu contraseña a tu correo electrónico. Por favor, revisa tu bandeja de entrada.
              </p>
              <Button onClick={() => router.push('/auth/login')} fullWidth>
                Volver a iniciar sesión
              </Button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Correo electrónico"
                type="email"
                autoComplete="email"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                leftIcon={<Mail className="w-4 h-4" />}
              >
                Enviar enlace de recuperación
              </Button>
            </form>
          )}
        </Card>
    </AuthShell>
  );
}