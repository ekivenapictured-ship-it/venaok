
import React, { useState, useMemo } from 'react';
import { Project, Client, Transaction, TransactionType } from '../types';
import PageHeader from './PageHeader';
import StatCard from './StatCard';
import { BarChart2Icon, TrendingUpIcon, UserIcon, CalendarIcon, DownloadIcon } from '../constants';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const downloadCSV = (headers: string[], data: (string | number)[][], filename: string) => {
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            row.map(field => {
                const str = String(field);
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            }).join(',')
        )
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

interface ClientReportsProps {
    clients: Client[];
    projects: Project[];
    transactions: Transaction[];
    showNotification: (message: string) => void;
}

const ClientReports: React.FC<ClientReportsProps> = ({ clients, projects, transactions, showNotification }) => {
    const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year' | 'all'>('month');
    const [selectedClient, setSelectedClient] = useState<string>('all');
    const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary');

    const filteredData = useMemo(() => {
        let filteredProjects = projects;
        let filteredTransactions = transactions;

        // Filter by period
        if (selectedPeriod !== 'all') {
            const now = new Date();
            const startDate = selectedPeriod === 'month' 
                ? new Date(now.getFullYear(), now.getMonth(), 1)
                : new Date(now.getFullYear(), 0, 1);

            filteredProjects = projects.filter(p => new Date(p.date) >= startDate);
            filteredTransactions = transactions.filter(t => new Date(t.date) >= startDate);
        }

        // Filter by client
        if (selectedClient !== 'all') {
            filteredProjects = filteredProjects.filter(p => p.clientId === selectedClient);
            const projectIds = filteredProjects.map(p => p.id);
            filteredTransactions = filteredTransactions.filter(t => t.projectId && projectIds.includes(t.projectId));
        }

        return { filteredProjects, filteredTransactions };
    }, [projects, transactions, selectedPeriod, selectedClient]);

    const reportStats = useMemo(() => {
        const { filteredProjects, filteredTransactions } = filteredData;
        
        const totalRevenue = filteredTransactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalProjects = filteredProjects.length;
        const completedProjects = filteredProjects.filter(p => p.status === 'Selesai').length;
        const activeClients = new Set(filteredProjects.map(p => p.clientId)).size;

        return { totalRevenue, totalProjects, completedProjects, activeClients };
    }, [filteredData]);

    const clientPerformance = useMemo(() => {
        const { filteredProjects, filteredTransactions } = filteredData;
        
        const clientData = clients.map(client => {
            const clientProjects = filteredProjects.filter(p => p.clientId === client.id);
            const clientTransactions = filteredTransactions.filter(t => 
                t.projectId && clientProjects.some(p => p.id === t.projectId)
            );
            
            const totalRevenue = clientTransactions
                .filter(t => t.type === TransactionType.INCOME)
                .reduce((sum, t) => sum + t.amount, 0);
            
            const totalProjects = clientProjects.length;
            const completedProjects = clientProjects.filter(p => p.status === 'Selesai').length;
            const averageProjectValue = totalProjects > 0 ? totalRevenue / totalProjects : 0;

            return {
                ...client,
                totalRevenue,
                totalProjects,
                completedProjects,
                averageProjectValue,
                completionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
            };
        }).filter(c => c.totalProjects > 0).sort((a, b) => b.totalRevenue - a.totalRevenue);

        return clientData;
    }, [clients, filteredData]);

    const handleExportReport = () => {
        if (reportType === 'summary') {
            const headers = ['Nama Klien', 'Total Proyek', 'Proyek Selesai', 'Total Revenue', 'Rata-rata Nilai Proyek', 'Completion Rate (%)'];
            const data = clientPerformance.map(client => [
                client.name,
                client.totalProjects,
                client.completedProjects,
                client.totalRevenue,
                client.averageProjectValue,
                Math.round(client.completionRate)
            ]);
            downloadCSV(headers, data, `laporan-klien-${selectedPeriod}-${Date.now()}.csv`);
        } else {
            const headers = ['Nama Klien', 'Nama Proyek', 'Tanggal', 'Status', 'Total Biaya', 'Dibayar', 'Lokasi'];
            const data = filteredData.filteredProjects.map(project => {
                const client = clients.find(c => c.id === project.clientId);
                return [
                    client?.name || 'N/A',
                    project.projectName,
                    new Date(project.date).toLocaleDateString('id-ID'),
                    project.status,
                    project.totalCost,
                    project.amountPaid,
                    project.location
                ];
            });
            downloadCSV(headers, data, `laporan-detail-klien-${selectedPeriod}-${Date.now()}.csv`);
        }
        showNotification('Laporan berhasil diunduh!');
    };

    return (
        <div className="space-y-8">
            <PageHeader title="Laporan Klien" subtitle="Analisis kinerja dan statistik klien Anda.">
                <button 
                    onClick={handleExportReport}
                    className="button-primary inline-flex items-center gap-2"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Export Laporan
                </button>
            </PageHeader>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-lg font-semibold mb-4">Filter Laporan</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value as 'month' | 'year' | 'all')}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="month">Bulan Ini</option>
                            <option value="year">Tahun Ini</option>
                            <option value="all">Semua Waktu</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Klien</label>
                        <select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Semua Klien</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Laporan</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value as 'summary' | 'detailed')}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="summary">Ringkasan</option>
                            <option value="detailed">Detail</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<TrendingUpIcon className="w-6 h-6" />} 
                    title="Total Revenue" 
                    value={formatCurrency(reportStats.totalRevenue)}
                    iconBgColor="bg-green-500/20"
                    iconColor="text-green-400"
                />
                <StatCard 
                    icon={<BarChart2Icon className="w-6 h-6" />} 
                    title="Total Proyek" 
                    value={reportStats.totalProjects.toString()}
                    iconBgColor="bg-blue-500/20"
                    iconColor="text-blue-400"
                />
                <StatCard 
                    icon={<CalendarIcon className="w-6 h-6" />} 
                    title="Proyek Selesai" 
                    value={reportStats.completedProjects.toString()}
                    iconBgColor="bg-purple-500/20"
                    iconColor="text-purple-400"
                />
                <StatCard 
                    icon={<UserIcon className="w-6 h-6" />} 
                    title="Klien Aktif" 
                    value={reportStats.activeClients.toString()}
                    iconBgColor="bg-orange-500/20"
                    iconColor="text-orange-400"
                />
            </div>

            {/* Client Performance Table */}
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-bold">Kinerja Klien</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-medium">Nama Klien</th>
                                <th className="px-6 py-4 font-medium">Total Proyek</th>
                                <th className="px-6 py-4 font-medium">Proyek Selesai</th>
                                <th className="px-6 py-4 font-medium">Total Revenue</th>
                                <th className="px-6 py-4 font-medium">Rata-rata/Proyek</th>
                                <th className="px-6 py-4 font-medium">Completion Rate</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {clientPerformance.map((client, index) => (
                                <tr key={client.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                                    <td className="px-6 py-4">{client.totalProjects}</td>
                                    <td className="px-6 py-4">{client.completedProjects}</td>
                                    <td className="px-6 py-4 font-semibold text-green-600">
                                        {formatCurrency(client.totalRevenue)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatCurrency(client.averageProjectValue)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full" 
                                                    style={{ width: `${client.completionRate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {Math.round(client.completionRate)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            client.status === 'ACTIVE' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {clientPerformance.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Tidak ada data untuk periode dan filter yang dipilih.
                    </div>
                )}
            </div>

            {/* Detailed Projects View */}
            {reportType === 'detailed' && (
                <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold">Detail Proyek</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Klien</th>
                                    <th className="px-6 py-4 font-medium">Proyek</th>
                                    <th className="px-6 py-4 font-medium">Tanggal</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Total Biaya</th>
                                    <th className="px-6 py-4 font-medium">Dibayar</th>
                                    <th className="px-6 py-4 font-medium">Sisa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredData.filteredProjects.map((project) => {
                                    const client = clients.find(c => c.id === project.clientId);
                                    return (
                                        <tr key={project.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{client?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">{project.projectName}</td>
                                            <td className="px-6 py-4">{new Date(project.date).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    project.status === 'Selesai' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : project.status === 'Dalam Proses'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold">{formatCurrency(project.totalCost)}</td>
                                            <td className="px-6 py-4 text-green-600">{formatCurrency(project.amountPaid)}</td>
                                            <td className="px-6 py-4 text-red-600">{formatCurrency(project.totalCost - project.amountPaid)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientReports;
