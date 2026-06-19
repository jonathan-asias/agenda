'use client';

import { type ReactNode } from 'react';
import { ConfirmHost } from './ConfirmDialog';
import { LoadingHost } from './LoadingOverlay';
import { ToastHost } from './Toast';

export default function UIProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastHost />
      <ConfirmHost />
      <LoadingHost />
    </>
  );
}
