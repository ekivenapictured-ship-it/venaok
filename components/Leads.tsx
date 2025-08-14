import React, { useState, useEffect } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { Lead, LeadStatus, ContactChannel } from '../types';
import Modal from './Modal';

const Leads: React.FC = () => {
  const { 
    getLeads, createLead, updateLead, deleteLead,
    isLoading, error 
  } = useDatabase();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');

  const [formData, setFormData] = useState({
    name: '',
    contactChannel: ContactChannel.INSTAGRAM,
    location: '',
    status: LeadStatus.DISCUSSION,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const data = await getLeads();
    if (data) setLeads(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingLead) {
      const result = await updateLead(editingLead.id, formData);
      if (result) {
        setLeads(leads.map(l => l.id === editingLead.id ? result : l));
      }
    } else {
      const result = await createLead(formData);
      if (result) {
        setLeads([result, ...leads]);
      }
    }

    resetForm();
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      contactChannel: lead.contactChannel,
      location: lead.location,
      status: lead.status,
      date: lead.date.split('T')[0],
      notes: lead.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus prospek ini?')) {
      await deleteLead(id);
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactChannel: ContactChannel.INSTAGRAM,
      location: '',
      status: LeadStatus.DISCUSSION,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingLead(null);
    setIsModalOpen(false);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      [LeadStatus.DISCUSSION]: 'bg-yellow-100 text-yellow-800',
      [LeadStatus.CONVERTED]: 'bg-green-100 text-green-800',
      [LeadStatus.LOST]: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const LeadDetailModal = ({ lead, onClose }: { lead: Lead; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{lead.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <p><strong>Channel:</strong> {lead.contactChannel}</p>
            <p><strong>Lokasi:</strong> {lead.location}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </p>
            <p><strong>Tanggal:</strong> {new Date(lead.date).toLocaleDateString('id-ID')}</p>
          </div>

          {lead.notes && (
            <div>
              <p><strong>Catatan:</strong></p>
              <p className="bg-gray-50 p-3 rounded whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => { onClose(); handleEdit(lead); }}
            className="button-primary"
          >
            Edit
          </button>
          <button
            onClick={() => { onClose(); handleDelete(lead.id); }}
            className="button-danger"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prospek</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Prospek
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Cari prospek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'ALL')}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="ALL">Semua Status</option>
              <option value={LeadStatus.DISCUSSION}>Diskusi</option>
              <option value={LeadStatus.CONVERTED}>Terkonversi</option>
              <option value={LeadStatus.LOST}>Hilang</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">Channel</th>
                  <th className="text-left py-3 px-4">Lokasi</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Tanggal</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{lead.name}</td>
                    <td className="py-3 px-4">{lead.contactChannel}</td>
                    <td className="py-3 px-4">{lead.location}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(lead.date).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Detail
                      </button>
                      <button 
                        onClick={() => handleEdit(lead)}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingLead ? 'Edit Prospek' : 'Tambah Prospek'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Channel Kontak
              </label>
              <select
                value={formData.contactChannel}
                onChange={(e) => setFormData({...formData, contactChannel: e.target.value as ContactChannel})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {Object.values(ContactChannel).map(channel => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as LeadStatus})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {Object.values(LeadStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="button-primary flex-1"
            >
              {editingLead ? 'Update' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="button-secondary flex-1"
            >
              Batal
            </button>
          </div>
        </form>
      </Modal>

      {selectedLead && (
        <LeadDetailModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
        />
      )}
    </div>
  );
};

export default Leads;