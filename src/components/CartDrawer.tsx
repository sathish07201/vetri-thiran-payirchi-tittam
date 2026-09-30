import React, { useState } from 'react';
import {
  X,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Download,
  Share2,
  Printer,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatCurrency, getPlatformBadgeStyle } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  currency: Currency;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
  currency
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, item) => acc + item.price, 0);

  const handleExportCSV = () => {
    if (items.length === 0) return;
    const headers = 'Item Name,Category,Platform,Quantity,Price,Scenario,URL\n';
    const rows = items
      .map(
        (item) =>
          `"${item.name.replace(/"/g, '""')}","${item.category}","${item.platform}",${item.quantity},${item.price},"${item.scenario}","${item.searchUrl}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PocketSmart_Budget_Plan_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-slate-900 text-amber-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Planned Items & Budget</h3>
                <p className="text-xs text-slate-500">{items.length} items saved across scenarios</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-3">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Your plan is empty</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                    Click "Add to Plan" on any recommendation in Home Interior, Party, or Jewelry to calculate budget burn-down.
                  </p>
                </div>
              </div>
            ) : (
              items.map((item) => {
                const badgeStyle = getPlatformBadgeStyle(item.platform);
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${badgeStyle.bg} ${badgeStyle.border}`}
                          >
                            {item.platform}
                          </span>
                          <span className="text-[10px] text-slate-500 capitalize">
                            · {item.scenario}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">
                          {item.name}
                        </h4>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="font-extrabold text-slate-900">
                        {formatCurrency(item.price, currency)}
                      </span>
                      <a
                        href={item.searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                      >
                        <span>Open on {item.platform}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer Actions & Totals */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-slate-500">Total Planned Spend</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {formatCurrency(totalAmount, currency)}
                  </p>
                </div>
                <button
                  onClick={onClearCart}
                  className="text-xs text-slate-500 hover:text-red-600 underline"
                >
                  Clear all
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="py-2 px-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2 px-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="py-2 px-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
