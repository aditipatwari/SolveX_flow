import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

export const Modal = ({
  isOpen,
  onClose,
  size = 'md', // sm, md, lg, xl, full
  children,
  className,
  ...props
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key close listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-[95vw] h-[90vh]'
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs"
          />

          {/* Modal content box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
            className={cn(
              'relative z-10 w-full bg-white border border-gray-150 rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden max-h-[85vh]',
              sizes[size],
              className
            )}
            {...props}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const ModalHeader = ({ className, children, onClose, ...props }) => (
  <div
    className={cn(
      'px-6 py-4.5 border-b border-gray-100 flex items-center justify-between gap-4 shrink-0',
      className
    )}
    {...props}
  >
    <div className="flex-1">{children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 rounded-md p-1.5 hover:bg-gray-50 transition-all select-none focus:outline-none focus:ring-1 focus:ring-gray-200"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);
ModalHeader.displayName = 'ModalHeader';

export const ModalTitle = ({ className, children, ...props }) => (
  <h3
    className={cn(
      'text-base font-semibold text-gray-900 leading-none tracking-tight',
      className
    )}
    {...props}
  >
    {children}
  </h3>
);
ModalTitle.displayName = 'ModalTitle';

export const ModalContent = ({ className, children, ...props }) => (
  <div
    className={cn('px-6 py-5 overflow-y-auto max-h-[60vh] text-sm text-gray-600 leading-relaxed font-normal', className)}
    {...props}
  >
    {children}
  </div>
);
ModalContent.displayName = 'ModalContent';

export const ModalFooter = ({ className, children, ...props }) => (
  <div
    className={cn(
      'px-6 py-3.5 border-t border-gray-100 bg-gray-50/40 flex items-center justify-end gap-2 shrink-0',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
ModalFooter.displayName = 'ModalFooter';

export default Modal;
