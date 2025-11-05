import DocenteDashboardContent from './DocenteDashboardContent';
import DocenteAuthGuard from './DocenteAuthGuard';

export default function DocenteDashboardPage() {
  return (
    <DocenteAuthGuard>
      <DocenteDashboardContent />
    </DocenteAuthGuard>
  );
}

