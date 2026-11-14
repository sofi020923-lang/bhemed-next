'use client';

import { motion } from 'framer-motion';
import { Heart, Pill, Shield, Bell, User, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface AnimatedIconProps {
  icon: 'heart' | 'pill' | 'shield' | 'bell' | 'user' | 'check' | 'alert' | 'x';
  size?: number;
  color?: string;
  animated?: boolean;
}

export default function AnimatedIcon({ icon, size = 24, color = '#3688B8', animated = true }: AnimatedIconProps) {
  const icons = {
    heart: <Heart size={size} color={color} />,
    pill: <Pill size={size} color={color} />,
    shield: <Shield size={size} color={color} />,
    bell: <Bell size={size} color={color} />,
    user: <User size={size} color={color} />,
    check: <CheckCircle2 size={size} color={color} />,
    alert: <AlertCircle size={size} color={color} />,
    x: <X size={size} color={color} />,
  };

  if (!animated) {
    return <span>{icons[icon]}</span>;
  }

  return (
    <motion.span
      whileHover={{ scale: 1.2, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
    >
      {icons[icon]}
    </motion.span>
  );
}