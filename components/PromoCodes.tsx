import React, { useState, useEffect } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { PromoCode } from '../types';
import PageHeader from './PageHeader';
import Modal from './Modal';
import StatCard from './StatCard';
import { PlusIcon, PencilIcon, Trash2Icon, TagIcon, TrendingUpIcon, CalendarIcon, UsersIcon, EyeIcon, ToggleLeftIcon, ToggleRightIcon } from '../constants';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const emptyFormState = {
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    isActive: true,
    maxUsage: '',
    expiryDate: ''
};

interface PromoCodesProps {
    promoCodes: PromoCode[];
    setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
    showNotification: (message: string) => void;
}

const PromoCodes: React.FC<PromoCodesProps> = ({ promoCodes, setPromoCodes, showNotification }) => {
    const { 
        getPromoCodes, createPromoCode, updatePromoCode, deletePromoCode,
        isLoading, error 
    } = useDatabase();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
    const [formData, setFormData] = useState(emptyFormState);

    useEffect(() => {
        loadPromoCodes();
    }, []);

    const loadPromoCodes = async () => {
        const data = await getPromoCodes();
        if (data) setPromoCodes(data);
    };

    const handleOpenModal = (mode: 'add' | 'edit', promo?: PromoCode) => {
        setModalMode(mode);
        if (mode === 'edit' && promo) {
            setEditingPromo(promo);
            setFormData({
                code: promo.code,
                discountType: promo.discountType,
                discountValue: promo.discountValue.toString(),
                isActive: promo.isActive,
                maxUsage: promo.maxUsage?.toString() || '',
                expiryDate: promo.expiryDate || '',
            });
        } else {
            setEditingPromo(null);
            setFormData(emptyFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPromo(null);
        setFormData(emptyFormState);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;

        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const promoData = {
            ...formData,
            discountValue: Number(formData.discountValue),
            usageCount: editingPromo ? editingPromo.usageCount : 0
        };

        if (editingPromo) {
            const result = await updatePromoCode(editingPromo.id, promoData);
            if (result) {
                setPromoCodes(prev => prev.map(p => 
                    p.id === editingPromo.id ? result : p
                ));
                showNotification(`Kode promo ${formData.code} berhasil diperbarui.`);
            }
        } else {
            const result = await createPromoCode(promoData);
            if (result) {
                setPromoCodes(prev => [...prev, result]);
                showNotification(`Kode promo ${formData.code} berhasil ditambahkan.`);
            }
        }

        setIsModalOpen(false);
        setEditingPromo(null);
        setFormData(emptyFormState);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kode promo ini?')) {
            await deletePromoCode(id);
            setPromoCodes(prev => prev.filter(p => p.id !== id));
            showNotification('Kode promo berhasil dihapus.');
        }
    };

    const handleToggleActive = async (id: string) => {
        const promo = promoCodes.find(p => p.id === id);
        if (!promo) return;

        const updatedPromo = { ...promo, isActive: !promo.isActive };
        const result = await updatePromoCode(id, updatedPromo);

        if (result) {
            setPromoCodes(prev => prev.map(p => 
                p.id === id ? result : p
            ));
            showNotification(`Kode promo ${promo.code} ${promo.isActive ? 'dinonaktifkan' : 'diaktifkan'}.`);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Manajemen Kode Promo" subtitle="Buat dan kelola kode diskon untuk klien Anda.">
                <button onClick={() => handleOpenModal('add')} className="button-primary inline-flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    Buat Kode Baru
                </button>
            </PageHeader>

            {isLoading && <p>Loading promo codes...</p>}
            {error && <p className="text-red-500">Error loading promo codes: {error.message}</p>}

            {!isLoading && !error && (
                <div className="bg-brand-surface p-4 rounded-xl shadow-lg border border-brand-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-brand-text-secondary uppercase">
                                <tr>
                                    <th className="px-4 py-3">Kode</th>
                                    <th className="px-4 py-3">Diskon</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Penggunaan</th>
                                    <th className="px-4 py-3">Kadaluwarsa</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                                {promoCodes.map(code => (
                                    <tr key={code.id} className="hover:bg-brand-bg">
                                        <td className="px-4 py-3 font-semibold text-brand-text-light">{code.code}</td>
                                        <td className="px-4 py-3">
                                            {code.discountType === 'percentage'
                                                ? `${code.discountValue}%`
                                                : formatCurrency(code.discountValue)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${code.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {code.isActive ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{code.usageCount} / {code.maxUsage ?? '∞'}</td>
                                        <td className="px-4 py-3">{code.expiryDate ? new Date(code.expiryDate).toLocaleDateString('id-ID') : 'Tidak ada'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button onClick={() => handleOpenModal('edit', code)} className="p-2 text-brand-text-secondary hover:bg-brand-input rounded-full" title="Edit"><PencilIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(code.id)} className="p-2 text-brand-text-secondary hover:bg-brand-input rounded-full" title="Hapus"><Trash2Icon className="w-5 h-5" /></button>
                                                <button onClick={() => handleToggleActive(code.id)} className="p-2 text-brand-text-secondary hover:bg-brand-input rounded-full" title={code.isActive ? "Nonaktifkan" : "Aktifkan"}>
                                                    {code.isActive ? <ToggleLeftIcon className="w-5 h-5 text-green-500" /> : <ToggleRightIcon className="w-5 h-5 text-red-500" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={modalMode === 'add' ? 'Buat Kode Promo Baru' : 'Edit Kode Promo'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-group">
                            <input type="text" id="code" name="code" value={formData.code} onChange={handleFormChange} className="input-field" placeholder=" " required />
                            <label htmlFor="code" className="input-label">Kode Promo</label>
                        </div>
                        <div className="input-group">
                            <select id="discountType" name="discountType" value={formData.discountType} onChange={handleFormChange} className="input-field">
                                <option value="percentage">Persentase</option>
                                <option value="fixed">Nominal Tetap</option>
                            </select>
                            <label htmlFor="discountType" className="input-label">Jenis Diskon</label>
                        </div>
                    </div>
                    <div className="input-group">
                        <input type="number" id="discountValue" name="discountValue" value={formData.discountValue} onChange={handleFormChange} className="input-field" placeholder=" " required />
                        <label htmlFor="discountValue" className="input-label">{formData.discountType === 'percentage' ? 'Nilai Persentase (%)' : 'Jumlah Diskon (IDR)'}</label>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-group">
                            <input type="number" id="maxUsage" name="maxUsage" value={formData.maxUsage} onChange={handleFormChange} className="input-field" placeholder=" " />
                            <label htmlFor="maxUsage" className="input-label">Maks. Penggunaan (kosongkan = ∞)</label>
                        </div>
                         <div className="input-group">
                            <input type="date" id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleFormChange} className="input-field" placeholder=" " />
                            <label htmlFor="expiryDate" className="input-label">Tanggal Kadaluwarsa (kosongkan = ∞)</label>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 pt-2">
                        <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleFormChange} className="h-4 w-4 rounded" />
                        <label htmlFor="isActive" className="text-sm font-medium">Aktifkan Kode Promo</label>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-brand-border">
                        <button type="button" onClick={handleCloseModal} className="button-secondary">Batal</button>
                        <button type="submit" className="button-primary">{modalMode === 'add' ? 'Simpan' : 'Update'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PromoCodes;