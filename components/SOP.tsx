import React, { useState, useEffect } from 'react';
import { SOP, Profile } from '../types';
import { BookOpenIcon, PlusIcon, EyeIcon, PencilIcon, Trash2Icon, SearchIcon, ClipboardListIcon } from '../constants';
import Modal from './Modal';

interface SOPManagementProps {
  sops: SOP[];
  setSops: React.Dispatch<React.SetStateAction<SOP[]>>;
  profile: Profile;
  showNotification: (message: string) => void;
}

const SOPManagement: React.FC<SOPManagementProps> = ({ sops, setSops, profile, showNotification }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | 'delete'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredSOPs = sops.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || sop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    setSelectedSOP(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (sop: SOP) => {
    setSelectedSOP(sop);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (sop: SOP) => {
    setSelectedSOP(sop);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = (sop: SOP) => {
    setSelectedSOP(sop);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSOP) {
      setSops(prev => prev.filter(s => s.id !== selectedSOP.id));
      showNotification('SOP berhasil dihapus');
      setIsModalOpen(false);
      setSelectedSOP(null);
    }
  };

  const sopCategories = profile.sopCategories || [];

  // Get stats
  const totalSOPs = sops.length;
  const sopsByCategory = sopCategories.map(category => ({
    category,
    count: sops.filter(sop => sop.category === category).length
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Standard Operating Procedures</h1>
          <p className="text-brand-text-secondary mt-1">Kelola prosedur operasional standar</p>
        </div>
        <button onClick={handleAdd} className="button-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Tambah SOP
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-surface p-4 rounded-lg shadow-sm border border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpenIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-primary">{totalSOPs}</p>
              <p className="text-sm text-brand-text-secondary">Total SOP</p>
            </div>
          </div>
        </div>

        {sopsByCategory.slice(0, 3).map((item, index) => (
          <div key={item.category} className="bg-brand-surface p-4 rounded-lg shadow-sm border border-brand-border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                index === 0 ? 'bg-green-100' : index === 1 ? 'bg-yellow-100' : 'bg-purple-100'
              }`}>
                <ClipboardListIcon className={`w-5 h-5 ${
                  index === 0 ? 'text-green-600' : index === 1 ? 'text-yellow-600' : 'text-purple-600'
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-text-primary">{item.count}</p>
                <p className="text-sm text-brand-text-secondary">{item.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-brand-surface p-4 rounded-lg shadow-sm border border-brand-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Cari SOP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="">Semua Kategori</option>
            {sopCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* SOPs Grid */}
      <div className="grid gap-4">
        {filteredSOPs.map((sop, index) => (
          <div key={sop.id} className="bg-brand-surface p-6 rounded-lg shadow-sm border border-brand-border widget-animate" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-brand-text-primary">{sop.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {sop.category}
                  </span>
                </div>
                <p className="text-brand-text-secondary text-sm mb-2 line-clamp-3">
                  {sop.content.replace(/#{1,6}\s/g, '').replace(/\*\*/g, '').substring(0, 200)}...
                </p>
                <div className="flex items-center gap-4 text-xs text-brand-text-secondary">
                  <span>Terakhir diperbarui: {new Date(sop.lastUpdated).toLocaleDateString('id-ID')}</span>
                  <span>• {sop.content.split(' ').length} kata</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleView(sop)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Lihat"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(sop)}
                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(sop)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredSOPs.length === 0 && (
          <div className="text-center py-12 bg-brand-surface rounded-lg border border-brand-border">
            <BookOpenIcon className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <p className="text-brand-text-secondary">
              {searchTerm || selectedCategory ? 'Tidak ada SOP yang sesuai dengan filter' : 'Belum ada SOP'}
            </p>
            {!searchTerm && !selectedCategory && (
              <button onClick={handleAdd} className="button-primary mt-4">
                Buat SOP Pertama
              </button>
            )}
          </div>
        )}
      </div>

      {/* SOP Modal */}
      {isModalOpen && (
        <SOPModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sop={selectedSOP}
          mode={modalMode}
          sops={sops}
          setSops={setSops}
          profile={profile}
          showNotification={showNotification}
          onConfirmDelete={confirmDelete}
        />
      )}
    </div>
  );
};

// SOP Modal Component
const SOPModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  sop: SOP | null;
  mode: 'add' | 'edit' | 'view' | 'delete';
  sops: SOP[];
  setSops: React.Dispatch<React.SetStateAction<SOP[]>>;
  profile: Profile;
  showNotification: (message: string) => void;
  onConfirmDelete?: () => void;
}> = ({ isOpen, onClose, sop, mode, sops, setSops, profile, showNotification, onConfirmDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  });

  useEffect(() => {
    if (sop && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: sop.title,
        category: sop.category,
        content: sop.content
      });
    } else if (mode === 'add') {
      setFormData({
        title: '',
        category: profile.sopCategories?.[0] || '',
        content: ''
      });
    }
  }, [sop, mode, profile.sopCategories]);

  if (mode === 'delete') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus">
        <div className="space-y-4">
          <p className="text-brand-text-primary">
            Apakah Anda yakin ingin menghapus SOP "{sop?.title}"?
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
              Hapus SOP
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'view') return;

    const sopData: SOP = {
      id: sop?.id || `sop-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      content: formData.content,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (mode === 'add') {
      setSops(prev => [sopData, ...prev]);
      showNotification('SOP berhasil ditambahkan');
    } else {
      setSops(prev => prev.map(s => s.id === sop?.id ? sopData : s));
      showNotification('SOP berhasil diperbarui');
    }

    onClose();
  };

  // Preview content for view mode
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold text-brand-text-primary mb-4 mt-6">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold text-brand-text-primary mb-3 mt-5">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-bold text-brand-text-primary mb-2 mt-4">{line.substring(4)}</h3>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-brand-text-primary mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'add' ? 'Tambah' : mode === 'edit' ? 'Edit' : 'Detail'} SOP`}>
      {mode === 'view' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {sop?.category}
            </span>
            <span className="text-sm text-brand-text-secondary">
              Terakhir diperbarui: {sop?.lastUpdated && new Date(sop.lastUpdated).toLocaleDateString('id-ID')}
            </span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {sop?.content && renderContent(sop.content)}
          </div>
          <div className="flex justify-end pt-4 border-t">
            <button onClick={() => { setModalMode('edit'); }} className="button-primary">
              Edit SOP
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Judul SOP</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
              className="input-field w-full"
              required
              placeholder="Masukkan judul SOP"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
              className="input-field w-full"
              required
            >
              <option value="">Pilih Kategori</option>
              {profile.sopCategories?.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">
              Konten SOP
              <span className="text-xs text-brand-text-secondary ml-2">(Mendukung Markdown)</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
              className="input-field w-full font-mono text-sm"
              rows={15}
              required
              placeholder="# Judul SOP&#10;&#10;## Langkah-langkah:&#10;1. Langkah pertama&#10;2. Langkah kedua&#10;&#10;### Catatan Penting:&#10;- Poin penting&#10;- Tips tambahan"
            />
            <p className="text-xs text-brand-text-secondary mt-1">
              Gunakan # untuk judul, ## untuk sub-judul, dan ### untuk sub-sub-judul
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="button-secondary">
              Batal
            </button>
            <button type="submit" className="button-primary">
              {mode === 'add' ? 'Tambah SOP' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default SOPManagement;