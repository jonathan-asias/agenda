import UnifiedAuthGuard from '../../../UnifiedAuthGuard';
import AdminDashboardContent from './AdminDashboardContent';

export default function AdminDashboardPage() {
  return (
    <UnifiedAuthGuard allowedUserTypes={['administrador']}>
      <AdminDashboardContent />
    </UnifiedAuthGuard>
  );
}