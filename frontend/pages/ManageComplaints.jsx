import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from '../src/components/ConfirmationModal';
import { Activity, Loader2, ShieldCheck, Search, Image, Trash2, X } from 'lucide-react';

function ManageComplaints() {
  const { t } = useTranslation();
  const statusTranslations = {
    open: t('manageComplaints.open'),
    'in progress': t('manageComplaints.inProgress'),
    closed: t('manageComplaints.closed'),
  };
  const [complaints, setComplaints] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Build the Authorization header for authenticated API requests.
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const getComplaints = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints', getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      localStorage.removeItem('token');
      return [];
    }
  }, []);

  useEffect(() => {
    // Fetch complaints when component mounts or when getComplaints reference changes.
    const initComplaints = async () => {
      const data = await getComplaints();
      setComplaints(data);
    };
    initComplaints();
  }, [getComplaints]);

  // Update status in backend then refresh the list.
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}/status`, { status: newStatus }, getAuthHeader());
      const data = await getComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setComplaintToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Delete the complaint and close modal if successful.
  const confirmDelete = async () => {
    if (!complaintToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${complaintToDelete}`, getAuthHeader());
      const data = await getComplaints();
      setComplaints(data);
      setIsDeleteModalOpen(false);
      setComplaintToDelete(null);
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  // Apply current search and status filters before rendering the table.
  const filteredComplaints = complaints.filter((complaint) => {
    const normalizedStatus = complaint.status?.toLowerCase() ?? '';
    const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;
    const titleText = complaint.title?.toLowerCase() ?? '';
    const descriptionText = complaint.description?.toLowerCase() ?? '';
    const matchesSearch = titleText.includes(searchQuery.toLowerCase()) || descriptionText.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Keep a memoized tally of complaints per status to drive the summary cards.
  const statusCounts = useMemo(
    () =>
      complaints.reduce((acc, complaint) => {
        const normalized = complaint.status?.toLowerCase() ?? 'open';
        if (normalized === 'in progress') acc['in progress'] += 1;
        else if (normalized === 'closed') acc.closed += 1;
        else acc.open += 1;
        return acc;
      },
      { open: 0, 'in progress': 0, closed: 0 }),
    [complaints]
  );

  return (
    <section className="space-y-8">
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('manageComplaints.deleteModal.title')}
        message={t('manageComplaints.deleteModal.message')}
      />

      <div className="glass-panel space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">{t('manageComplaints.title')}</p>
            <h2 className="text-2xl font-semibold text-white">{t('manageComplaints.title')}</h2>
          </div>
          <p className="text-sm text-white/70">{t('manageComplaints.total')}: {filteredComplaints.length}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: t('manageComplaints.open'), value: statusCounts.open, icon: Activity },
            { title: t('manageComplaints.inProgress'), value: statusCounts['in progress'], icon: Loader2 },
            { title: t('manageComplaints.closed'), value: statusCounts.closed, icon: ShieldCheck },
          ].map((stat) => (
            <div key={stat.title} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 text-white">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                <span>{stat.title}</span>
                <stat.icon className="h-4 w-4 text-white/60" />
              </div>
              <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder={t('manageComplaints.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                <Search className="h-4 w-4" />
              </div>
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="modern-select w-full lg:w-56"
          >
            <option value="all">{t('manageComplaints.allStatuses')}</option>
            <option value="open">{t('manageComplaints.open')}</option>
            <option value="in progress">{t('manageComplaints.inProgress')}</option>
            <option value="closed">{t('manageComplaints.closed')}</option>
          </select>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30">
          <div className="overflow-auto">
            <table className="modern-table min-w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-widest text-white/60">
                <tr>
                  <th className="px-5 py-3">{t('manageComplaints.table.title')}</th>
                  <th className="flex items-center gap-2 px-5 py-3 text-white/70">
                    <Image className="h-4 w-4" />
                    <span>{t('manageComplaints.table.images')}</span>
                  </th>
                  <th className="px-5 py-3">{t('manageComplaints.table.description')}</th>
                  <th className="px-5 py-3">{t('manageComplaints.table.status')}</th>
                  <th className="px-5 py-3">{t('manageComplaints.table.date')}</th>
                  <th className="px-5 py-3">{t('manageComplaints.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="text-white/85">
                  {filteredComplaints.map((complaint) => {
                    const normalizedStatus = complaint.status?.toLowerCase() ?? 'open';
                    const statusClass = {
                      open: 'badge-open',
                      'in progress': 'badge-in-progress',
                      closed: 'badge-closed',
                    }[normalizedStatus] || 'badge';
                  return (
                    <tr key={complaint._id} className="transition hover:bg-white/10">
                      <td className="px-5 py-4 font-semibold text-white" title={complaint.title}>{complaint.title}</td>
                      <td className="px-5 py-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          {/* Normalize stored paths before hitting the preview endpoint. */}
                          {complaint.images && complaint.images.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImage(`http://localhost:5000/${img.replace(/\\/g, '/')}`)}
                              className="inline-block h-10 w-10 rounded-full border-2 border-white/30 bg-white/10 shadow-inner"
                            >
                              <img
                                src={`http://localhost:5000/${img.replace(/\\/g, '/')}`}
                                alt={`Complaint ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                          {complaint.image && !complaint.images && (
                            <button
                              onClick={() => setSelectedImage(`http://localhost:5000/${complaint.image.replace(/\\/g, '/')}`)}
                              className="inline-block h-10 w-10 rounded-full border-2 border-white/30 bg-white/10 shadow-inner"
                            >
                              <img
                                src={`http://localhost:5000/${complaint.image.replace(/\\/g, '/')}`}
                                alt="Complaint"
                                className="h-full w-full object-cover"
                              />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/70" title={complaint.description}>{complaint.description}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          {/* Badge + select keep admin actions inline. */}
                          <span className={`${statusClass} text-[11px] uppercase tracking-[0.3em]`}>{statusTranslations[normalizedStatus] ?? complaint.status}</span>
                          <select
                            value={normalizedStatus}
                            onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                            className="modern-select w-32 text-[10px]"
                          >
                            <option value="open">{t('manageComplaints.open')}</option>
                            <option value="in progress">{t('manageComplaints.inProgress')}</option>
                            <option value="closed">{t('manageComplaints.closed')}</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/60">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDeleteClick(complaint._id)}
                          className="inline-flex items-center rounded-2xl bg-red-500/90 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-500/40 transition hover:bg-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('manageComplaints.delete')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredComplaints.length === 0 && (
              <div className="p-6 text-center text-sm text-white/70">{t('manageComplaints.noComplaints')}</div>
            )}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full overflow-auto rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 rounded-full border border-white/40 bg-neutral-900/70 p-1 text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="mx-auto max-h-[80vh] w-auto rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default ManageComplaints;