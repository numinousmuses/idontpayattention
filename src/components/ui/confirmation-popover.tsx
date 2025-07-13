"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ConfirmationPopoverProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'destructive' | 'default';
}

export default function ConfirmationPopover({
  children,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default'
}: ConfirmationPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="neutral"
              size="sm"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === 'destructive' ? 'default' : 'default'}
              size="sm"
              onClick={handleConfirm}
              className={variant === 'destructive' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 