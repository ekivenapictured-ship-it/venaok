
<old_str>import React from 'react';

const Clients: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manajemen Klien</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Tambah Klien
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Daftar Klien</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Telepon</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Sejak</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Sarah Johnson</td>
                  <td className="py-3 px-4">sarah@email.com</td>
                  <td className="py-3 px-4">+62812345678</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Aktif
                    </span>
                  </td>
                  <td className="py-3 px-4">Jan 2023</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;</old_str>
<new_str>import React, { useState, useEffect } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { Client, ClientStatus, ClientType } from '../types';
import Modal from './Modal';

const Clients: React.FC = () => {
  const { 
    getClients, createClient, updateClient, deleteClient, getProjects,
    isLoading, error 
  } = useDatabase();

  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'ALL'>('ALL');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    since: new Date().toISOString().split('T')[0],
    instagram: '',
    status: ClientStatus.ACTIVE,
    clientType: ClientType.DIRECT,
    lastContact: new Date().toISOString().split('T')[0],
    portalAccessId: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await getClients();
    if (data) setClients(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData = {
      ...formData,
      portalAccessId: formData.portalAccessId || generatePortalId()
    };

    if (editingClient) {
      const result = await updateClient(editingClient.id, clientData);
      if (result) {
        setClients(clients.map(c => c.id === editingClient.id ? result : c));
      }
    } else {
      const result = await createClient(clientData);
      if (result) {
        setClients([result, ...clients]);
      }
    }
    
    resetForm();
  };

  const generatePortalId = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      since: client.since.split('T')[0],
      instagram: client.instagram || '',
      status: client.status,
      clientType: client.clientType,
      lastContact: client.lastContact.split('T')[0],
      portalAccessId: client.portalAccessId
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus klien ini?')) {
      await deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      since: new Date().toISOString().split('T')[0],
      instagram: '',
      status: ClientStatus.ACTIVE,
      clientType: ClientType.DIRECT,
      lastContact: new Date().toISOString().split('T')[0],
      portalAccessId: ''
    });
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ClientStatus) => {
    const colors = {
      [ClientStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [ClientStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
      [ClientStatus.LEAD]: 'bg-blue-100 text-blue-800',
      [ClientStatus.LOST]: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const ClientDetailModal = ({ client, onClose }: { client: Client; onClose: () => void }) => {
    const [clientProjects, setClientProjects] = useState([]);

    useEffect(() => {
      const loadClientProjects = async () => {
        const projects = await getProjects();
        if (projects) {
          setClientProjects(projects.filter(p => p.clientId === client.id));
        }
      };
      loadClientProjects();
    }, [client.id]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{client.name}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3">Informasi Kontak</h4>
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Telepon:</strong> {client.phone}</p>
              <p><strong>Instagram:</strong> {client.instagram || 'Tidak ada'}</p>
              <p><strong>Portal ID:</strong> {client.portalAccessId}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Status & Info</h4>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </p>
              <p><strong>Tipe:</strong> {client.clientType}</p>
              <p><strong>Klien Sejak:</strong> {new Date(client.since).toLocaleDateString('id-ID')}</p>
              <p><strong>Kontak Terakhir:</strong> {new Date(client.lastContact).toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Proyek ({clientProjects.length})</h4>
            <div className="bg-gray-50 rounded p-4 max-h-32 overflow-y-auto">
              {clientProjects.length > 0 ? (
                <div className="space-y-2">
                  {clientProjects.map((project, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{project.projectName}</span>
                      <span>{new Date(project.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Belum ada proyek</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => { onClose(); handleEdit(client); }}
              className="button-primary"
            >
              Edit
            </button>
            <button
              onClick={() => { onClose(); handleDelete(client.id); }}
              className="button-danger"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manajemen Klien</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Klien
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
              placeholder="Cari klien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'ALL')}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="ALL">Semua Status</option>
              <option value={ClientStatus.ACTIVE}>Aktif</option>
              <option value={ClientStatus.INACTIVE}>Tidak Aktif</option>
              <option value={ClientStatus.LEAD}>Prospek</option>
              <option value={ClientStatus.LOST}>Hilang</option>
            </select>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Telepon</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Sejak</th>
                  <th className="text-left py-3 px-4">Kontak Terakhir</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{client.name}</td>
                    <td className="py-3 px-4">{client.email}</td>
                    <td className="py-3 px-4">{client.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(client.since).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-4">{new Date(client.lastContact).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => setSelectedClient(client)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Detail
                      </button>
                      <button 
                        onClick={() => handleEdit(client)}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
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
        title={editingClient ? 'Edit Klien' : 'Tambah Klien'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telepon
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="@username"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as ClientStatus})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {Object.values(ClientStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe Klien
              </label>
              <select
                value={formData.clientType}
                onChange={(e) => setFormData({...formData, clientType: e.target.value as ClientType})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {Object.values(ClientType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Klien Sejak
              </label>
              <input
                type="date"
                required
                value={formData.since}
                onChange={(e) => setFormData({...formData, since: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kontak Terakhir
              </label>
              <input
                type="date"
                required
                value={formData.lastContact}
                onChange={(e) => setFormData({...formData, lastContact: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portal Access ID
            </label>
            <input
              type="text"
              value={formData.portalAccessId}
              onChange={(e) => setFormData({...formData, portalAccessId: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Kosongkan untuk generate otomatis"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="button-primary flex-1"
            >
              {editingClient ? 'Update' : 'Simpan'}
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

      {selectedClient && (
        <ClientDetailModal 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}
    </div>
  );
};

export default Clients;</new_str>
