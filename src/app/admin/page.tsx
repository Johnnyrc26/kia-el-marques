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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Send,
  Share2,
  AlertTriangle
} from 'lucide-react';
import { LeadSubmission } from '@/types';
import { ADVISORS, Advisor } from '@/data/advisors';

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
  const [assigningLead, setAssigningLead] = useState<LeadSubmission | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<LeadSubmission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [justRefreshed, setJustRefreshed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterModel, filterStatus, searchQuery]);

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

  const formatWhatsAppPhone = (phone?: string): string => {
    if (!phone) return '';
    const digits = phone.replace(/[^0-9]/g, '');
    if (!digits) return '';
    if (digits.startsWith('58')) return digits;
    if (digits.startsWith('0')) return '58' + digits.slice(1);
    if (digits.length === 10 && digits.startsWith('4')) return '58' + digits;
    return digits.length > 7 ? '58' + digits : digits;
  };

  const resolveColorSwatch = (colorName?: string): { hex: string; isSpecial: boolean; isLight: boolean } => {
    if (!colorName) return { hex: '#94a3b8', isSpecial: true, isLight: false };
    const lower = colorName.toLowerCase().trim();

    if (
      lower.includes('cualquiera') ||
      lower.includes('piso') ||
      lower.includes('no definido') ||
      lower.includes('por coordinar') ||
      lower.includes('por definir')
    ) {
      return { hex: '#94a3b8', isSpecial: true, isLight: false };
    }

    // Whites
    if (lower.includes('white') || lower.includes('blanco')) {
      return { hex: '#ffffff', isSpecial: false, isLight: true };
    }
    // Titanium / Silvers
    if (lower.includes('titanium') || lower.includes('titanio')) {
      return { hex: '#a8adb2', isSpecial: false, isLight: false };
    }
    if (lower.includes('silver') || lower.includes('plata') || lower.includes('cerámica') || lower.includes('ceramic')) {
      return { hex: '#c0c2c4', isSpecial: false, isLight: true };
    }
    // Grays
    if (lower.includes('interstellar') || lower.includes('interestelar')) {
      return { hex: '#3f4448', isSpecial: false, isLight: false };
    }
    if (lower.includes('gravity') || lower.includes('grafito') || lower.includes('gravedad')) {
      return { hex: '#363c40', isSpecial: false, isLight: false };
    }
    if (lower.includes('steel gray') || lower.includes('gris acero')) {
      return { hex: '#71767c', isSpecial: false, isLight: false };
    }
    if (lower.includes('panthera') || lower.includes('metal')) {
      return { hex: '#3e4147', isSpecial: false, isLight: false };
    }
    if (lower.includes('platina') || lower.includes('platino') || lower.includes('astro')) {
      return { hex: '#4b5563', isSpecial: false, isLight: false };
    }
    if (lower.includes('gray') || lower.includes('gris')) {
      return { hex: '#64748b', isSpecial: false, isLight: false };
    }
    // Blacks
    if (lower.includes('black') || lower.includes('negro') || lower.includes('aurora')) {
      return { hex: '#111111', isSpecial: false, isLight: false };
    }
    // Blues
    if (lower.includes('blue stone') || lower.includes('azul pizarra')) {
      return { hex: '#34495e', isSpecial: false, isLight: false };
    }
    if (lower.includes('denim') || lower.includes('vesta') || lower.includes('astra')) {
      return { hex: '#1e3a5f', isSpecial: false, isLight: false };
    }
    if (lower.includes('ocean') || lower.includes('océano') || lower.includes('deep chroma') || lower.includes('profundo')) {
      return { hex: '#0f2744', isSpecial: false, isLight: false };
    }
    if (lower.includes('pluton') || lower.includes('plutón')) {
      return { hex: '#2563eb', isSpecial: false, isLight: false };
    }
    if (lower.includes('mineral') || lower.includes('smoke') || lower.includes('humo')) {
      return { hex: '#1e4e66', isSpecial: false, isLight: false };
    }
    if (lower.includes('imperial')) {
      return { hex: '#102a43', isSpecial: false, isLight: false };
    }
    if (lower.includes('blue') || lower.includes('azul')) {
      return { hex: '#2563eb', isSpecial: false, isLight: false };
    }
    // Reds & Oranges
    if (lower.includes('red') || lower.includes('rojo')) {
      return { hex: '#b22222', isSpecial: false, isLight: false };
    }
    if (lower.includes('orange') || lower.includes('naranja') || lower.includes('mars') || lower.includes('marte')) {
      return { hex: '#ea580c', isSpecial: false, isLight: false };
    }
    // Greens
    if (lower.includes('green') || lower.includes('verde') || lower.includes('olive') || lower.includes('oliva')) {
      return { hex: '#2e4c38', isSpecial: false, isLight: false };
    }
    // Beiges & Tan
    if (lower.includes('beige') || lower.includes('tan') || lower.includes('champagne')) {
      return { hex: '#d4b996', isSpecial: false, isLight: false };
    }

    return { hex: '#64748b', isSpecial: false, isLight: false };
  };

  const handleForwardToAdvisor = async (lead: LeadSubmission, advisor: Advisor) => {
    // 1. Prepara el enlace con código de país 58 para que el asesor pueda contactar al cliente con 1 tap
    const cleanClientPhone = formatWhatsAppPhone(lead.phone);
    const clientDirectWa = `https://wa.me/${cleanClientPhone}?text=${encodeURIComponent(
      `Hola ${lead.full_name}, te saluda ${advisor.name} de Kia El Marqués. Recibí tu solicitud sobre el ${lead.model_interest} y con gusto te atenderé.`
    )}`;

    // 2. Ficha comercial ejecutiva formateada sin caracteres que corrompan en la redirección de WhatsApp
    const message =
`*KIA EL MARQUÉS · FICHA DE PROSPECTO*

Hola ${advisor.name}, se te ha asignado un nuevo prospecto comercial desde el Showroom Digital:

*• Cliente:* ${lead.full_name}
*• Teléfono:* ${lead.phone}
${lead.email ? `*• Email:* ${lead.email}\n` : ''}
*• Vehículo de Interés:* Kia ${lead.model_interest}
*• Color Preferido:* ${lead.favorite_color || 'Color a coordinar'}
*• Uso Principal:* ${lead.primary_use || 'No especificado'}
*• Perfil:* ${lead.buyer_type || 'No especificado'}
*• Modalidad de Pago:* ${lead.financing_interest || 'No especificado'}
*• Plazo Estimado:* ${lead.timeline || 'Por coordinar'}
${lead.notes ? `*• Comentarios del Cliente:* "${lead.notes}"\n` : ''}
*Contactar al cliente con 1 toque:*
${clientDirectWa}

_Por favor confirmar recepción._`;

    // 3. Abrir WhatsApp del asesor
    const cleanAdvisorPhone = formatWhatsAppPhone(advisor.phone);
    const advisorWaUrl = `https://wa.me/${cleanAdvisorPhone}?text=${encodeURIComponent(message)}`;
    window.open(advisorWaUrl, '_blank');

    // 4. Actualización optimista local
    const newStatus = (!lead.status || lead.status === 'nuevo') ? 'en_seguimiento' : lead.status;
    const updatedLead: LeadSubmission = {
      ...lead,
      advisor_name: advisor.name,
      advisor_slug: advisor.slug,
      status: newStatus,
    };

    setLeads((prev) => prev.map((l) => (l.id === lead.id ? updatedLead : l)));
    if (selectedLead && selectedLead.id === lead.id) {
      setSelectedLead(updatedLead);
    }
    setAssigningLead(null);

    // 5. Persistir en la API
    try {
      const savedKey = sessionStorage.getItem('kia_admin_pass') || password || 'kia2026';
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${savedKey}`,
        },
        body: JSON.stringify({
          id: lead.id,
          advisor_name: advisor.name,
          advisor_slug: advisor.slug,
          status: newStatus,
        }),
      });
    } catch (err) {
      console.error('Error al persistir asesor en prospecto:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    const leadId = leadToDelete.id!;
    setIsDeleting(true);

    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLead?.id === leadId) setSelectedLead(null);
    setLeadToDelete(null);
    setIsDeleting(false);

    try {
      const savedKey = sessionStorage.getItem('kia_admin_pass') || password || 'kia2026';
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

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
              autoComplete="current-password"
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
            <Link href="/elmarques" style={{ fontSize: '12.5px', color: '#64748b', textDecoration: 'none' }}>
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
                    <th style={{ padding: '12px 18px', width: '26%' }}>Cliente & Contacto</th>
                    <th style={{ padding: '12px 18px', width: '20%' }}>Vehículo de Interés</th>
                    <th style={{ padding: '12px 18px', width: '24%' }}>Propósito & Pago</th>
                    <th style={{ padding: '12px 18px', width: '15%' }}>Fecha & Seguimiento</th>
                    <th style={{ padding: '12px 18px', width: '15%', minWidth: '130px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeads.map((lead, index) => {
                    const rawPhone = formatWhatsAppPhone(lead.phone);
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
                              {lead.advisor_name && (
                                <div style={{ marginTop: '3px' }}>
                                  <span style={{ fontSize: '10px', color: '#0369a1', background: '#e0f2fe', border: '1px solid #bae6fd', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                    👤 {lead.advisor_name}
                                  </span>
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '4px', color: '#334155', fontSize: '12px' }}>
                            {(() => {
                              const colorSwatch = resolveColorSwatch(lead.favorite_color);
                              if (colorSwatch.isSpecial) {
                                return (
                                  <span
                                    style={{
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%',
                                      background: 'conic-gradient(from 180deg at 50% 50%, #f43f5e 0deg, #fbbf24 72deg, #10b981 144deg, #06b6d4 216deg, #6366f1 288deg, #f43f5e 360deg)',
                                      border: '1px solid rgba(0,0,0,0.15)',
                                      display: 'inline-block',
                                      flexShrink: 0,
                                    }}
                                    title="Sin color específico / Disponible en piso"
                                  />
                                );
                              }
                              return (
                                <span
                                  style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: colorSwatch.hex,
                                    border: colorSwatch.isLight ? '1.5px solid #94a3b8' : '1.5px solid rgba(15, 23, 42, 0.25)',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    display: 'inline-block',
                                    flexShrink: 0,
                                  }}
                                  title={lead.favorite_color}
                                />
                              );
                            })()}
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>
                              {lead.favorite_color || 'Color a coordinar'}
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

                        {/* Columna 5: Acciones */}
                        <td style={{ padding: '14px 18px', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedLead(lead)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '7px 12px',
                                borderRadius: '7px',
                                background: '#05141f',
                                border: '1px solid #05141f',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              title="Ver ficha completa y opciones de contacto"
                            >
                              <Eye size={14} />
                              <span>Ver Ficha</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setLeadToDelete(lead)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '7px',
                                background: '#fff1f2',
                                border: '1.5px solid #fecdd3',
                                color: '#e11d48',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              title="Eliminar este prospecto"
                            >
                              <Trash2 size={15} />
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

          {/* Barra de Paginación */}
          {filteredLeads.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '12.5px',
                color: '#64748b',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <span>
                  Mostrando <strong>{startIndex + 1}</strong> a{' '}
                  <strong>{Math.min(startIndex + pageSize, filteredLeads.length)}</strong> de{' '}
                  <strong>{filteredLeads.length}</strong> solicitudes
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px' }}>Por página:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      background: '#ffffff',
                      fontWeight: 600,
                      color: '#1e293b',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={validCurrentPage === 1}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: validCurrentPage === 1 ? '#f1f5f9' : '#ffffff',
                      color: validCurrentPage === 1 ? '#94a3b8' : '#1e293b',
                      cursor: validCurrentPage === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    <ChevronLeft size={14} />
                    <span>Anterior</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        totalPages <= 7 ||
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        Math.abs(pageNum - validCurrentPage) <= 1
                      ) {
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '6px',
                              border: pageNum === validCurrentPage ? '1px solid #0284c7' : '1px solid #e2e8f0',
                              background: pageNum === validCurrentPage ? '#0284c7' : '#ffffff',
                              color: pageNum === validCurrentPage ? '#ffffff' : '#334155',
                              fontWeight: 700,
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (
                        (pageNum === 2 && validCurrentPage > 3) ||
                        (pageNum === totalPages - 1 && validCurrentPage < totalPages - 2)
                      ) {
                        return (
                          <span key={pageNum} style={{ padding: '0 3px', color: '#94a3b8' }}>
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={validCurrentPage === totalPages}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: validCurrentPage === totalPages ? '#f1f5f9' : '#ffffff',
                      color: validCurrentPage === totalPages ? '#94a3b8' : '#1e293b',
                      cursor: validCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    <span>Siguiente</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
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
                {selectedLead.advisor_name && (
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ fontSize: '11.5px', color: '#0369a1', background: '#e0f2fe', border: '1px solid #bae6fd', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      👤 Asesor Asignado: {selectedLead.advisor_name}
                    </span>
                  </div>
                )}
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
              
              {/* Acciones Comerciales Directas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <a
                  href={`https://wa.me/${formatWhatsAppPhone(selectedLead.phone)}?text=${encodeURIComponent(
                    `Hola ${selectedLead.full_name}, te saluda tu anfitrión de Kia El Marqués. Recibimos tu solicitud sobre el ${selectedLead.model_interest} (${selectedLead.favorite_color || 'Color a coordinar'}). ¿En qué momento te resulta oportuno revisar la cotización oficial?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px 16px',
                    borderRadius: '9px',
                    background: '#25D366',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    boxShadow: '0 2px 4px rgba(37,211,102,0.25)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Contactar al cliente con mensaje pre-redactado"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Cliente</span>
                </a>

                <button
                  type="button"
                  onClick={() => setAssigningLead(selectedLead)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px 16px',
                    borderRadius: '9px',
                    background: '#0284c7',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(2,132,199,0.25)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Reenviar ficha completa al WhatsApp de un asesor oficial"
                >
                  <UserCheck size={16} />
                  <span>{selectedLead.advisor_name ? 'Reenviar a Asesor ↗' : 'Enviar a un Asesor ↗'}</span>
                </button>
              </div>

              {/* Contacto Directo */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Datos de Contacto
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={15} color="#0284c7" />
                    <a
                      href={`tel:${selectedLead.phone}`}
                      style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'monospace', color: '#0284c7', textDecoration: 'none' }}
                    >
                      {selectedLead.phone}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedLead.phone, `phone_modal_${selectedLead.id}`)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94a3b8' }}
                      title="Copiar teléfono"
                    >
                      {copiedId === `phone_modal_${selectedLead.id}` ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
                {selectedLead.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', color: '#475569', fontSize: '13px' }}>
                    <Mail size={15} color="#64748b" />
                    <a href={`mailto:${selectedLead.email}`} style={{ color: '#475569', textDecoration: 'none' }}>
                      {selectedLead.email}
                    </a>
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
                  {(() => {
                    const modalColor = resolveColorSwatch(selectedLead.favorite_color);
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        {modalColor.isSpecial ? (
                          <span
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              background: 'conic-gradient(from 180deg at 50% 50%, #f43f5e 0deg, #fbbf24 72deg, #10b981 144deg, #06b6d4 216deg, #6366f1 288deg, #f43f5e 360deg)',
                              border: '1px solid rgba(0,0,0,0.2)',
                              display: 'inline-block',
                              flexShrink: 0,
                            }}
                            title="Color flexible / En piso"
                          />
                        ) : (
                          <span
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              backgroundColor: modalColor.hex,
                              border: modalColor.isLight ? '1.5px solid #94a3b8' : '1.5px solid rgba(15, 23, 42, 0.3)',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                              display: 'inline-block',
                              flexShrink: 0,
                            }}
                            title={selectedLead.favorite_color}
                          />
                        )}
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                          {selectedLead.favorite_color || 'Cualquiera disponible en piso'}
                        </span>
                      </div>
                    );
                  })()}
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

              {/* Asignación y Reenvío a Asesor */}
              <div style={{ background: '#eff6ff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Asesor Comercial Asignado
                    </span>
                    <div style={{ fontSize: '13.5px', color: '#0f172a', fontWeight: 700, marginTop: '2px' }}>
                      {selectedLead.advisor_name ? (
                        <span>👤 {selectedLead.advisor_name}</span>
                      ) : (
                        <span style={{ color: '#64748b', fontWeight: 500 }}>Sin asesor asignado aún</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAssigningLead(selectedLead)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#0284c7',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(2,132,199,0.25)',
                    }}
                  >
                    <UserCheck size={15} />
                    <span>{selectedLead.advisor_name ? 'Reasignar / Reenviar ↗' : 'Enviar a un Asesor por WhatsApp ↗'}</span>
                  </button>
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

              {/* Botón de Eliminación en Modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setLeadToDelete(selectedLead)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#fff1f2',
                    border: '1.5px solid #fecdd3',
                    color: '#e11d48',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title="Eliminar este prospecto definitivamente"
                >
                  <Trash2 size={14} />
                  <span>Eliminar Prospecto</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal de Asignación / Reenvío al WhatsApp de un Asesor */}
      {assigningLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setAssigningLead(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
              padding: '28px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <span className="badge badge-green" style={{ marginBottom: '6px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Send size={12} />
                  <span>Reenvío Comercial Directo</span>
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Enviar Ficha a Asesor Oficial
                </h2>
                <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px', marginBottom: 0, lineHeight: 1.4 }}>
                  Selecciona el asesor al que deseas reenviar la ficha de <strong>{assigningLead.full_name}</strong> ({assigningLead.model_interest}) por WhatsApp:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssigningLead(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', flexShrink: 0 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Ficha Resumen del Prospecto */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '18px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>{assigningLead.full_name}</strong>
                  <span style={{ color: '#64748b', marginLeft: '6px' }}>({assigningLead.phone})</span>
                </div>
                <span style={{ fontWeight: 800, color: '#0f172a', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '11.5px' }}>
                  {assigningLead.model_interest}
                </span>
              </div>
              {assigningLead.advisor_name && (
                <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#0369a1', fontWeight: 600 }}>
                  Actualmente asignado a: {assigningLead.advisor_name}
                </div>
              )}
            </div>

            {/* Lista de Asesores Oficiales */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ADVISORS.map((adv) => {
                const advInitials = adv.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
                const isCurrentAdvisor = assigningLead.advisor_name === adv.name;

                return (
                  <div
                    key={adv.slug}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: isCurrentAdvisor ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                      background: isCurrentAdvisor ? '#f0f9ff' : '#ffffff',
                      transition: 'all 0.15s ease',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: isCurrentAdvisor ? '#0284c7' : '#05141f',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px',
                          flexShrink: 0,
                          border: isCurrentAdvisor ? '2px solid #0284c7' : '1px solid #cbd5e1',
                          position: 'relative',
                        }}
                      >
                        {adv.photo ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={adv.photo}
                            alt={adv.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center 15%',
                            }}
                          />
                        ) : (
                          advInitials
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{adv.name}</span>
                          {isCurrentAdvisor && (
                            <span style={{ fontSize: '10px', background: '#0284c7', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              Asignado
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          {adv.role} · <span style={{ fontFamily: 'monospace' }}>{adv.phoneFormatted || `+${adv.phone}`}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleForwardToAdvisor(assigningLead, adv)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: '#25D366',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: '0 1px 3px rgba(37,211,102,0.3)',
                        transition: 'transform 0.1s ease',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      title={`Enviar ficha comercial al WhatsApp de ${adv.name}`}
                    >
                      <MessageCircle size={14} />
                      <span>Enviar WhatsApp ↗</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setAssigningLead(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {leadToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => !isDeleting && setLeadToDelete(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
              padding: '28px',
              position: 'relative',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              ¿Eliminar este prospecto?
            </h3>

            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 22px 0' }}>
              Estás a punto de eliminar la ficha comercial de <strong style={{ color: '#0f172a' }}>{leadToDelete.full_name}</strong> ({leadToDelete.model_interest}).
              <br />
              <span style={{ fontSize: '12.5px', color: '#ef4444', fontWeight: 600, display: 'inline-block', marginTop: '6px' }}>
                Esta acción es permanente y no se puede deshacer.
              </span>
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setLeadToDelete(null)}
                disabled={isDeleting}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 4px rgba(220,38,38,0.25)',
                  transition: 'background 0.15s ease',
                }}
              >
                <Trash2 size={15} />
                <span>{isDeleting ? 'Eliminando...' : 'Sí, eliminar permanentemente'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
