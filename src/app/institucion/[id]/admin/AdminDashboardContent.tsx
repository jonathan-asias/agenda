'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import SetupWizard from './SetupWizard';
import DashboardStats from './DashboardStats';
import DashboardSections from './DashboardSections';
import AddItemModal from './AddItemModal';

interface Administrador {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  institucion: {
    id: number;
    nombre: string;
  };
  sede?: {
    id: number;
    nombre: string;
  };
}

interface DashboardData {
  estadisticas: {
    areas: number;
    materias: number;
    grados: number;
    cursos: number;
    docentes: number;
    estudiantes: number;
  };
  datos: {
    areas: any[];
    materias: any[];
    grados: any[];
    cursos: any[];
    docentes: any[];
    estudiantes: any[];
  };
  resumen: {
    estudiantesPorGrado: any[];
    materiasPorArea: any[];
  };
}

export default function AdminDashboardContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [administrador, setAdministrador] = useState<Administrador | null>(null);
  const [institucionId, setInstitucionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch(`/api/administradores/by-email/${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          setAdministrador(data.administrador);
          setInstitucionId(data.administrador?.institucion?.id || null);
          // Cargar datos del dashboard automáticamente solo si no se han cargado
          if (data.administrador?.institucion?.id && !dashboardLoaded) {
            fetchDashboardData(data.administrador.institucion.id);
          }
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, dashboardLoaded]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const fetchDashboardData = async (institucionId?: number) => {
    const id = institucionId || administrador?.institucion?.id;
    if (!id || dashboardLoaded) return;
    
    setDashboardLoading(true);
    try {
      const response = await fetch(`/api/instituciones/${id}/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setDashboardLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleAddSuccess = () => {
    // Recargar datos del dashboard después de agregar un elemento
    setDashboardLoaded(false);
    fetchDashboardData();
  };

  if (loading || !administrador) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando información del administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Panel de Administrador
              </h1>
              <p className="text-slate-600">
                {administrador.institucion.nombre}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {administrador.nombre} {administrador.apellido}
                </p>
                <p className="text-sm text-slate-600">{administrador.cargo}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header con botones de acción */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard de Administración</h2>
              <p className="text-slate-600 mt-1">
                Gestiona todos los datos de tu institución educativa
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar
              </button>
              <button
                onClick={() => {
                  setDashboardLoaded(false);
                  fetchDashboardData();
                }}
                disabled={dashboardLoading}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-400 transition-colors flex items-center"
              >
                <svg className={`w-4 h-4 mr-2 ${dashboardLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {dashboardLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
              <button
                onClick={() => setShowWizard(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Configurar
              </button>
            </div>
          </div>

          {/* Estado de carga */}
          {dashboardLoading && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando datos del dashboard...</p>
              </div>
            </div>
          )}

          {/* Dashboard de datos */}
          {!dashboardLoading && dashboardData && (
            <>
              <DashboardStats estadisticas={dashboardData.estadisticas} />
              <DashboardSections
                areas={dashboardData.datos.areas}
                materias={dashboardData.datos.materias}
                grados={dashboardData.datos.grados}
                cursos={dashboardData.datos.cursos}
                docentes={dashboardData.datos.docentes}
                estudiantes={dashboardData.datos.estudiantes}
                institucionId={institucionId || 0}
              />
            </>
          )}

          {/* Estado sin datos */}
          {!dashboardLoading && !dashboardData && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No hay datos disponibles
                </h3>
                <p className="text-slate-600 mb-6">
                  Comienza configurando tu institución educativa
                </p>
                <button
                  onClick={() => setShowWizard(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center shadow-lg mx-auto"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Iniciar Configuración
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Setup Wizard Modal */}
      {showWizard && (
        <SetupWizard 
          institucionId={administrador.institucion.id}
          onClose={() => setShowWizard(false)} 
        />
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          institucionId={administrador.institucion.id}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}
