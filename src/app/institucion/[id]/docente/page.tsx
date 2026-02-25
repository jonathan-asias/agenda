import DocenteDashboardContent from './DocenteDashboardContent';
import DocenteAuthGuard from '@/components/auth/DocenteAuthGuard';

export default function DocenteDashboardPage() {
  return (
    <DocenteAuthGuard>
      <DocenteDashboardContent />
    </DocenteAuthGuard>
  );
}

