import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, CheckCircle, XCircle } from 'lucide-react';
import { formatImageSrc } from '../../utils/imageUtils.ts';

interface PremiumRequest {
  id: string;
  name: string;
  phone: string;
  instagram?: string;
  tiktok?: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  code?: string;
  created_at: string;
}

interface PremiumRequestModalProps {
  request: PremiumRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
  isProcessing?: boolean;
}

const PremiumRequestModal: React.FC<PremiumRequestModalProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isProcessing = false,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  if (!request) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  };

  const images = request.images || [];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-[#ff6c00]/5 to-[#ffba00]/5">
                <div className="flex-1">
                  <h2 className="text-lg md:text-xl font-display font-bold text-blacksoft">
                    Demande Premium - {request.name}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-text mt-1">
                    {request.phone} • {new Date(request.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-gray-text" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                    {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                    {getStatusText(request.status)}
                  </span>
                  {request.code && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Code généré:</strong> <span className="font-mono text-sm">{request.code}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-offwhite rounded-lg p-3 md:p-4">
                    <h3 className="text-xs font-semibold text-gray-text mb-2 uppercase">Informations</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-text">Nom:</span>{' '}
                        <span className="text-blacksoft font-medium">{request.name}</span>
                      </p>
                      <p>
                        <span className="text-gray-text">Téléphone:</span>{' '}
                        <span className="text-blacksoft font-medium">{request.phone}</span>
                      </p>
                      {request.instagram && (
                        <p>
                          <span className="text-gray-text">Instagram:</span>{' '}
                          <span className="text-blacksoft font-medium">@{request.instagram}</span>
                        </p>
                      )}
                      {request.tiktok && (
                        <p>
                          <span className="text-gray-text">TikTok:</span>{' '}
                          <span className="text-blacksoft font-medium">@{request.tiktok}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-offwhite rounded-lg p-3 md:p-4">
                    <h3 className="text-xs font-semibold text-gray-text mb-2 uppercase">Date</h3>
                    <p className="text-sm text-blacksoft">
                      {new Date(request.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Images */}
                {images.length > 0 ? (
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-blacksoft mb-3">
                      Preuves d'abonnement ({images.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#ff6c00] transition-colors cursor-pointer group"
                          onClick={() => {
                            setSelectedImage(image);
                            setImageViewerOpen(true);
                          }}
                        >
                          <img
                            src={formatImageSrc(image)}
                            alt={`Preuve ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/back.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                            {index + 1}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-yellow-800">Aucune image fournie</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {request.status === 'pending' && (
                <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onReject(request.id)}
                      disabled={isProcessing}
                      className="flex-1 btn-secondary text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Traitement...' : 'Rejeter'}
                    </button>
                    <button
                      onClick={() => onApprove(request.id)}
                      disabled={isProcessing}
                      className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Génération du code...' : 'Approuver & Générer le code'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Viewer */}
      <AnimatePresence>
        {imageViewerOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
            onClick={() => setImageViewerOpen(false)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={formatImageSrc(selectedImage)}
              alt="Image agrandie"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setImageViewerOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PremiumRequestModal;


