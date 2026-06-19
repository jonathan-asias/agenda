import PlatformAdminShell from '@/components/platform-admin/PlatformAdminShell';

export default function GestionPanelLayout({ children }: { children: React.ReactNode }) {
  return <PlatformAdminShell>{children}</PlatformAdminShell>;
}
