import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Sparkles, Check, AlertCircle, VideoOff, Maximize2 } from 'lucide-react';
import { soundFX } from '@/utils/audioUtils';
import { useLanguage } from '@/context/LanguageContext';

interface LiveCameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageSrc: string, fileName: string) => void;
}

export default function LiveCameraScannerModal({
  isOpen,
  onClose,
  onCapture
}: LiveCameraScannerModalProps) {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsLoading(true);
    setPermissionDenied(false);

    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsLoading(false);
    } catch (err) {
      console.warn('Camera permission denied or device not found:', err);
      setPermissionDenied(true);
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleFacingMode = () => {
    soundFX.playPop();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    soundFX.playPop();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `scanned_exam_sheet_${timestamp}.jpg`;

      stopCamera();
      onCapture(dataUrl, filename);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{language === 'si' ? 'සජීවී ලේඛන කැමරා ස්කෑනරය' : 'Live Document & Answer Scanner'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                  AI VISION
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'si'
                  ? 'ඔබේ පිළිතුරු පත්‍රය හෝ පොත් පිටුව රාමුව තුළ කෙළින් තබා ඡායාරූපය ගන්න'
                  : 'Align your handwritten answer sheet or textbook inside the guidelines'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Canvas Area */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] bg-black flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 text-cyan-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span className="text-xs font-semibold">Initializing HD Camera Stream...</span>
            </div>
          )}

          {permissionDenied ? (
            <div className="p-6 text-center max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
                <VideoOff className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Camera Access Required</h4>
                <p className="text-xs text-slate-300 mt-1">
                  {language === 'si'
                    ? 'කැමරාව භාවිතා කිරීමට බ්‍රවුසරයේ අවසරය (Allow Camera Permission) ලබා දෙන්න.'
                    : 'Please allow camera permission in your browser or select an existing photo/PDF from your device gallery.'}
                </p>
              </div>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                Retry Camera Permission
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Shutter flash animation overlay */}
          {isFlashing && <div className="absolute inset-0 bg-white z-40 transition-opacity duration-150" />}

          {/* Scanner Overlay Frame Guidelines */}
          {!permissionDenied && !isLoading && (
            <div className="absolute inset-4 sm:inset-8 border-2 border-dashed border-cyan-400/70 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              {/* Corner brackets */}
              <div className="flex justify-between">
                <span className="w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                <span className="w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
              </div>

              {/* Animated laser scanning line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-pulse" />

              <div className="flex justify-between">
                <span className="w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                <span className="w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={toggleFacingMode}
            disabled={permissionDenied || isLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold transition disabled:opacity-40 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Flip Camera</span>
          </button>

          <button
            type="button"
            onClick={handleCapture}
            disabled={permissionDenied || isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition transform hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>{language === 'si' ? 'ඡායාරූපය ගන්න (Capture)' : 'Capture & Analyze'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold transition cursor-pointer"
          >
            {language === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
