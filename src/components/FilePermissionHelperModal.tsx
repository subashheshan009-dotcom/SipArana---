import React from 'react';
import {
  ShieldAlert,
  FileCheck,
  Camera,
  FolderOpen,
  Download,
  ExternalLink,
  HelpCircle,
  Smartphone,
  Laptop
} from 'lucide-react';

interface FilePermissionHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'upload' | 'download' | 'camera';
  downloadUrl?: string;
  downloadFilename?: string;
}

export default function FilePermissionHelperModal({
  isOpen,
  onClose,
  type = 'upload',
  downloadUrl,
  downloadFilename
}: FilePermissionHelperModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-800 dark:text-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              {type === 'download' ? <Download className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {type === 'download' ? 'File Download & Storage Assistant' : 'Device Gallery & File Access Help'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {type === 'download'
                  ? 'Sri Lankan Curricula PDF & Document Downloads'
                  : 'Photo, Diagram & Study Material Attachments'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        {type === 'download' ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <p>
              Your browser or mobile security settings may require you to confirm downloading documents or allow automatic popups for PDF printing.
            </p>

            {downloadUrl && (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Direct Download Link:</span>
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
                  {downloadFilename || 'SipArana_Official_Document.pdf'}
                </div>
                <a
                  href={downloadUrl}
                  download={downloadFilename || 'SipArana_Document.html'}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Click Here to Direct Save File</span>
                </a>
              </div>
            )}

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>How to enable downloads & popups:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <li><strong>Mobile (Chrome / Safari):</strong> Tap the lock or site settings icon in the address bar and set <em>Automatic Downloads</em> or <em>Pop-ups</em> to <em>Allow</em>.</li>
                <li><strong>Desktop (Chrome / Edge / Firefox):</strong> Click the icon next to the URL, choose <em>Site settings</em>, and enable <em>Automatic Downloads</em> & <em>Insecure content/Popups</em>.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <p>
              To upload problem diagrams, handwritten homework notes, or past paper questions, ensure your device allows photo gallery and file browsing:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>Android & iOS Devices</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  When tapping the <strong>Upload</strong> or <strong>Camera</strong> button, choose <em>Photo Library</em>, <em>Take Photo</em>, or <em>Browse Files</em>. If prompted, select <strong>"Allow"</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                  <Laptop className="w-4 h-4 text-blue-600" />
                  <span>Desktop & Laptop</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  You can click to open your file explorer or simply <strong>drag and drop</strong> any PNG, JPG, or PDF file straight into the upload zone.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <FolderOpen className="w-4 h-4 flex-shrink-0" />
              <span>Supported formats: <strong>Images (JPG, PNG, WEBP)</strong> and <strong>PDF Documents (Past Papers, Notes)</strong> up to 10MB.</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-xs hover:opacity-90 transition"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
