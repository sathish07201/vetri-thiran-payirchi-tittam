import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Github, Globe, UserCheck, ShieldCheck } from 'lucide-react';

interface ProjectLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoUrl: string;
  githubUrl: string;
  mentor: string;
  onSave: (demo: string, github: string, mentor: string) => void;
}

export const ProjectLinksModal: React.FC<ProjectLinksModalProps> = ({
  isOpen,
  onClose,
  demoUrl,
  githubUrl,
  mentor,
  onSave
}) => {
  const [formDemo, setFormDemo] = useState(demoUrl);
  const [formGithub, setFormGithub] = useState(githubUrl);
  const [formMentor, setFormMentor] = useState(mentor === 'No mentor assigned yet' ? '' : mentor);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      formDemo.trim(),
      formGithub.trim(),
      formMentor.trim() || 'No mentor assigned yet'
    );
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Project Evaluation Credentials</h3>
            <p className="text-xs text-slate-500 mt-0.5">Update live demo, repository, and mentor details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Live Demo URL
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  required
                  value={formDemo}
                  onChange={(e) => setFormDemo(e.target.value)}
                  placeholder="https://pocketsmart-ai.demo.app"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => handleCopy(formDemo, 'demo')}
                className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors"
                title="Copy Demo Link"
              >
                {copiedField === 'demo' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                Copy
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">This URL is shared with mentors to test the active deployment.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              GitHub Repository URL
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Github className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  required
                  value={formGithub}
                  onChange={(e) => setFormGithub(e.target.value)}
                  placeholder="https://github.com/jananir/pocketsmart-ai"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => handleCopy(formGithub, 'github')}
                className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors"
                title="Copy GitHub Link"
              >
                {copiedField === 'github' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                Copy
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">Repository containing frontend, backend, and Gemini prompts.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Mentor
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formMentor}
                onChange={(e) => setFormMentor(e.target.value)}
                placeholder="e.g. Dr. Rajesh Kumar or Faculty Mentor"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Leave empty if no mentor is assigned yet.</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Visible to evaluation reviewers</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 ${
                  savedSuccess ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Saved!
                  </>
                ) : (
                  'Update Links & Save'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
