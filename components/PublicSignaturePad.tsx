
import React, { useState } from 'react';
import SignaturePad from './SignaturePad';

const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#FFF27A"/>
        <path d="M15.44 26L12 19.6667L15.44 13.3333H22.32L25.76 19.6667L22.32 26H15.44ZM17.18 23.8333H20.58L22.32 20.5833L20.58 17.3333H17.18L15.44 20.5833L17.18 23.8333Z" fill="#1E1E21"/>
    </svg>
);

interface PublicSignaturePadProps {
    documentType?: string;
    clientName?: string;
    projectName?: string;
    onComplete?: (signature: string) => void;
}

const PublicSignaturePad: React.FC<PublicSignaturePadProps> = ({
    documentType = 'Dokumen',
    clientName = 'Klien',
    projectName,
    onComplete
}) => {
    const [isCompleted, setIsCompleted] = useState(false);
    const [signature, setSignature] = useState<string>('');

    const handleSaveSignature = (signatureDataUrl: string) => {
        setSignature(signatureDataUrl);
        setIsCompleted(true);
        if (onComplete) {
            onComplete(signatureDataUrl);
        }
    };

    if (isCompleted) {
        return (
            <div className="flex items-center justify-center min-h-screen portal-bg p-4">
                <div className="w-full max-w-lg p-8 text-center bg-portal-surface rounded-2xl shadow-lg border border-portal-border">
                    <div className="flex justify-center mb-4">
                        <Logo />
                    </div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-portal-text-primary mb-2">Tanda Tangan Berhasil Disimpan!</h1>
                    <p className="text-portal-text-secondary mb-6">
                        Terima kasih, {clientName}. Tanda tangan Anda untuk {documentType.toLowerCase()} 
                        {projectName && ` "${projectName}"`} telah berhasil disimpan.
                    </p>
                    
                    {signature && (
                        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                            <p className="text-sm font-medium text-slate-600 mb-2">Tanda Tangan Anda:</p>
                            <div className="border border-slate-200 rounded-lg p-2 bg-white">
                                <img src={signature} alt="Tanda Tangan" className="max-h-20 mx-auto" />
                            </div>
                        </div>
                    )}

                    <div className="text-sm text-portal-text-secondary">
                        <p>Dokumen ini telah ditandatangani secara digital pada:</p>
                        <p className="font-medium">{new Date().toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen portal-bg p-4">
            <div className="w-full max-w-2xl bg-portal-surface rounded-2xl shadow-lg border border-portal-border">
                <div className="p-6 border-b border-portal-border">
                    <div className="flex items-center gap-4 mb-4">
                        <Logo />
                        <div>
                            <h1 className="text-2xl font-bold text-portal-text-primary">Tanda Tangan Digital</h1>
                            <p className="text-portal-text-secondary">Vena Pictures</p>
                        </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h2 className="font-semibold text-blue-800 mb-2">Informasi Dokumen</h2>
                        <div className="text-sm space-y-1">
                            <p><span className="text-blue-600 font-medium">Jenis Dokumen:</span> {documentType}</p>
                            <p><span className="text-blue-600 font-medium">Nama Penandatangan:</span> {clientName}</p>
                            {projectName && (
                                <p><span className="text-blue-600 font-medium">Proyek:</span> {projectName}</p>
                            )}
                            <p><span className="text-blue-600 font-medium">Tanggal:</span> {new Date().toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <h3 className="font-semibold text-portal-text-primary mb-2">
                            Silakan bubuhkan tanda tangan Anda di area di bawah ini:
                        </h3>
                        <p className="text-sm text-portal-text-secondary">
                            Dengan menandatangani dokumen ini, Anda menyetujui syarat dan ketentuan yang telah disepakati.
                        </p>
                    </div>

                    <SignaturePad
                        onSave={handleSaveSignature}
                        onClose={() => {}}
                        hideCloseButton={true}
                        customSaveText="Simpan Tanda Tangan"
                        customClearText="Hapus & Ulang"
                    />

                    <div className="mt-4 text-xs text-portal-text-secondary text-center">
                        <p>Tanda tangan digital ini memiliki kekuatan hukum yang sama dengan tanda tangan basah.</p>
                        <p>Dokumen ini dilindungi dengan enkripsi dan timestamping untuk keamanan maksimal.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicSignaturePad;
