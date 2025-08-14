import React, { useState, useMemo, useEffect } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { Asset, Profile } from '../types';
import PageHeader from './PageHeader';
import Modal from './Modal';
import StatCard from './StatCard';
import { PencilIcon, Trash2Icon, PlusIcon, DollarSignIcon, CameraIcon, SettingsIcon } from '../constants';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const getStatusClass = (status: AssetStatus) => {
    switch (status) {
        case AssetStatus.AVAILABLE: return 'bg-green-500/20 text-green-400';
        case AssetStatus.IN_USE: return 'bg-blue-500/20 text-blue-400';
        case AssetStatus.MAINTENANCE: return 'bg-yellow-500/20 text-yellow-400';
        default: return 'bg-gray-500/20 text-gray-400';
    }
};

const initialFormState: Omit<Asset, 'id'> = {
    name: '',
    category: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: 0,
    serialNumber: '',
    status: AssetStatus.AVAILABLE,
    notes: '',
};

interface AssetsProps {
    assets: Asset[];
    setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
    userProfile: Profile;
    showNotification: (message: string) => void;
}

const Assets: React.FC<AssetsProps> = ({ assets, setAssets, userProfile, showNotification }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [formData, setFormData] = useState<Omit<Asset, 'id'>>(initialFormState);

    const {
        getAssets, createAsset, updateAsset, deleteAsset,
        isLoading, error
    } = useDatabase();

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        const data = await getAssets();
        if (data) setAssets(data);
    };

    const assetStats = useMemo(() => {
        const totalValue = assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
        const inUseCount = assets.filter(a => a.status === AssetStatus.IN_USE).length;
        const maintenanceCount = assets.filter(a => a.status === AssetStatus.MAINTENANCE).length;
        return { totalValue, inUseCount, maintenanceCount };
    }, [assets]);

    const handleOpenModal = (mode: 'add' | 'edit', asset?: Asset) => {
        setModalMode(mode);
        if (mode === 'edit' && asset) {
            setSelectedAsset(asset);
            setFormData({
                name: asset.name,
                category: asset.category,
                purchaseDate: asset.purchaseDate,
                purchasePrice: asset.purchasePrice,
                serialNumber: asset.serialNumber,
                status: asset.status,
                notes: asset.notes,
            });
        } else {
            setSelectedAsset(null);
            setFormData({...initialFormState, category: userProfile.assetCategories[0] || ''});
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAsset(null);
        setFormData(initialFormState);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'purchasePrice' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const assetData = {
            ...formData,
            purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : undefined
        };

        if (selectedAsset) {
            const result = await updateAsset(selectedAsset.id, assetData);
            if (result) {
                setAssets(prev => prev.map(a =>
                    a.id === selectedAsset.id ? result : a
                ).sort((a,b) => a.name.localeCompare(b.name)));
                showNotification(`Aset "${formData.name}" berhasil diperbarui.`);
            }
        } else {
            const result = await createAsset(assetData);
            if (result) {
                setAssets(prev => [result, ...prev].sort((a,b) => a.name.localeCompare(b.name)));
                showNotification(`Aset "${formData.name}" berhasil ditambahkan.`);
            }
        }

        handleCloseModal();
    };

    const handleDelete = async (assetId: string) => {
        const assetName = assets.find(a => a.id === assetId)?.name;
        if (window.confirm(`Apakah Anda yakin ingin menghapus aset "${assetName}"?`)) {
            await deleteAsset(assetId);
            setAssets(prev => prev.filter(a => a.id !== assetId));
            showNotification(`Aset "${assetName}" telah dihapus.`);
        }
    };

    return (
        <div className="space-y-8">
            <PageHeader title="Manajemen Aset" subtitle="Lacak semua peralatan dan perlengkapan Anda.">
                <button onClick={() => handleOpenModal('add')} className="button-primary inline-flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    Tambah Aset
                </button>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <StatCard icon={<DollarSignIcon className="w-6 h-6" />} title="Total Nilai Aset" value={formatCurrency(assetStats.totalValue)} iconBgColor="bg-blue-500/20" iconColor="text-blue-400" />
                <StatCard icon={<CameraIcon className="w-6 h-6" />} title="Aset Sedang Dipakai" value={assetStats.inUseCount.toString()} iconBgColor="bg-indigo-500/20" iconColor="text-indigo-400" />
                <StatCard icon={<SettingsIcon className="w-6 h-6" />} title="Aset dalam Perbaikan" value={assetStats.maintenanceCount.toString()} iconBgColor="bg-yellow-500/20" iconColor="text-yellow-400" />
            </div>

            <div className="bg-brand-surface rounded-2xl p-6 shadow-lg border border-brand-border">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-brand-text-secondary uppercase">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Nama Aset</th>
                                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Kategori</th>
                                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Tgl. Beli</th>
                                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Harga Beli</th>
                                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 font-medium tracking-wider text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {assets.map(asset => (
                                <tr key={asset.id} className="hover:bg-brand-bg transition-colors">
                                    <td className="px-6 py-4 font-semibold text-brand-text-light">{asset.name}</td>
                                    <td className="px-6 py-4 text-brand-text-primary">{asset.category}</td>
                                    <td className="px-6 py-4 text-brand-text-primary">{new Date(asset.purchaseDate).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 font-semibold text-brand-text-primary">{formatCurrency(asset.purchasePrice)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(asset.status)}`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button onClick={() => handleOpenModal('edit', asset)} className="p-2 text-brand-text-secondary hover:bg-brand-input rounded-full" title="Edit"><PencilIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(asset.id)} className="p-2 text-brand-text-secondary hover:bg-brand-input rounded-full" title="Hapus"><Trash2Icon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {assets.length === 0 && !isLoading && <p className="text-center py-10 text-brand-text-secondary">Belum ada aset yang ditambahkan.</p>}
                     {isLoading && <p className="text-center py-10 text-brand-text-secondary">Memuat aset...</p>}
                     {error && <p className="text-center py-10 text-red-500">Terjadi kesalahan: {error}</p>}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalMode === 'add' ? 'Tambah Aset Baru' : 'Edit Aset'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="input-group">
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} className="input-field" placeholder=" " required />
                        <label htmlFor="name" className="input-label">Nama Aset</label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-group">
                            <select id="category" name="category" value={formData.category} onChange={handleFormChange} className="input-field" required>
                                <option value="" disabled>Pilih Kategori...</option>
                                {userProfile.assetCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <label htmlFor="category" className="input-label">Kategori</label>
                        </div>
                        <div className="input-group">
                             <select id="status" name="status" value={formData.status} onChange={handleFormChange} className="input-field" required>
                                {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <label htmlFor="status" className="input-label">Status</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-group">
                            <input type="date" id="purchaseDate" name="purchaseDate" value={formData.purchaseDate} onChange={handleFormChange} className="input-field" placeholder=" " required />
                            <label htmlFor="purchaseDate" className="input-label">Tanggal Pembelian</label>
                        </div>
                         <div className="input-group">
                            <input type="number" id="purchasePrice" name="purchasePrice" value={formData.purchasePrice || ''} onChange={handleFormChange} className="input-field" placeholder=" " required />
                            <label htmlFor="purchasePrice" className="input-label">Harga Beli (IDR)</label>
                        </div>
                    </div>
                    <div className="input-group">
                        <input type="text" id="serialNumber" name="serialNumber" value={formData.serialNumber} onChange={handleFormChange} className="input-field" placeholder=" "/>
                        <label htmlFor="serialNumber" className="input-label">Nomor Seri (Opsional)</label>
                    </div>
                    <div className="input-group">
                        <textarea id="notes" name="notes" value={formData.notes} onChange={handleFormChange} className="input-field" placeholder=" " rows={3}></textarea>
                        <label htmlFor="notes" className="input-label">Catatan (Opsional)</label>
                    </div>
                    <div className="flex justify-end items-center gap-3 pt-6 border-t border-brand-border">
                        <button type="button" onClick={handleCloseModal} className="button-secondary">Batal</button>
                        <button type="submit" className="button-primary">{selectedAsset ? 'Update Aset' : 'Simpan Aset'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Assets;