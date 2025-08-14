
import React, { useState, useEffect } from 'react';
import { SocialMediaPost, Project, SocialPlatform, PostStatus, PostType } from '../types';
import PageHeader from './PageHeader';
import Modal from './Modal';
import { PlusIcon, PencilIcon, Trash2Icon, CalendarIcon, EyeIcon, InstagramIcon, FacebookIcon, TwitterIcon, TikTokIcon, YoutubeIcon, LinkedinIcon } from '../constants';

interface SocialPlannerProps {
    socialMediaPosts: SocialMediaPost[];
    setSocialMediaPosts: React.Dispatch<React.SetStateAction<SocialMediaPost[]>>;
    projects: Project[];
    database: any;
    refreshData: () => Promise<void>;
}

const SocialPlanner: React.FC<SocialPlannerProps> = ({
    socialMediaPosts,
    setSocialMediaPosts,
    projects,
    database,
    refreshData
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [selectedPost, setSelectedPost] = useState<SocialMediaPost | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<PostStatus | 'ALL'>('ALL');
    const [filterPlatform, setFilterPlatform] = useState<SocialPlatform | 'ALL'>('ALL');

    const [formData, setFormData] = useState<Omit<SocialMediaPost, 'id'>>({
        projectId: '',
        clientName: '',
        postType: PostType.CONTENT,
        platform: SocialPlatform.INSTAGRAM,
        scheduledDate: '',
        caption: '',
        mediaUrl: '',
        status: PostStatus.DRAFT,
        notes: ''
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const resetForm = () => {
        setFormData({
            projectId: '',
            clientName: '',
            postType: PostType.CONTENT,
            platform: SocialPlatform.INSTAGRAM,
            scheduledDate: '',
            caption: '',
            mediaUrl: '',
            status: PostStatus.DRAFT,
            notes: ''
        });
        setFormErrors({});
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.clientName.trim()) {
            errors.clientName = 'Nama klien wajib diisi';
        }
        if (!formData.scheduledDate) {
            errors.scheduledDate = 'Tanggal wajib diisi';
        }
        if (!formData.caption.trim()) {
            errors.caption = 'Caption wajib diisi';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleOpenModal = (mode: 'add' | 'edit' | 'view', post: SocialMediaPost | null = null) => {
        setModalMode(mode);
        setSelectedPost(post);
        
        if (mode === 'edit' && post) {
            setFormData({
                projectId: post.projectId || '',
                clientName: post.clientName,
                postType: post.postType,
                platform: post.platform,
                scheduledDate: post.scheduledDate,
                caption: post.caption || '',
                mediaUrl: post.mediaUrl || '',
                status: post.status,
                notes: post.notes || ''
            });
        } else if (mode === 'add') {
            resetForm();
        }
        
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Auto-fill client name when project is selected
        if (name === 'projectId' && value) {
            const selectedProject = projects.find(p => p.id === value);
            if (selectedProject) {
                setFormData(prev => ({ ...prev, clientName: selectedProject.clientName }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (modalMode === 'add') {
                await database.createSocialMediaPost(formData);
            } else if (modalMode === 'edit' && selectedPost) {
                await database.updateSocialMediaPost(selectedPost.id, formData);
            }
            
            await refreshData();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving social media post:', error);
            alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus post ini?')) return;

        setIsLoading(true);
        try {
            await database.deleteSocialMediaPost(id);
            await refreshData();
        } catch (error) {
            console.error('Error deleting social media post:', error);
            alert('Terjadi kesalahan saat menghapus data. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: PostStatus) => {
        setIsLoading(true);
        try {
            await database.updateSocialMediaPost(id, { status: newStatus });
            await refreshData();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Terjadi kesalahan saat mengupdate status. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const getPlatformIcon = (platform: SocialPlatform) => {
        switch (platform) {
            case SocialPlatform.INSTAGRAM:
                return <InstagramIcon className="w-5 h-5 text-pink-500" />;
            case SocialPlatform.FACEBOOK:
                return <FacebookIcon className="w-5 h-5 text-blue-600" />;
            case SocialPlatform.TWITTER:
                return <TwitterIcon className="w-5 h-5 text-blue-400" />;
            case SocialPlatform.TIKTOK:
                return <TikTokIcon className="w-5 h-5 text-black" />;
            case SocialPlatform.YOUTUBE:
                return <YoutubeIcon className="w-5 h-5 text-red-600" />;
            case SocialPlatform.LINKEDIN:
                return <LinkedinIcon className="w-5 h-5 text-blue-700" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: PostStatus) => {
        switch (status) {
            case PostStatus.DRAFT:
                return 'bg-gray-500';
            case PostStatus.SCHEDULED:
                return 'bg-blue-500';
            case PostStatus.PUBLISHED:
                return 'bg-green-500';
            case PostStatus.CANCELLED:
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusLabel = (status: PostStatus) => {
        switch (status) {
            case PostStatus.DRAFT:
                return 'Draft';
            case PostStatus.SCHEDULED:
                return 'Terjadwal';
            case PostStatus.PUBLISHED:
                return 'Dipublikasi';
            case PostStatus.CANCELLED:
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    const getTypeLabel = (type: PostType) => {
        switch (type) {
            case PostType.CONTENT:
                return 'Konten';
            case PostType.TEASER:
                return 'Teaser';
            case PostType.BTS:
                return 'Behind The Scenes';
            case PostType.PORTFOLIO:
                return 'Portfolio';
            case PostType.TESTIMONY:
                return 'Testimoni';
            default:
                return type;
        }
    };

    // Filter posts
    const filteredPosts = socialMediaPosts.filter(post => {
        const statusMatch = filterStatus === 'ALL' || post.status === filterStatus;
        const platformMatch = filterPlatform === 'ALL' || post.platform === filterPlatform;
        return statusMatch && platformMatch;
    });

    // Group posts by date
    const groupedPosts = filteredPosts.reduce((groups: Record<string, SocialMediaPost[]>, post) => {
        const date = post.scheduledDate;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(post);
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedPosts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Perencana Media Sosial" 
                subtitle="Kelola dan jadwalkan konten media sosial untuk proyek Anda"
            />

            {/* Filters and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as PostStatus | 'ALL')}
                        className="input-field !mt-0 w-auto"
                        disabled={isLoading}
                    >
                        <option value="ALL">Semua Status</option>
                        <option value={PostStatus.DRAFT}>Draft</option>
                        <option value={PostStatus.SCHEDULED}>Terjadwal</option>
                        <option value={PostStatus.PUBLISHED}>Dipublikasi</option>
                        <option value={PostStatus.CANCELLED}>Dibatalkan</option>
                    </select>

                    <select
                        value={filterPlatform}
                        onChange={(e) => setFilterPlatform(e.target.value as SocialPlatform | 'ALL')}
                        className="input-field !mt-0 w-auto"
                        disabled={isLoading}
                    >
                        <option value="ALL">Semua Platform</option>
                        <option value={SocialPlatform.INSTAGRAM}>Instagram</option>
                        <option value={SocialPlatform.FACEBOOK}>Facebook</option>
                        <option value={SocialPlatform.TWITTER}>Twitter</option>
                        <option value={SocialPlatform.TIKTOK}>TikTok</option>
                        <option value={SocialPlatform.YOUTUBE}>YouTube</option>
                        <option value={SocialPlatform.LINKEDIN}>LinkedIn</option>
                    </select>
                </div>

                <button
                    onClick={() => handleOpenModal('add')}
                    disabled={isLoading}
                    className="button-primary inline-flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Tambah Post
                </button>
            </div>

            {/* Posts Timeline */}
            <div className="space-y-6">
                {sortedDates.length === 0 ? (
                    <div className="text-center py-12">
                        <CalendarIcon className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-brand-text-light mb-2">Belum ada konten terjadwal</h3>
                        <p className="text-brand-text-secondary">Mulai dengan menambahkan rencana konten media sosial pertama Anda</p>
                    </div>
                ) : (
                    sortedDates.map(date => (
                        <div key={date} className="bg-brand-surface rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <CalendarIcon className="w-5 h-5 text-brand-accent" />
                                <h3 className="text-lg font-semibold text-brand-text-light">
                                    {new Date(date).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </h3>
                                <span className="bg-brand-accent/20 text-brand-accent px-2 py-1 rounded-full text-xs">
                                    {groupedPosts[date].length} post
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedPosts[date].map(post => (
                                    <div key={post.id} className="bg-brand-bg border border-brand-border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                {getPlatformIcon(post.platform)}
                                                <span className="text-sm font-medium text-brand-text-primary">
                                                    {post.platform}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className={`w-2 h-2 rounded-full ${getStatusColor(post.status)}`}></span>
                                                <span className="text-xs text-brand-text-secondary">
                                                    {getStatusLabel(post.status)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            <h4 className="font-semibold text-brand-text-light line-clamp-1">
                                                {post.clientName}
                                            </h4>
                                            <p className="text-xs text-brand-text-secondary">
                                                {getTypeLabel(post.postType)}
                                            </p>
                                            {post.caption && (
                                                <p className="text-sm text-brand-text-primary line-clamp-3">
                                                    {post.caption}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal('view', post)}
                                                    className="p-1 text-brand-text-secondary hover:text-brand-accent"
                                                    title="Lihat Detail"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal('edit', post)}
                                                    disabled={isLoading}
                                                    className="p-1 text-brand-text-secondary hover:text-brand-accent"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    disabled={isLoading}
                                                    className="p-1 text-brand-text-secondary hover:text-brand-danger"
                                                    title="Hapus"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {post.status === PostStatus.DRAFT && (
                                                <button
                                                    onClick={() => handleStatusUpdate(post.id, PostStatus.SCHEDULED)}
                                                    disabled={isLoading}
                                                    className="text-xs bg-brand-accent text-white px-2 py-1 rounded hover:bg-brand-accent/80"
                                                >
                                                    Jadwalkan
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalMode === 'add' ? 'Tambah Post Baru' : modalMode === 'edit' ? 'Edit Post' : 'Detail Post'}
            >
                {modalMode === 'view' && selectedPost ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {getPlatformIcon(selectedPost.platform)}
                            <h3 className="text-lg font-semibold text-brand-text-light">
                                {selectedPost.clientName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(selectedPost.status)}`}>
                                {getStatusLabel(selectedPost.status)}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="font-medium text-brand-text-light">Platform:</label>
                                <p className="text-brand-text-primary">{selectedPost.platform}</p>
                            </div>
                            <div>
                                <label className="font-medium text-brand-text-light">Tipe:</label>
                                <p className="text-brand-text-primary">{getTypeLabel(selectedPost.postType)}</p>
                            </div>
                            <div>
                                <label className="font-medium text-brand-text-light">Tanggal:</label>
                                <p className="text-brand-text-primary">
                                    {new Date(selectedPost.scheduledDate).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        </div>

                        {selectedPost.caption && (
                            <div>
                                <label className="font-medium text-brand-text-light">Caption:</label>
                                <p className="text-brand-text-primary mt-1 whitespace-pre-wrap">
                                    {selectedPost.caption}
                                </p>
                            </div>
                        )}

                        {selectedPost.mediaUrl && (
                            <div>
                                <label className="font-medium text-brand-text-light">Media URL:</label>
                                <a 
                                    href={selectedPost.mediaUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-brand-accent hover:underline block mt-1"
                                >
                                    {selectedPost.mediaUrl}
                                </a>
                            </div>
                        )}

                        {selectedPost.notes && (
                            <div>
                                <label className="font-medium text-brand-text-light">Catatan:</label>
                                <p className="text-brand-text-primary mt-1 whitespace-pre-wrap">
                                    {selectedPost.notes}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="input-group">
                                <select
                                    name="projectId"
                                    value={formData.projectId}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="">Pilih Proyek (Opsional)</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>
                                            {project.projectName} - {project.clientName}
                                        </option>
                                    ))}
                                </select>
                                <label className="input-label">Proyek</label>
                            </div>

                            <div className="input-group">
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    className={`input-field ${formErrors.clientName ? 'border-red-500' : ''}`}
                                    placeholder=" "
                                    required
                                />
                                <label className="input-label">Nama Klien</label>
                                {formErrors.clientName && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.clientName}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="input-group">
                                <select
                                    name="platform"
                                    value={formData.platform}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                >
                                    <option value={SocialPlatform.INSTAGRAM}>Instagram</option>
                                    <option value={SocialPlatform.FACEBOOK}>Facebook</option>
                                    <option value={SocialPlatform.TWITTER}>Twitter</option>
                                    <option value={SocialPlatform.TIKTOK}>TikTok</option>
                                    <option value={SocialPlatform.YOUTUBE}>YouTube</option>
                                    <option value={SocialPlatform.LINKEDIN}>LinkedIn</option>
                                </select>
                                <label className="input-label">Platform</label>
                            </div>

                            <div className="input-group">
                                <select
                                    name="postType"
                                    value={formData.postType}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                >
                                    <option value={PostType.CONTENT}>Konten</option>
                                    <option value={PostType.TEASER}>Teaser</option>
                                    <option value={PostType.BTS}>Behind The Scenes</option>
                                    <option value={PostType.PORTFOLIO}>Portfolio</option>
                                    <option value={PostType.TESTIMONY}>Testimoni</option>
                                </select>
                                <label className="input-label">Tipe Post</label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="input-group">
                                <input
                                    type="date"
                                    name="scheduledDate"
                                    value={formData.scheduledDate}
                                    onChange={handleInputChange}
                                    className={`input-field ${formErrors.scheduledDate ? 'border-red-500' : ''}`}
                                    required
                                />
                                <label className="input-label">Tanggal</label>
                                {formErrors.scheduledDate && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.scheduledDate}</p>
                                )}
                            </div>

                            <div className="input-group">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                >
                                    <option value={PostStatus.DRAFT}>Draft</option>
                                    <option value={PostStatus.SCHEDULED}>Terjadwal</option>
                                    <option value={PostStatus.PUBLISHED}>Dipublikasi</option>
                                    <option value={PostStatus.CANCELLED}>Dibatalkan</option>
                                </select>
                                <label className="input-label">Status</label>
                            </div>
                        </div>

                        <div className="input-group">
                            <textarea
                                name="caption"
                                value={formData.caption}
                                onChange={handleInputChange}
                                className={`input-field ${formErrors.caption ? 'border-red-500' : ''}`}
                                rows={4}
                                placeholder=" "
                                required
                            />
                            <label className="input-label">Caption</label>
                            {formErrors.caption && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.caption}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <input
                                type="url"
                                name="mediaUrl"
                                value={formData.mediaUrl}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder=" "
                            />
                            <label className="input-label">URL Media (Opsional)</label>
                        </div>

                        <div className="input-group">
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="input-field"
                                rows={3}
                                placeholder=" "
                            />
                            <label className="input-label">Catatan (Opsional)</label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="button-secondary"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="button-primary"
                            >
                                {isLoading ? 'Menyimpan...' : (modalMode === 'add' ? 'Simpan Post' : 'Update Post')}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default SocialPlanner;
