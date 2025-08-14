
import React, { useState, useMemo, useEffect } from 'react';
import { Client, Project, ClientFeedback, SatisfactionLevel, Transaction, Profile, Package, PaymentStatus } from '../types';
import { StarIcon, FileTextIcon, CreditCardIcon, CalendarIcon, CheckCircleIcon, AlertCircleIcon, PrinterIcon } from '../constants';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#FFF27A"/>
        <path d="M15.44 26L12 19.6667L15.44 13.3333H22.32L25.76 19.6667L22.32 26H15.44ZM17.18 23.8333H20.58L22.32 20.5833L20.58 17.3333H17.18L15.44 20.5833L17.18 23.8333Z" fill="#1E1E21"/>
    </svg>
);

interface PublicClientReportProps {
    clientId: string;
    clients: Client[];
    projects: Project[];
    transactions: Transaction[];
    feedback: ClientFeedback[];
    profile: Profile;
    packages: Package[];
}

const PublicClientReport: React.FC<PublicClientReportProps> = ({
    clientId,
    clients,
    projects,
    transactions,
    feedback,
    profile,
    packages
}) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.body.classList.add('portal-body');
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => {
            document.body.classList.remove('portal-body');
            clearTimeout(timer);
        };
    }, []);

    const client = useMemo(() => clients.find(c => c.id === clientId), [clients, clientId]);
    const clientProjects = useMemo(() => projects.filter(p => p.clientId === clientId), [projects, clientId]);
    const clientTransactions = useMemo(() => transactions.filter(t => t.clientId === clientId), [transactions, clientId]);
    const clientFeedback = useMemo(() => feedback.filter(f => f.clientName === client?.name), [feedback, client]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen portal-bg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-portal-text-secondary">Memuat laporan...</p>
                </div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="flex items-center justify-center min-h-screen portal-bg p-4">
                <div className="w-full max-w-lg p-8 text-center bg-portal-surface rounded-2xl shadow-lg">
                    <AlertCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-red-600">Laporan Tidak Ditemukan</h1>
                    <p className="mt-4 text-portal-text-primary">ID klien tidak valid atau laporan belum tersedia.</p>
                </div>
            </div>
        );
    }

    const summary = useMemo(() => {
        const totalProjects = clientProjects.length;
        const completedProjects = clientProjects.filter(p => p.status === 'Selesai').length;
        const totalValue = clientProjects.reduce((sum, p) => sum + p.totalCost, 0);
        const totalPaid = clientProjects.reduce((sum, p) => sum + p.amountPaid, 0);
        const avgRating = clientFeedback.length > 0 
            ? clientFeedback.reduce((sum, f) => sum + f.rating, 0) / clientFeedback.length 
            : 0;

        return {
            totalProjects,
            completedProjects,
            completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
            totalValue,
            totalPaid,
            outstanding: totalValue - totalPaid,
            avgRating
        };
    }, [clientProjects, clientFeedback]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="portal-bg min-h-screen py-8">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="bg-portal-surface rounded-2xl shadow-lg p-8 mb-6 non-printable">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Logo />
                            <div>
                                <h1 className="text-3xl font-bold text-gradient">Laporan Klien</h1>
                                <p className="text-portal-text-secondary">Ringkasan kinerja dan kerjasama</p>
                            </div>
                        </div>
                        <button onClick={handlePrint} className="button-primary inline-flex items-center gap-2">
                            <PrinterIcon className="w-5 h-5" />
                            Cetak Laporan
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div className="printable-content bg-white text-black">
                    <div className="bg-portal-surface rounded-2xl shadow-lg p-8 mb-6">
                        {/* Client Info */}
                        <div className="border-b border-portal-border pb-6 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-portal-text-primary mb-2">{client.name}</h2>
                                    <div className="space-y-1 text-sm text-portal-text-secondary">
                                        <p>📧 {client.email}</p>
                                        <p>📱 {client.phone}</p>
                                        {client.address && <p>📍 {client.address}</p>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-portal-text-secondary">Laporan dibuat pada</p>
                                    <p className="font-semibold">{formatDate(new Date().toISOString())}</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200">
                                <p className="text-2xl font-bold text-blue-600">{summary.totalProjects}</p>
                                <p className="text-sm text-blue-600 font-medium">Total Proyek</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
                                <p className="text-2xl font-bold text-green-600">{summary.completionRate}%</p>
                                <p className="text-sm text-green-600 font-medium">Tingkat Selesai</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-200">
                                <p className="text-2xl font-bold text-purple-600">{formatCurrency(summary.totalValue)}</p>
                                <p className="text-sm text-purple-600 font-medium">Total Nilai</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-200">
                                <div className="flex items-center justify-center gap-1">
                                    <StarIcon className="w-5 h-5 text-yellow-500 fill-current" />
                                    <p className="text-2xl font-bold text-yellow-600">{summary.avgRating.toFixed(1)}</p>
                                </div>
                                <p className="text-sm text-yellow-600 font-medium">Rata-rata Rating</p>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-slate-50 p-6 rounded-xl mb-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Ringkasan Keuangan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-slate-600">Total Kontrak</p>
                                    <p className="text-xl font-bold text-slate-800">{formatCurrency(summary.totalValue)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-600">Sudah Dibayar</p>
                                    <p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalPaid)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-600">Outstanding</p>
                                    <p className="text-xl font-bold text-red-600">{formatCurrency(summary.outstanding)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Project History */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-portal-text-primary mb-4">Riwayat Proyek</h3>
                            <div className="space-y-4">
                                {clientProjects.map(project => {
                                    const pkg = packages.find(p => p.id === project.packageId);
                                    return (
                                        <div key={project.id} className="border border-portal-border rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-portal-text-primary">{project.projectName}</h4>
                                                    <p className="text-sm text-portal-text-secondary">{formatDate(project.date)} • {project.location}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        project.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-portal-text-secondary">Paket:</p>
                                                    <p className="font-medium">{pkg?.name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-portal-text-secondary">Nilai Kontrak:</p>
                                                    <p className="font-medium">{formatCurrency(project.totalCost)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-portal-text-secondary">Status Pembayaran:</p>
                                                    <p className={`font-medium ${
                                                        project.paymentStatus === PaymentStatus.LUNAS ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {project.paymentStatus}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Client Feedback */}
                        {clientFeedback.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-portal-text-primary mb-4">Masukan & Testimoni</h3>
                                <div className="space-y-4">
                                    {clientFeedback.map(fb => (
                                        <div key={fb.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <StarIcon
                                                            key={star}
                                                            className={`w-4 h-4 ${
                                                                star <= fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-500">{formatDate(fb.date)}</p>
                                            </div>
                                            <p className="text-sm text-slate-700 italic">"{fb.feedback}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="border-t border-portal-border pt-6 text-center text-sm text-portal-text-secondary">
                            <p>Laporan ini dibuat secara otomatis oleh sistem {profile.companyName}</p>
                            <p>Untuk pertanyaan, hubungi: {profile.phone} | {profile.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicClientReport;
