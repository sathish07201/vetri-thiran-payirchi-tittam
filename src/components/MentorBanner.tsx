import React from 'react';
import { AlertCircle, ExternalLink, Github, CheckCircle2, UserCheck, Sparkles, Download } from 'lucide-react';

interface MentorBannerProps {
  demoUrl: string;
  githubUrl: string;
  mentor: string;
  onOpenModal: () => void;
}

export const MentorBanner: React.FC<MentorBannerProps> = ({
  demoUrl,
  githubUrl,
  mentor,
  onOpenModal
}) => {
  const isMentorAssigned = mentor && mentor !== 'No mentor assigned yet';

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
        <div className="flex items-start sm:items-center gap-2.5 text-amber-900">
          <div className="p-1 rounded bg-amber-100 text-amber-800 shrink-0 mt-0.5 sm:mt-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-amber-950">Mentor Evaluation Notice:</span>{' '}
            <span className="text-amber-800">Please update the demo and GitHub links so that your mentor can review and evaluate your project.</span>
            <span className="hidden lg:inline text-amber-700 ml-2">
              (Status: {isMentorAssigned ? `Mentor: ${mentor}` : 'No mentor assigned yet'})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/api/download-zip"
            download="pocketsmart-ai.zip"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
            title="Download full project directory as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </a>

          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Update Demo & GitHub Links
          </button>

          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 rounded-md text-xs font-medium transition-colors"
              title="Open Live Demo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Demo</span>
            </a>
          )}

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 rounded-md text-xs font-medium transition-colors"
              title="Open GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
