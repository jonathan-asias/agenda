import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import AdminDashboardContent from './AdminDashboardContent';

export default function AdminDashboardPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboardContent />
    </AdminAuthGuard>
  );
}
