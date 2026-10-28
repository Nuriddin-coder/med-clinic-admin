import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "O'chirishni tasdiqlaysizmi?",
  description,
  itemName,
  isLoading = false,
  confirmText = "Ha, o'chirilsin",
  cancelText = "Bekor qilish",
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-slate-100">
        <AlertDialogHeader className="sm:text-left space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <AlertDialogTitle className="text-lg font-bold text-slate-900">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              {description ? (
                description
              ) : itemName ? (
                <>
                  Haqiqatdan ham <strong className="text-slate-800 font-semibold">"{itemName}"</strong> ma'lumotini bazadan o'chirmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.
                </>
              ) : (
                "Ushbu ma'lumotni bazadan butunlay o'chirmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi."
              )}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            isLoading={isLoading}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

