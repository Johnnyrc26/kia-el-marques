'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Download, 
  RefreshCw, 
  LogOut, 
  MessageCircle, 
  Phone, 
  Mail, 
  Palette, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  X, 
  Copy, 
  Check, 
  Briefcase,
  Users,
  Eye,
  Trash2,
  Calendar,
  CreditCard,
  FileText,
  ChevronDown
} from 'lucide-react';
import { LeadSubmission } from '@/types';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterModel, setFilterModel] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [justRefreshed, setJustRefreshed] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    const savedKey = sessionStorage.getItem('kia_admin_pass');
    if (savedKey) {
      setPassword(savedKey);
      fetchLeads(savedKey);
    }
  }, []);

  const fetchLeads = async (pass: string) => {
    setLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`/api/leads?adminKey=${encodeURIComponent(pass)}`, {
        headers: { Authorization: `Bearer ${pass}` },
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        setLoginError('Contraseña incorrecta. Inténtalo nuevamente.');
        sessionStorage.removeItem('kia_admin_pass');
      } else {
        const data = await res.json();
        if (data.success) {
          setIsAuthenticated(true);
          setLeads(data.leads || []);
          sessionStorage.setItem('kia_admin_pass', pass);
        }
      }
    } catch (err) {
      console.error(err);
      setLoginError('Error de conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kia_admin_pass');
    setIsAuthenticated(false);
    setPassword('');
    setLeads([]);
    setSelectedLead(null);
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadSubmission['status']) => {
    try {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      await fetch('/api/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar permanentemente este prospecto?')) return;
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLead?.id === leadId) setSelectedLead(null);

    try {
      const savedKey = sessionStorage.getItem('kia_admin_pass') || 'kia2026';
      await fetch(`/api/leads?id=${encodeURIComponent(leadId)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${savedKey}`,
        },
      });
    } catch (err) {
      console.error('Error al eliminar prospecto:', err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = () => {
    const key = password || (typeof window !== 'undefined' ? sessionStorage.getItem('kia_admin_pass') : '') || 'kia2026';
    fetchLeads(key);
    setJustRefreshed(true);
    setTimeout(() => setJustRefreshed(false), 1500);
  };

  const exportCSV = () => {
    if (leads.length === 0) {
      alert('Actualmente no hay solicitudes registradas para exportar.');
      return;
    }
    const headers = [
      'ID',
      'Fecha',
      'Nombre Completo',
      'Teléfono',
      'Email',
      'Modelo de Interés',
      'Uso Principal',
      'Tipo de Comprador',
      'Color Preferido',
      'Modalidad de Pago',
      'Plazo de Compra',
      'Estado',
      'Notas del Cliente',
    ];
    const rows = leads.map((l) => [
      l.id,
      l.created_at || '',
      `"${(l.full_name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.model_interest || '').replace(/"/g, '""')}"`,
      `"${(l.primary_use || '').replace(/"/g, '""')}"`,
      `"${(l.buyer_type || '').replace(/"/g, '""')}"`,
      `"${(l.favorite_color || '').replace(/"/g, '""')}"`,
      `"${(l.financing_interest || '').replace(/"/g, '""')}"`,
      `"${(l.timeline || '').replace(/"/g, '""')}"`,
      l.status || 'nuevo',
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\r\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `prospectos_kia_el_marques_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesModel = filterModel === 'todos' || l.model_interest.toLowerCase().includes(filterModel.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || (l.status || 'nuevo') === filterStatus;
    const matchesQuery =
      searchQuery === '' ||
      l.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.model_interest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.notes && l.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesModel && matchesStatus && matchesQuery;
  });

  // Metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => !l.status || l.status === 'nuevo').length;
  const inProgressLeads = leads.filter((l) => l.status === 'en_seguimiento' || l.status === 'contactado').length;
  const closedLeads = leads.filter((l) => l.status === 'cerrado').length;

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Reciente';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'nuevo':
        return { label: 'Nuevo', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
      case 'contactado':
        return { label: 'Contactado', bg: '#fefce8', color: '#854d0e', border: '#fde047' };
      case 'en_seguimiento':
        return { label: 'En Seguimiento', bg: '#faf5ff', color: '#6b21a8', border: '#d8b4fe' };
      case 'cerrado':
        return { label: 'Cerrado / Venta', bg: '#f0fdf4', color: '#15803d', border: '#86efac' };
      case 'descartado':
        return { label: 'Descartado', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
      default:
        return { label: 'Nuevo', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '24px' }}>
        <div className="editorial-card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: '#05141f', borderRadius: '50%', color: '#ffffff', marginBottom: '18px' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Panel de Prospectos
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
            Kia El Marqués · Control de Solicitudes Comerciales
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="password"
              placeholder="Ingresa la clave de acceso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '15px',
                textAlign: 'center',
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />
            {loginError && (
              <p style={{ color: 'var(--kia-red)', fontSize: '12.5px', fontWeight: 600 }}>{loginError}</p>
            )}
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px', justifyContent: 'center' }}>
              {loading ? 'Verificando...' : 'Acceder al Panel ↗'}
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
            <Link href="/" style={{ fontSize: '12.5px', color: '#64748b', textDecoration: 'none' }}>
              ← Volver al Showroom Público
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Dashboard Main Screen
  return (
    <main className="main-content" style={{ paddingBlock: '32px 64px', backgroundColor: '#f8fafc', minHeight: '90vh' }}>
      <div className="shell" style={{ maxWidth: '1380px' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span>Showroom Digital Conectado</span>
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Kia El Marqués · Caracas</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              Bandeja de Prospectos & Solicitudes 0 km
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="btn btn-outline"
              style={{
                fontSize: '12.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fff',
                padding: '8px 14px',
                borderColor: justRefreshed ? '#16a34a' : '#cbd5e1',
                color: justRefreshed ? '#16a34a' : '#1e293b',
                transition: 'all 0.2s ease',
              }}
              title="Refrescar y sincronizar lista de prospectos"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{justRefreshed ? '¡Actualizado!' : 'Refrescar'}</span>
            </button>
            <button
              type="button"
              onClick={exportCSV}
              className="btn btn-outline"
              style={{
                fontSize: '12.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: leads.length === 0 ? '#f8fafc' : '#fff',
                color: leads.length === 0 ? '#94a3b8' : '#1e293b',
                borderColor: '#cbd5e1',
                padding: '8px 14px',
                cursor: leads.length === 0 ? 'not-allowed' : 'pointer',
              }}
              title={leads.length === 0 ? 'Sin solicitudes para exportar' : 'Descargar reporte completo en Excel / CSV'}
            >
              <Download size={14} />
              <span>Exportar CSV {leads.length > 0 ? `(${leads.length})` : ''}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ fontSize: '12.5px', color: '#dc2626', borderColor: '#fecaca', background: '#fff', padding: '8px 14px' }}
            >
              <LogOut size={14} />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>Total Solicitudes</span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>{totalLeads}</div>
              </div>
              <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                <Users size={18} />
              </div>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>Registrados en la plataforma</div>
          </div>

          <div style={{ background: '#fff', borderRadius: '10px', padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#2563eb', fontWeight: 700, letterSpacing: '0.04em' }}>Nuevos sin Contactar</span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb', marginTop: '2px', fontFamily: 'monospace' }}>{newLeads}</div>
              </div>
              <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>Requieren primer contacto WhatsApp</div>
          </div>

          <div style={{ background: '#fff', borderRadius: '10px', padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.04em' }}>En Seguimiento</span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#7c3aed', marginTop: '2px', fontFamily: 'monospace' }}>{inProgressLeads}</div>
              </div>
              <div style={{ padding: '8px', background: '#faf5ff', borderRadius: '8px', color: '#7c3aed' }}>
                <Briefcase size={18} />
              </div>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>Cotización enviada / En negociación</div>
          </div>

          <div style={{ background: '#fff', borderRadius: '10px', padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#16a34a', fontWeight: 700, letterSpacing: '0.04em' }}>Ventas Cerradas</span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a', marginTop: '2px', fontFamily: 'monospace' }}>{closedLeads}</div>
              </div>
              <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '8px', color: '#16a34a' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>Operaciones completadas</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ background: '#fff', borderRadius: '10px', padding: '14px 18px', marginBottom: '18px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
              {/* Search input */}
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Buscar por cliente, teléfono, modelo o notas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#f8fafc',
                  }}
                />
              </div>

              {/* Model filter */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <select
                  value={filterModel}
                  onChange={(e) => setFilterModel(e.target.value)}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    padding: '8px 36px 8px 14px',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#fff',
                    fontWeight: 600,
                    color: '#1e293b',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                >
                  <option value="todos">Todos los Modelos</option>
                  <option value="Tasman">Tasman</option>
                  <option value="Sportage">Sportage</option>
                  <option value="Seltos">Seltos</option>
                  <option value="Sorento">Sorento</option>
                  <option value="Picanto">Picanto</option>
                  <option value="Soluto">Soluto</option>
                  <option value="Sonet">Sonet</option>
                  <option value="Carnival">Carnival</option>
                </select>
                <ChevronDown
                  size={15}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Status filter */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    padding: '8px 36px 8px 14px',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#fff',
                    fontWeight: 600,
                    color: '#1e293b',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="nuevo">Nuevos</option>
                  <option value="contactado">Contactados</option>
                  <option value="en_seguimiento">En Seguimiento</option>
                  <option value="cerrado">Cerrados / Venta</option>
                  <option value="descartado">Descartados</option>
                </select>
                <ChevronDown
                  size={15}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
              {filteredLeads.length} de {totalLeads} solicitudes
            </span>
          </div>
        </div>

        {/* Enhanced Table */}
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          {filteredLeads.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: '#f1f5f9', borderRadius: '50%', color: '#94a3b8', marginBottom: '14px' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                {leads.length === 0 ? 'Aún no hay prospectos registrados' : 'No se encontraron resultados con los filtros actuales'}
              </h3>
              <p style={{ fontSize: '13px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.5 }}>
                {leads.length === 0
                  ? 'Cada vez que un visitante complete el cuestionario en la web, aparecerá aquí automáticamente con todos sus datos comerciales.'
                  : 'Prueba cambiando el modelo seleccionado o borrando el término de búsqueda.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '12px 18px', width: '28%' }}>Cliente & Contacto</th>
                    <th style={{ padding: '12px 18px', width: '22%' }}>Vehículo de Interés</th>
                    <th style={{ padding: '12px 18px', width: '24%' }}>Propósito & Pago</th>
                    <th style={{ padding: '12px 18px', width: '14%' }}>Fecha & Seguimiento</th>
                    <th style={{ padding: '12px 18px', width: '12%', textAlign: 'right' }}>Contacto</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => {
                    const rawPhone = lead.phone.replace(/[^0-9]/g, '');
                    const waText = encodeURIComponent(
                      `Hola ${lead.full_name}, te saluda tu anfitrión de Kia El Marqués. Recibimos tu solicitud sobre el ${lead.model_interest} (${lead.favorite_color || 'Color a coordinar'}). ¿En qué momento te resulta oportuno revisar la cotización oficial?`
                    );
                    const waUrl = `https://wa.me/${rawPhone}?text=${waText}`;
                    const badge = getStatusBadge(lead.status);
                    const initials = lead.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();

                    return (
                      <tr
                        key={lead.id || index}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.12s ease',
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelectedLead(lead)}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                      >
                        {/* Columna 1: Cliente & Contacto */}
                        <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: '#05141f',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '13px',
                                flexShrink: 0,
                              }}
                            >
                              {initials}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {lead.full_name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }} onClick={(e) => e.stopPropagation()}>
                                <a
                                  href={`tel:${lead.phone}`}
                                  style={{ color: '#0284c7', textDecoration: 'none', fontSize: '12px', fontFamily: 'monospace', fontWeight: 600 }}
                                >
                                  {lead.phone}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(lead.phone, `phone_${lead.id}`)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94a3b8' }}
                                  title="Copiar teléfono"
                                >
                                  {copiedId === `phone_${lead.id}` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                                </button>
                              </div>
                              {lead.email && (
                                <div style={{ color: '#64748b', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {lead.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Columna 2: Vehículo de Interés */}
                        <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '3px 9px',
                                borderRadius: '6px',
                                backgroundColor: '#0f172a',
                                color: '#ffffff',
                                fontWeight: 800,
                                fontSize: '12px',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {lead.model_interest}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: '#475569', fontSize: '12px' }}>
                            <span
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: '#94a3b8',
                                border: '1px solid rgba(0,0,0,0.2)',
                                display: 'inline-block',
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {lead.favorite_color || 'Color no definido'}
                            </span>
                          </div>
                        </td>

                        {/* Columna 3: Propósito & Pago */}
                        <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lead.primary_use}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 7px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                background: '#f1f5f9',
                                color: '#475569',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {lead.financing_interest}
                            </span>
                          </div>
                        </td>

                        {/* Columna 4: Fecha & Seguimiento */}
                        <td style={{ padding: '14px 18px', verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ color: '#64748b', fontSize: '11.5px', marginBottom: '5px', whiteSpace: 'nowrap' }}>
                            {formatDate(lead.created_at)}
                          </div>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <select
                              value={lead.status || 'nuevo'}
                              onChange={(e) => handleStatusChange(lead.id!, e.target.value as any)}
                              style={{
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                padding: '5px 26px 5px 10px',
                                borderRadius: '6px',
                                border: `1px solid ${badge.border}`,
                                backgroundColor: badge.bg,
                                color: badge.color,
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                outline: 'none',
                              }}
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="contactado">Contactado</option>
                              <option value="en_seguimiento">En Seguimiento</option>
                              <option value="cerrado">Cerrado / Venta</option>
                              <option value="descartado">Descartado</option>
                            </select>
                            <ChevronDown
                              size={12}
                              style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: badge.color,
                                pointerEvents: 'none',
                              }}
                            />
                          </div>
                        </td>

                        {/* Columna 5: Acciones de Contacto */}
                        <td style={{ padding: '14px 18px', verticalAlign: 'middle', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                background: '#25D366',
                                color: '#ffffff',
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '12px',
                              }}
                              title="Chatear por WhatsApp con mensaje pre-redactado"
                            >
                              <MessageCircle size={14} />
                              <span>WhatsApp</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => setSelectedLead(lead)}
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                color: '#334155',
                                cursor: 'pointer',
                              }}
                              title="Ver ficha completa"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id!)}
                              style={{
                                padding: '6px 7px',
                                borderRadius: '6px',
                                background: 'transparent',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer',
                              }}
                              title="Eliminar registro"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Drawer / Modal de Detalle Completo del Lead */}
      {selectedLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              padding: '28px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '6px' }}>
                  Ficha de Prospecto Kia 0 km
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {selectedLead.full_name}
                </h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Registrado el {formatDate(selectedLead.created_at)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Contacto Directo */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Datos de Contacto
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={15} color="#0284c7" />
                    <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'monospace' }}>
                      {selectedLead.phone}
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: '#25D366', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp</span>
                  </a>
                </div>
                {selectedLead.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', color: '#475569', fontSize: '13px' }}>
                    <Mail size={15} color="#64748b" />
                    <span>{selectedLead.email}</span>
                  </div>
                )}
              </div>

              {/* Preferencias del Carro */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Modelo Deseado</span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>
                    {selectedLead.model_interest}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Color Preferido</span>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>
                    {selectedLead.favorite_color || 'Cualquiera'}
                  </div>
                </div>
              </div>

              {/* Perfil & Uso */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Uso y Perfil Comercial
                </span>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '13px' }}>
                    <strong style={{ color: '#0f172a' }}>Uso Principal:</strong> <span style={{ color: '#334155' }}>{selectedLead.primary_use}</span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong style={{ color: '#0f172a' }}>Segmento:</strong> <span style={{ color: '#334155' }}>{selectedLead.buyer_type}</span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong style={{ color: '#0f172a' }}>Financiamiento:</strong> <span style={{ color: '#334155' }}>{selectedLead.financing_interest}</span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong style={{ color: '#0f172a' }}>Plazo de Compra:</strong> <span style={{ color: '#334155' }}>{selectedLead.timeline}</span>
                  </div>
                </div>
              </div>

              {/* Notas del Cliente */}
              {selectedLead.notes && (
                <div style={{ background: '#fffbeb', padding: '14px 16px', borderRadius: '10px', border: '1px solid #fef3c7' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                    Comentarios del Cliente
                  </span>
                  <p style={{ fontSize: '13px', color: '#78350f', marginTop: '6px', lineHeight: 1.5 }}>
                    "{selectedLead.notes}"
                  </p>
                </div>
              )}

              {/* Cambio de Estado en Modal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  Actualizar Estado:
                </span>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <select
                    value={selectedLead.status || 'nuevo'}
                    onChange={(e) => handleStatusChange(selectedLead.id!, e.target.value as any)}
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      padding: '8px 36px 8px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: '#fff',
                      color: '#0f172a',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="contactado">Contactado</option>
                    <option value="en_seguimiento">En Seguimiento</option>
                    <option value="cerrado">Cerrado / Venta</option>
                    <option value="descartado">Descartado</option>
                  </select>
                  <ChevronDown
                    size={15}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}
