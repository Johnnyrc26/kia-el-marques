'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

  // Check existing session
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
      setLoginError('Error de conexión.');
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
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadSubmission['status']) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'ID',
      'Fecha',
      'Nombre',
      'Telefono',
      'Email',
      'Modelo',
      'Uso',
      'Tipo Comprador',
      'Color',
      'Financiamiento',
      'Tiempo',
      'Estado',
      'Notas',
    ];
    const rows = leads.map((l) => [
      l.id,
      l.created_at || '',
      `"${l.full_name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.model_interest}"`,
      `"${l.primary_use}"`,
      `"${l.buyer_type}"`,
      `"${l.favorite_color}"`,
      `"${l.financing_interest}"`,
      `"${l.timeline}"`,
      l.status || 'nuevo',
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_kia_el_marques_${new Date().toISOString().split('T')[0]}.csv`);
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
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesModel && matchesStatus && matchesQuery;
  });

  // Metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => !l.status || l.status === 'nuevo').length;
  const diasporaLeads = leads.filter((l) => l.buyer_type.includes('Diáspora')).length;
  const financingLeads = leads.filter((l) => l.financing_interest.includes('Crédito') || l.financing_interest.includes('Financiamiento')).length;

  if (!isAuthenticated) {
    return (
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh' }}>
        <div className="editorial-card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '14px', background: 'var(--g1)', borderRadius: '50%', marginBottom: '16px' }}>
            <svg viewBox="0 0 24 24" style={{ width: '28px', height: '28px', fill: 'var(--g100)' }}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--g100)', marginBottom: '8px' }}>
            Panel de Prospectos · Kia El Marqués
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--g60)', marginBottom: '24px' }}>
            Ingresa la clave de administración para acceder a la base de prospectos registrados.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="password"
              placeholder="Contraseña de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--g20)',
                fontSize: '14px',
                textAlign: 'center',
                fontFamily: 'var(--mono)',
              }}
            />
            {loginError && (
              <p style={{ color: 'var(--kia-red)', fontSize: '12px', fontWeight: 600 }}>{loginError}</p>
            )}
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px' }}>
              {loading ? 'Verificando...' : 'Entrar al Panel ↗'}
            </button>
          </form>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--g10)' }}>
            <Link href="/" style={{ fontSize: '12px', color: 'var(--g60)' }}>
              ← Volver al Portal Principal
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content" style={{ paddingBlock: '32px 64px' }}>
      <div className="shell" style={{ maxWidth: '1280px' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--g10)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-green">Conectado a Base de Datos</span>
              <span style={{ fontSize: '12px', color: 'var(--g60)' }}>Supabase + Respaldo Local</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--g100)', marginTop: '6px' }}>
              Control de Prospectos & Leads (Showroom Kia)
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button type="button" onClick={() => fetchLeads(password)} className="btn btn-outline" style={{ fontSize: '12.5px' }}>
              ↻ Refrescar
            </button>
            <button type="button" onClick={exportCSV} className="btn btn-primary" style={{ fontSize: '12.5px' }}>
              Descargar CSV ↓
            </button>
            <button type="button" onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '12.5px', color: 'var(--kia-red)' }}>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div className="editorial-box" style={{ margin: 0 }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--g60)', fontWeight: 700 }}>Total Prospectos</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--g100)', fontFamily: 'var(--mono)' }}>{totalLeads}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--g60)' }}>Registrados en la plataforma</div>
          </div>

          <div className="editorial-box" style={{ margin: 0 }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--blue)', fontWeight: 700 }}>Nuevos sin contactar</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--blue)', fontFamily: 'var(--mono)' }}>{newLeads}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--g60)' }}>Requieren llamada/WhatsApp</div>
          </div>

          <div className="editorial-box" style={{ margin: 0 }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 700 }}>Programa Diáspora</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--green)', fontFamily: 'var(--mono)' }}>{diasporaLeads}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--g60)' }}>Compradores desde el exterior</div>
          </div>

          <div className="editorial-box" style={{ margin: 0 }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--g90)', fontWeight: 700 }}>Interés en Financiamiento</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--g100)', fontFamily: 'var(--mono)' }}>{financingLeads}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--g60)' }}>Crédito bancario o directo</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="editorial-card" style={{ maxWidth: '100%', padding: '18px 24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o correo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--g20)',
                  fontSize: '13px',
                  minWidth: '240px',
                }}
              />

              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--g20)',
                  fontSize: '13px',
                  background: '#fff',
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

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--g20)',
                  fontSize: '13px',
                  background: '#fff',
                }}
              >
                <option value="todos">Todos los Estados</option>
                <option value="nuevo">Nuevos</option>
                <option value="contactado">Contactados</option>
                <option value="en_seguimiento">En Seguimiento</option>
                <option value="cerrado">Cerrados / Venta</option>
                <option value="descartado">Descartados</option>
              </select>
            </div>

            <span style={{ fontSize: '13px', color: 'var(--g60)', fontWeight: 600 }}>
              Mostrando {filteredLeads.length} de {totalLeads} prospectos
            </span>
          </div>
        </div>

        {/* Leads Table */}
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--g10)', overflowX: 'auto', boxShadow: 'var(--shadow-card)' }}>
          {filteredLeads.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--g60)' }}>
              <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>No hay prospectos para mostrar con los filtros aplicados.</p>
              <p style={{ fontSize: '13px' }}>Cuando los visitantes completen el cuestionario o formulario, aparecerán registrados aquí en tiempo real.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--g1)', borderBottom: '1px solid var(--g10)', color: 'var(--g60)', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '14px 18px' }}>Cliente & Contacto</th>
                  <th style={{ padding: '14px 18px' }}>Modelo & Color</th>
                  <th style={{ padding: '14px 18px' }}>Propósito & Tipo</th>
                  <th style={{ padding: '14px 18px' }}>Financiamiento</th>
                  <th style={{ padding: '14px 18px' }}>Tiempo</th>
                  <th style={{ padding: '14px 18px' }}>Estado</th>
                  <th style={{ padding: '14px 18px' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => {
                  const rawPhone = lead.phone.replace(/[^0-9]/g, '');
                  const waUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
                    `Hola ${lead.full_name}, te saluda tu anfitrión oficial de Kia El Marqués. Recibimos tu consulta sobre el ${lead.model_interest}. ¿En qué momento te resulta oportuno revisar la cotización y opciones de financiamiento?`
                  )}`;

                  return (
                    <tr
                      key={lead.id || index}
                      style={{
                        borderBottom: '1px solid var(--g10)',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : 'var(--g1)',
                      }}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--g100)', fontSize: '13.5px' }}>{lead.full_name}</div>
                        <div style={{ color: 'var(--g60)', fontSize: '12px', fontFamily: 'var(--mono)', marginTop: '2px' }}>{lead.phone}</div>
                        {lead.email && <div style={{ color: 'var(--g40)', fontSize: '11.5px' }}>{lead.email}</div>}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--g100)' }}>{lead.model_interest}</div>
                        <div style={{ color: 'var(--g60)', fontSize: '12px' }}>Color: {lead.favorite_color}</div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--g90)' }}>{lead.primary_use}</div>
                        <span
                          className={`badge ${lead.buyer_type.includes('Diáspora') ? 'badge-green' : 'badge-gray'}`}
                          style={{ marginTop: '4px', fontSize: '10.5px' }}
                        >
                          {lead.buyer_type}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontSize: '12.5px', color: 'var(--g80)' }}>{lead.financing_interest}</div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span className="spec-pill" style={{ fontSize: '11px' }}>{lead.timeline}</span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <select
                          value={lead.status || 'nuevo'}
                          onChange={(e) => handleStatusChange(lead.id!, e.target.value as any)}
                          style={{
                            padding: '6px 8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--g20)',
                            fontSize: '12px',
                            fontWeight: 700,
                            background:
                              (lead.status || 'nuevo') === 'nuevo'
                                ? 'var(--blue-bg)'
                                : (lead.status || 'nuevo') === 'cerrado'
                                ? 'var(--green-bg)'
                                : '#ffffff',
                            color:
                              (lead.status || 'nuevo') === 'nuevo'
                                ? 'var(--blue)'
                                : (lead.status || 'nuevo') === 'cerrado'
                                ? 'var(--green)'
                                : 'var(--g100)',
                          }}
                        >
                          <option value="nuevo">Nuevo</option>
                          <option value="contactado">Contactado</option>
                          <option value="en_seguimiento">En Seguimiento</option>
                          <option value="cerrado">Cerrado / Venta</option>
                          <option value="descartado">Descartado</option>
                        </select>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#25D366', color: '#fff', borderColor: '#25D366' }}
                        >
                          WhatsApp ↗
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
