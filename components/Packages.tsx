import React, { useState, useEffect } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { Package, AddOn, Profile } from '../types';
import PageHeader from './PageHeader';
import Modal from './Modal';
import { PlusIcon, PencilIcon, Trash2Icon, EyeIcon } from '../constants';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const emptyPackageForm = {
    name: '',
    price: '',
    processingTime: '',
    photographers: '',
    videographers: '',
    physicalItems: [{ name: '', price: '' }],
    digitalItems: [''],
};
const emptyAddOnForm = { name: '', price: '' };

interface PackagesProps {
    packages: Package[];
    setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
    addOns: AddOn[];
    setAddOns: React.Dispatch<React.SetStateAction<AddOn[]>>;
    userProfile: Profile;
    showNotification: (message: string) => void;
}

const Packages: React.FC<PackagesProps> = ({ packages, setPackages, addOns, setAddOns, userProfile, showNotification }) => {
    const { 
        getPackages, createPackage, updatePackage, deletePackage,
        getAddons, createAddon, updateAddon, deleteAddon,
        isLoading, error 
    } = useDatabase();

    const [packageFormData, setPackageFormData] = useState(emptyPackageForm);
    const [packageEditMode, setPackageEditMode] = useState<string | null>(null);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

    const [addOnFormData, setAddOnFormData] = useState(emptyAddOnForm);
    const [addOnEditMode, setAddOnEditMode] = useState<string | null>(null);
    const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null);
    const [isAddOnModalOpen, setIsAddOnModalOpen] = useState(false);

    useEffect(() => {
        loadPackagesData();
    }, []);

    const loadPackagesData = async () => {
        try {
            const [packagesData, addonsData] = await Promise.all([
                getPackages(),
                getAddons()
            ]);

            if (packagesData) setPackages(packagesData);
            if (addonsData) setAddOns(addonsData);
        } catch (err) {
            console.error("Failed to load packages data:", err);
        }
    };

    const resetPackageForm = () => {
        setPackageFormData(emptyPackageForm);
        setEditingPackage(null);
        setPackageEditMode(null);
    };

    const resetAddOnForm = () => {
        setAddOnFormData(emptyAddOnForm);
        setEditingAddOn(null);
        setAddOnEditMode(null);
    };

  // --- Package Handlers ---
  const handlePackageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPackageFormData(prev => ({...prev, [name]: value}));
  };

  const handlePhysicalItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const list = [...packageFormData.physicalItems];
    list[index] = { ...list[index], [name]: value };
    setPackageFormData(prev => ({ ...prev, physicalItems: list }));
  };

  const addPhysicalItem = () => {
    setPackageFormData(prev => ({ ...prev, physicalItems: [...prev.physicalItems, { name: '', price: '' }] }));
  };

  const removePhysicalItem = (index: number) => {
    const list = [...packageFormData.physicalItems];
    list.splice(index, 1);
    setPackageFormData(prev => ({ ...prev, physicalItems: list }));
  };

  const handleDigitalItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const list = [...packageFormData.digitalItems];
    list[index] = value;
    setPackageFormData(prev => ({ ...prev, digitalItems: list }));
  };

  const addDigitalItem = () => {
    setPackageFormData(prev => ({ ...prev, digitalItems: [...prev.digitalItems, ''] }));
  };

  const removeDigitalItem = (index: number) => {
    const list = [...packageFormData.digitalItems];
    list.splice(index, 1);
    setPackageFormData(prev => ({ ...prev, digitalItems: list }));
  };


  const handlePackageCancelEdit = () => {
    resetPackageForm();
    setIsPackageModalOpen(false);
  }

  const handlePackageEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setPackageFormData({
        name: pkg.name,
        price: pkg.price.toString(),
        processingTime: pkg.processingTime,
        photographers: pkg.photographers || '',
        videographers: pkg.videographers || '',
        physicalItems: pkg.physicalItems.length > 0 ? pkg.physicalItems.map(item => ({...item, price: item.price.toString()})) : [{ name: '', price: '' }],
        digitalItems: pkg.digitalItems.length > 0 ? pkg.digitalItems : [''],
    });
    setIsPackageModalOpen(true);
  }

  const handleDeletePackage = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
            await deletePackage(id);
            setPackages(prev => prev.filter(p => p.id !== id));
            showNotification('Paket berhasil dihapus.');
        }
    };

  const handleSubmitPackage = async (e: React.FormEvent) => {
        e.preventDefault();

        const packageData = {
            ...packageForm,
            price: Number(packageForm.price)
        };

        if (editingPackage) {
            const result = await updatePackage(editingPackage.id, packageData);
            if (result) {
                setPackages(prev => prev.map(p => 
                    p.id === editingPackage.id ? result : p
                ));
                showNotification(`Paket ${packageForm.name} berhasil diperbarui.`);
            }
        } else {
            const result = await createPackage(packageData);
            if (result) {
                setPackages(prev => [...prev, result]);
                showNotification(`Paket ${packageForm.name} berhasil ditambahkan.`);
            }
        }

        setIsPackageModalOpen(false);
        resetPackageForm();
    };

  // --- AddOn Handlers ---
  const handleAddOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddOnFormData(prev => ({...prev, [name]: value}));
  };

  const handleAddOnCancelEdit = () => {
    resetAddOnForm();
    setIsAddOnModalOpen(false);
  }

  const handleAddOnEdit = (addOn: AddOn) => {
    setEditingAddOn(addOn);
    setAddOnFormData({
        name: addOn.name,
        price: addOn.price.toString(),
    });
    setIsAddOnModalOpen(true);
  }

  const handleDeleteAddOn = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus add-on ini?')) {
            await deleteAddon(id);
            setAddOns(prev => prev.filter(a => a.id !== id));
            showNotification('Add-on berhasil dihapus.');
        }
    };

  const handleSubmitAddOn = async (e: React.FormEvent) => {
        e.preventDefault();

        const addonData = {
            ...addOnForm,
            price: Number(addOnForm.price)
        };

        if (editingAddOn) {
            const result = await updateAddon(editingAddOn.id, addonData);
            if (result) {
                setAddOns(prev => prev.map(a => 
                    a.id === editingAddOn.id ? result : a
                ));
                showNotification(`Add-on ${addOnForm.name} berhasil diperbarui.`);
            }
        } else {
            const result = await createAddon(addonData);
            if (result) {
                setAddOns(prev => [...prev, result]);
                showNotification(`Add-on ${addOnForm.name} berhasil ditambahkan.`);
            }
        }

        setIsAddOnModalOpen(false);
        resetAddOnForm();
    };


  return (
    <div>
      <PageHeader title="Manajemen Paket & Add-On" subtitle="Kelola paket layanan dan item tambahan untuk klien Anda." />
      <div className="grid lg:grid-cols-5 gap-8 items-start">

        {/* === Left Column: PACKAGES FORM === */}
        <div className="lg:col-span-2 bg-brand-surface p-6 rounded-2xl space-y-6 lg:sticky lg:top-8">
            <h3 className="text-xl font-semibold text-brand-text-light border-b border-gray-700/50 pb-4">{editingPackage ? 'Edit Paket' : 'Tambah Paket Baru'}</h3>
            <form className="space-y-4" onSubmit={handleSubmitPackage}>
                <div className="input-group"><input type="text" name="name" value={packageFormData.name} onChange={handlePackageInputChange} className="input-field" placeholder=" " required/><label className="input-label">Nama Paket</label></div>
                <div className="input-group"><input type="number" name="price" value={packageFormData.price} onChange={handlePackageInputChange} className="input-field" placeholder=" " required/><label className="input-label">Harga Paket (IDR)</label></div>
                <div className="input-group"><input type="text" name="processingTime" value={packageFormData.processingTime} onChange={handlePackageInputChange} className="input-field" placeholder=" " required/><label className="input-label">Estimasi Pengerjaan</label></div>
                <div className="input-group"><input type="text" name="photographers" value={packageFormData.photographers} onChange={handlePackageInputChange} className="input-field" placeholder=" "/><label className="input-label">Fotografer (e.g., 2 Fotografer)</label></div>
                <div className="input-group"><input type="text" name="videographers" value={packageFormData.videographers} onChange={handlePackageInputChange} className="input-field" placeholder=" "/><label className="input-label">Videografer (e.g., 1 Videografer)</label></div>

                {/* Physical Items */}
                <div>
                    <label className="text-sm font-medium text-brand-text-secondary">Output Fisik</label>
                    <div className="space-y-2 mt-2">
                        {packageFormData.physicalItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" name="name" value={item.name} onChange={(e) => handlePhysicalItemChange(index, e)} placeholder="Nama Item" className="input-field !p-2 !text-sm flex-grow" />
                                <input type="number" name="price" value={item.price} onChange={(e) => handlePhysicalItemChange(index, e)} placeholder="Harga" className="input-field !p-2 !text-sm w-28" />
                                <button type="button" onClick={() => removePhysicalItem(index)} className="p-2 text-brand-danger hover:bg-brand-danger/10 rounded-full"><Trash2Icon className="w-4 h-4"/></button>
                            </div>
                        ))}
                        <button type="button" onClick={addPhysicalItem} className="text-sm font-semibold text-brand-accent hover:underline">+ Tambah Item</button>
                    </div>
                </div>

                {/* Digital Items */}
                <div>
                    <label className="text-sm font-medium text-brand-text-secondary">Output Digital</label>
                    <div className="space-y-2 mt-2">
                        {packageFormData.digitalItems.map((item, index) => (
                             <div key={index} className="flex items-center gap-2">
                                <input type="text" value={item} onChange={(e) => handleDigitalItemChange(index, e)} placeholder="Deskripsi Item" className="input-field !p-2 !text-sm flex-grow" />
                                <button type="button" onClick={() => removeDigitalItem(index)} className="p-2 text-brand-danger hover:bg-brand-danger/10 rounded-full"><Trash2Icon className="w-4 h-4"/></button>
                            </div>
                        ))}
                        <button type="button" onClick={addDigitalItem} className="text-sm font-semibold text-brand-accent hover:underline">+ Tambah Item</button>
                    </div>
                </div>

                <div className="text-right space-x-2 pt-2">
                    {editingPackage && (<button type="button" onClick={handlePackageCancelEdit} className="button-secondary">Batal</button>)}
                    <button type="submit" className="button-primary">{editingPackage ? 'Update Paket' : 'Simpan Paket'}</button>
                </div>
            </form>
        </div>

        {/* === Right Column: PACKAGES LIST & ADDONS === */}
        <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-brand-text-light border-b border-gray-700/50 pb-4 flex justify-between items-center">
                    Daftar Paket
                    <button onClick={() => setIsPackageModalOpen(true)} className="button-primary text-sm !py-2 !px-4 flex items-center gap-1">
                        <PlusIcon className="w-4 h-4"/> Tambah Paket
                    </button>
                </h3>
                {packages.map(pkg => (
                    <div key={pkg.id} className="p-4 bg-brand-surface rounded-xl shadow-lg border border-brand-border">
                        <div className="flex justify-between items-start">
                            <div>
                                <h5 className="font-bold text-brand-text-light">{pkg.name}</h5>
                                <p className="text-sm text-brand-text-secondary mt-1">Estimasi Pengerjaan: {pkg.processingTime}</p>
                            </div>
                            <div className="text-right ml-4 flex-shrink-0">
                                <p className="text-lg font-semibold text-brand-text-light whitespace-nowrap">{formatCurrency(pkg.price)}</p>
                                <div className="flex items-center justify-end space-x-2 mt-2">
                                    <button type="button" onClick={() => handlePackageEdit(pkg)} className="p-1 text-brand-text-secondary hover:text-brand-accent" title="Edit"><PencilIcon className="w-4 h-4"/></button>
                                    <button type="button" onClick={() => handleDeletePackage(pkg.id)} className="p-1 text-brand-text-secondary hover:text-brand-danger" title="Hapus"><Trash2Icon className="w-4 h-4"/></button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t border-brand-border/50">
                            <div>
                                <h6 className="font-semibold text-sm text-brand-text-primary mb-2">Tim yang Termasuk</h6>
                                <ul className="space-y-1 text-xs text-brand-text-secondary">
                                    {pkg.photographers && <li>• {pkg.photographers}</li>}
                                    {pkg.videographers && <li>• {pkg.videographers}</li>}
                                    {(!pkg.photographers && !pkg.videographers) && <p className="italic">Tidak ada detail tim.</p>}
                                </ul>
                            </div>
                            <div>
                                <h6 className="font-semibold text-sm text-brand-text-primary mb-2">Output Fisik</h6>
                                {pkg.physicalItems.length > 0 ? (
                                    <ul className="space-y-1 text-xs text-brand-text-secondary">
                                        {pkg.physicalItems.map((item, index) => (
                                            <li key={index} className="flex justify-between">
                                                <span>• {item.name}</span>
                                                <span className="font-medium text-brand-text-primary/80">{formatCurrency(item.price)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-xs text-brand-text-secondary italic">Tidak ada.</p>}
                            </div>
                            <div>
                                <h6 className="font-semibold text-sm text-brand-text-primary mb-2">Output Digital</h6>
                                {pkg.digitalItems.length > 0 ? (
                                    <ul className="space-y-1 text-xs list-disc list-inside text-brand-text-secondary">
                                        {pkg.digitalItems.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                 ) : <p className="text-xs text-brand-text-secondary italic">Tidak ada.</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-brand-surface p-6 rounded-2xl space-y-6">
                <h3 className="text-xl font-semibold text-brand-text-light border-b border-gray-700/50 pb-4 flex justify-between items-center">
                    Daftar Add-On
                    <button onClick={() => setIsAddOnModalOpen(true)} className="button-primary text-sm !py-2 !px-4 flex items-center gap-1">
                        <PlusIcon className="w-4 h-4"/> Tambah Add-On
                    </button>
                </h3>
                <div className="space-y-3 pt-4">
                    {addOns.map(addOn => (<div key={addOn.id} className="p-3 bg-brand-bg rounded-xl flex justify-between items-center">
                        <p className="font-medium text-brand-text-light">{addOn.name}</p>
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-semibold text-brand-text-primary">{formatCurrency(addOn.price)}</p>
                            <div className="flex items-center space-x-2">
                                <button type="button" onClick={() => handleAddOnEdit(addOn)} className="p-1 text-brand-text-secondary hover:text-brand-accent" title="Edit"><PencilIcon className="w-4 h-4"/></button>
                                <button type="button" onClick={() => handleDeleteAddOn(addOn.id)} className="p-1 text-brand-text-secondary hover:text-brand-danger" title="Hapus"><Trash2Icon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    </div>))}
                </div>
            </div>
        </div>
      </div>

        {/* Package Modal */}
        <Modal isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} title={`${editingPackage ? 'Edit' : 'Tambah'} Paket`}>
            <form className="space-y-4" onSubmit={handleSubmitPackage}>
                <div className="input-group"><input type="text" name="name" value={packageFormData.name} onChange={handlePackageInputChange} className="input-field" placeholder=" " required/><label className="input-label">Nama Paket</label></div>
                <div className="input-group"><input type="number" name="price" value={packageFormData.price} onChange={handlePackageInputChange} className="input-field" placeholder=" " required/><label className="input-label">Harga Paket (IDR)</label></div>
                <div className="input-group"><input type="text" name="processingTime" value={packageFormData.processingTime} onChange={handlePackageInputChange} className="input-field" placeholder=" " required/><label className="input-label">Estimasi Pengerjaan</label></div>
                <div className="input-group"><input type="text" name="photographers" value={packageFormData.photographers} onChange={handlePackageInputChange} className="input-field" placeholder=" "/><label className="input-label">Fotografer (e.g., 2 Fotografer)</label></div>
                <div className="input-group"><input type="text" name="videographers" value={packageFormData.videographers} onChange={handlePackageInputChange} className="input-field" placeholder=" "/><label className="input-label">Videografer (e.g., 1 Videografer)</label></div>

                <div>
                    <label className="text-sm font-medium text-brand-text-secondary">Output Fisik</label>
                    <div className="space-y-2 mt-2">
                        {packageFormData.physicalItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" name="name" value={item.name} onChange={(e) => handlePhysicalItemChange(index, e)} placeholder="Nama Item" className="input-field !p-2 !text-sm flex-grow" />
                                <input type="number" name="price" value={item.price} onChange={(e) => handlePhysicalItemChange(index, e)} placeholder="Harga" className="input-field !p-2 !text-sm w-28" />
                                {packageFormData.physicalItems.length > 1 && (
                                    <button type="button" onClick={() => removePhysicalItem(index)} className="p-2 text-brand-danger hover:bg-brand-danger/10 rounded-full"><Trash2Icon className="w-4 h-4"/></button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addPhysicalItem} className="text-sm font-semibold text-brand-accent hover:underline">+ Tambah Item Fisik</button>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-brand-text-secondary">Output Digital</label>
                    <div className="space-y-2 mt-2">
                        {packageFormData.digitalItems.map((item, index) => (
                             <div key={index} className="flex items-center gap-2">
                                <input type="text" value={item} onChange={(e) => handleDigitalItemChange(index, e)} placeholder="Deskripsi Item" className="input-field !p-2 !text-sm flex-grow" />
                                {packageFormData.digitalItems.length > 1 && (
                                     <button type="button" onClick={() => removeDigitalItem(index)} className="p-2 text-brand-danger hover:bg-brand-danger/10 rounded-full"><Trash2Icon className="w-4 h-4"/></button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addDigitalItem} className="text-sm font-semibold text-brand-accent hover:underline">+ Tambah Item Digital</button>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={handlePackageCancelEdit} className="button-secondary">Batal</button>
                    <button type="submit" className="button-primary">{editingPackage ? 'Update Paket' : 'Simpan Paket'}</button>
                </div>
            </form>
        </Modal>

        {/* AddOn Modal */}
        <Modal isOpen={isAddOnModalOpen} onClose={() => setIsAddOnModalOpen(false)} title={`${editingAddOn ? 'Edit' : 'Tambah'} Add-On`}>
            <form className="space-y-4" onSubmit={handleSubmitAddOn}>
                <div className="input-group"><input type="text" name="name" value={addOnFormData.name} onChange={handleAddOnInputChange} className="input-field" placeholder=" " required/><label className="input-label">Nama Add-On</label></div>
                <div className="input-group"><input type="number" name="price" value={addOnFormData.price} onChange={handleAddOnInputChange} className="input-field" placeholder=" " required/><label className="input-label">Harga (IDR)</label></div>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={handleAddOnCancelEdit} className="button-secondary">Batal</button>
                    <button type="submit" className="button-primary">{editingAddOn ? 'Update Add-On' : 'Simpan Add-On'}</button>
                </div>
            </form>
        </Modal>
    </div>
  );
};

export default Packages;