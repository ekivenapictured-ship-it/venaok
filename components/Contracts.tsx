import React, { useState, useEffect } from 'react';
import { Contract, Client, Project, Profile, Package, NavigationAction } from '../types';
import { FileTextIcon, PlusIcon, EyeIcon, PencilIcon, Trash2Icon, PrinterIcon, UserCheckIcon, SearchIcon } from '../constants';
import Modal from './Modal';
import SignaturePad from './SignaturePad';

interface ContractsProps {
  contracts: Contract[];
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
  clients: Client[];
  projects: Project[];
  profile: Profile;
  packages: Package[];
  showNotification: (message: string) => void;
  initialAction?: NavigationAction | null;
  setInitialAction?: React.Dispatch<React.SetStateAction<NavigationAction | null>>;
  onSignContract: (contractId: string, signatureDataUrl: string, signer: 'vendor' | 'client') => void;
}

const Contracts: React.FC<ContractsProps> = ({
  contracts, setContracts, clients, projects, profile, packages,
  showNotification, initialAction, setInitialAction, onSignContract
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | 'delete'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'signingDate' | 'contractNumber'>('signingDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'vendor' | 'client'>('vendor');

  // Handle initial action
  useEffect(() => {
    if (initialAction) {
      if (initialAction.type === 'ADD_CONTRACT') {
        setModalMode('add');
        setSelectedContract(null);
        setIsModalOpen(true);
      } else if (initialAction.type === 'VIEW_CONTRACT' && initialAction.id) {
        const contract = contracts.find(c => c.id === initialAction.id);
        if (contract) {
          setSelectedContract(contract);
          setModalMode('view');
          setIsModalOpen(true);
        }
      }
      setInitialAction?.(null);
    }
  }, [initialAction, contracts, setInitialAction]);

  const filteredAndSortedContracts = contracts
    .filter(contract => 
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.clientName1.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = sortBy === 'signingDate' ? new Date(a.signingDate).getTime() : a.contractNumber;
      const bValue = sortBy === 'signingDate' ? new Date(b.signingDate).getTime() : b.contractNumber;

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleAdd = () => {
    setSelectedContract(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (contract: Contract) => {
    setSelectedContract(contract);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (contract: Contract) => {
    setSelectedContract(contract);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = (contract: Contract) => {
    setSelectedContract(contract);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContract) {
      setContracts(prev => prev.filter(c => c.id !== selectedContract.id));
      showNotification('Kontrak berhasil dihapus');
      setIsModalOpen(false);
      setSelectedContract(null);
    }
  };

  const handleSignature = (contract: Contract, mode: 'vendor' | 'client') => {
    setSelectedContract(contract);
    setSignatureMode(mode);
    setIsSignatureModalOpen(true);
  };

  const handleSignatureSave = (signatureDataUrl: string) => {
    if (selectedContract) {
      onSignContract(selectedContract.id, signatureDataUrl, signatureMode);
      setIsSignatureModalOpen(false);
      setSelectedContract(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Kontrak Kerja</h1>
          <p className="text-brand-text-secondary mt-1">Kelola kontrak dan dokumen legal</p>
        </div>
        <button onClick={handleAdd} className="button-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Buat Kontrak Baru
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-surface p-4 rounded-lg shadow-sm border border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileTextIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-primary">{contracts.length}</p>
              <p className="text-sm text-brand-text-secondary">Total Kontrak</p>
            </div>
          </div>
        </div>
        <div className="bg-brand-surface p-4 rounded-lg shadow-sm border border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheckIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-primary">
                {contracts.filter(c => c.vendorSignature && c.clientSignature).length}
              </p>
              <p className="text-sm text-brand-text-secondary">Ditandatangani Lengkap</p>
            </div>
          </div>
        </div>
        <div className="bg-brand-surface p-4 rounded-lg shadow-sm border border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileTextIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-primary">
                {contracts.filter(c => !c.vendorSignature || !c.clientSignature).length}
              </p>
              <p className="text-sm text-brand-text-secondary">Menunggu Tanda Tangan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-brand-surface p-4 rounded-lg shadow-sm border border-brand-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Cari kontrak atau klien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'signingDate' | 'contractNumber')}
              className="input-field"
            >
              <option value="signingDate">Urutkan: Tanggal</option>
              <option value="contractNumber">Urutkan: Nomor</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-brand-border rounded-lg hover:bg-brand-input transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Contracts Grid */}
      <div className="grid gap-4">
        {filteredAndSortedContracts.map((contract, index) => {
          const client = clients.find(c => c.id === contract.clientId);
          const project = projects.find(p => p.id === contract.projectId);

          return (
            <div key={contract.id} className="bg-brand-surface p-6 rounded-lg shadow-sm border border-brand-border widget-animate" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-brand-text-primary">{contract.contractNumber}</h3>
                    <div className="flex gap-1">
                      {contract.vendorSignature && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Ditandatangani Vendor
                        </span>
                      )}
                      {contract.clientSignature && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Ditandatangani Klien
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-brand-text-secondary">
                    {contract.clientName1} - {project?.projectName || 'Proyek Tidak Ditemukan'}
                  </p>
                  <p className="text-sm text-brand-text-secondary mt-1">
                    Tanggal: {new Date(contract.signingDate).toLocaleDateString('id-ID')}
                  </p>
                  {contract.signingLocation && (
                    <p className="text-sm text-brand-text-secondary">
                      Lokasi: {contract.signingLocation}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(contract)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Lihat Detail"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(contract)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(contract)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Cetak"
                  >
                    <PrinterIcon className="w-5 h-5" />
                  </button>
                  {!contract.vendorSignature && (
                    <button
                      onClick={() => handleSignature(contract, 'vendor')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Tanda Tangan Vendor"
                    >
                      <UserCheckIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredAndSortedContracts.length === 0 && (
          <div className="text-center py-12 bg-brand-surface rounded-lg border border-brand-border">
            <FileTextIcon className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <p className="text-brand-text-secondary">
              {searchTerm ? 'Tidak ada kontrak yang sesuai dengan pencarian' : 'Belum ada kontrak'}
            </p>
            {!searchTerm && (
              <button onClick={handleAdd} className="button-primary mt-4">
                Buat Kontrak Pertama
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contract Modal */}
      {isModalOpen && (
        <ContractModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          contract={selectedContract}
          mode={modalMode}
          contracts={contracts}
          setContracts={setContracts}
          clients={clients}
          projects={projects}
          profile={profile}
          packages={packages}
          showNotification={showNotification}
          onConfirmDelete={confirmDelete}
        />
      )}

      {/* Signature Modal */}
      {isSignatureModalOpen && (
        <Modal isOpen={isSignatureModalOpen} onClose={() => setIsSignatureModalOpen(false)} title="Tanda Tangan Digital">
          <SignaturePad
            onSave={handleSignatureSave}
            onCancel={() => setIsSignatureModalOpen(false)}
            title={`Tanda Tangan ${signatureMode === 'vendor' ? 'Vendor' : 'Klien'}`}
          />
        </Modal>
      )}
    </div>
  );
};

// Contract Modal Component
const ContractModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  mode: 'add' | 'edit' | 'view' | 'delete';
  contracts: Contract[];
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
  clients: Client[];
  projects: Project[];
  profile: Profile;
  packages: Package[];
  showNotification: (message: string) => void;
  onConfirmDelete?: () => void;
}> = ({ isOpen, onClose, contract, mode, contracts, setContracts, clients, projects, profile, packages, showNotification, onConfirmDelete }) => {
  const [formData, setFormData] = useState({
    contractNumber: '',
    clientId: '',
    projectId: '',
    signingDate: new Date().toISOString().split('T')[0],
    signingLocation: '',
    clientName1: '',
    clientAddress1: '',
    clientPhone1: '',
    clientName2: '',
    clientAddress2: '',
    clientPhone2: '',
    shootingDuration: '',
    guaranteedPhotos: '',
    albumDetails: '',
    digitalFilesFormat: '',
    otherItems: '',
    personnelCount: '',
    deliveryTimeframe: '',
    dpDate: new Date().toISOString().split('T')[0],
    finalPaymentDate: '',
    cancellationPolicy: '',
    jurisdiction: 'Jakarta'
  });

  useEffect(() => {
    if (contract && (mode === 'edit' || mode === 'view')) {
      setFormData({
        contractNumber: contract.contractNumber,
        clientId: contract.clientId || '',
        projectId: contract.projectId || '',
        signingDate: contract.signingDate,
        signingLocation: contract.signingLocation || '',
        clientName1: contract.clientName1,
        clientAddress1: contract.clientAddress1 || '',
        clientPhone1: contract.clientPhone1 || '',
        clientName2: contract.clientName2 || '',
        clientAddress2: contract.clientAddress2 || '',
        clientPhone2: contract.clientPhone2 || '',
        shootingDuration: contract.shootingDuration || '',
        guaranteedPhotos: contract.guaranteedPhotos || '',
        albumDetails: contract.albumDetails || '',
        digitalFilesFormat: contract.digitalFilesFormat || '',
        otherItems: contract.otherItems || '',
        personnelCount: contract.personnelCount || '',
        deliveryTimeframe: contract.deliveryTimeframe || '',
        dpDate: contract.dpDate || new Date().toISOString().split('T')[0],
        finalPaymentDate: contract.finalPaymentDate || '',
        cancellationPolicy: contract.cancellationPolicy || '',
        jurisdiction: contract.jurisdiction || 'Jakarta'
      });
    } else if (mode === 'add') {
      const nextNumber = `VP/CTR/${new Date().getFullYear()}/${String(contracts.length + 1).padStart(3, '0')}`;
      setFormData(prev => ({
        ...prev,
        contractNumber: nextNumber
      }));
    }
  }, [contract, mode, contracts.length]);

  if (mode === 'delete') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus">
        <div className="space-y-4">
          <p className="text-brand-text-primary">
            Apakah Anda yakin ingin menghapus kontrak "{contract?.contractNumber}"?
          </p>
          <p className="text-sm text-brand-text-secondary">
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="button-secondary">
              Batal
            </button>
            <button 
              type="button" 
              onClick={onConfirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Hapus Kontrak
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'view') return;

    const contractData: Contract = {
      id: contract?.id || `contract-${Date.now()}`,
      contractNumber: formData.contractNumber,
      clientId: formData.clientId,
      projectId: formData.projectId,
      signingDate: formData.signingDate,
      signingLocation: formData.signingLocation,
      clientName1: formData.clientName1,
      clientAddress1: formData.clientAddress1,
      clientPhone1: formData.clientPhone1,
      clientName2: formData.clientName2,
      clientAddress2: formData.clientAddress2,
      clientPhone2: formData.clientPhone2,
      shootingDuration: formData.shootingDuration,
      guaranteedPhotos: formData.guaranteedPhotos,
      albumDetails: formData.albumDetails,
      digitalFilesFormat: formData.digitalFilesFormat,
      otherItems: formData.otherItems,
      personnelCount: formData.personnelCount,
      deliveryTimeframe: formData.deliveryTimeframe,
      dpDate: formData.dpDate,
      finalPaymentDate: formData.finalPaymentDate,
      cancellationPolicy: formData.cancellationPolicy,
      jurisdiction: formData.jurisdiction,
      vendorSignature: contract?.vendorSignature,
      clientSignature: contract?.clientSignature,
      createdAt: contract?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (mode === 'add') {
      setContracts(prev => [contractData, ...prev]);
      showNotification('Kontrak berhasil dibuat');
    } else {
      setContracts(prev => prev.map(c => c.id === contract?.id ? contractData : c));
      showNotification('Kontrak berhasil diperbarui');
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'add' ? 'Buat' : mode === 'edit' ? 'Edit' : 'Detail'} Kontrak`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Nomor Kontrak</label>
            <input
              type="text"
              value={formData.contractNumber}
              onChange={(e) => setFormData(prev => ({...prev, contractNumber: e.target.value}))}
              className="input-field w-full"
              required
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Klien</label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData(prev => ({...prev, clientId: e.target.value}))}
              className="input-field w-full"
              required
              disabled={mode === 'view'}
            >
              <option value="">Pilih Klien</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Proyek</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData(prev => ({...prev, projectId: e.target.value}))}
              className="input-field w-full"
              required
              disabled={mode === 'view'}
            >
              <option value="">Pilih Proyek</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.projectName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Tanggal Penandatanganan</label>
            <input
              type="date"
              value={formData.signingDate}
              onChange={(e) => setFormData(prev => ({...prev, signingDate: e.target.value}))}
              className="input-field w-full"
              required
              disabled={mode === 'view'}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Lokasi Penandatanganan</label>
            <input
              type="text"
              value={formData.signingLocation}
              onChange={(e) => setFormData(prev => ({...prev, signingLocation: e.target.value}))}
              className="input-field w-full"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Nama Klien 1</label>
            <input
              type="text"
              value={formData.clientName1}
              onChange={(e) => setFormData(prev => ({...prev, clientName1: e.target.value}))}
              className="input-field w-full"
              required
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Nama Klien 2</label>
            <input
              type="text"
              value={formData.clientName2}
              onChange={(e) => setFormData(prev => ({...prev, clientName2: e.target.value}))}
              className="input-field w-full"
              disabled={mode === 'view'}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Alamat Klien 1</label>
            <textarea
              value={formData.clientAddress1}
              onChange={(e) => setFormData(prev => ({...prev, clientAddress1: e.target.value}))}
              className="input-field w-full"
              rows={2}
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Durasi Shooting</label>
            <input
              type="text"
              value={formData.shootingDuration}
              onChange={(e) => setFormData(prev => ({...prev, shootingDuration: e.target.value}))}
              className="input-field w-full"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Foto Dijamin</label>
            <input
              type="text"
              value={formData.guaranteedPhotos}
              onChange={(e) => setFormData(prev => ({...prev, guaranteedPhotos: e.target.value}))}
              className="input-field w-full"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Tanggal DP</label>
            <input
              type="date"
              value={formData.dpDate}
              onChange={(e) => setFormData(prev => ({...prev, dpDate: e.target.value}))}
              className="input-field w-full"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Tanggal Pelunasan</label>
            <input
              type="date"
              value={formData.finalPaymentDate}
              onChange={(e) => setFormData(prev => ({...prev, finalPaymentDate: e.target.value}))}
              className="input-field w-full"
              disabled={mode === 'view'}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Kebijakan Pembatalan</label>
            <textarea
              value={formData.cancellationPolicy}
              onChange={(e) => setFormData(prev => ({...prev, cancellationPolicy: e.target.value}))}
              className="input-field w-full"
              rows={3}
              disabled={mode === 'view'}
            />
          </div>
        </div>

        {mode !== 'view' && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="button-secondary">
              Batal
            </button>
            <button type="submit" className="button-primary">
              {mode === 'add' ? 'Buat Kontrak' : 'Simpan Perubahan'}
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default Contracts;