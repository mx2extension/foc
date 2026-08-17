// app/components/PdfModal.tsx
"use client";

interface PdfModalProps {
  url: string;
  title?: string;
  onClose: () => void;
}

export default function PdfModal({ url, title = "Document", onClose }: PdfModalProps) {
  // Encode the URL so Google Docs Viewer can read it safely
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col p-2 md:p-6">
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-2 md:mb-4 px-2 gap-4">
        <h3 className="text-white serif text-lg md:text-2xl truncate">{title}</h3>
        
        <div className="flex items-center gap-2 shrink-0">
          <a 
            href={url} 
            download 
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex text-white w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center transition"
            aria-label="Download"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
          <button 
            onClick={onClose} 
            className="text-white w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            aria-label="Close document"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Viewer Container */}
      <div className="flex-1 bg-white rounded-xl md:rounded-2xl overflow-hidden">
        <iframe 
          src={viewerUrl} 
          className="w-full h-full border-0" 
          title={title}
        />
      </div>
    </div>
  );
}