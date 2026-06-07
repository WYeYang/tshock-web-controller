
import { useState } from 'react';

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string | null;
  onDelete: (groupName: string) => Promise<void>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const DeleteGroupModal = ({
  isOpen, onClose, groupName, onDelete, showToast }: DeleteGroupModalProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!groupName) return;
    setDeleting(true);
    try {
      await onDelete(groupName);
      showToast(`用户组 ${groupName} 删除成功`, 'success');
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除用户组失败';
      showToast(errorMessage, 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen || !groupName) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card neon-border p-4 sm:p-6 md:p-8 max-w-full sm:max-w-md w-full transform transition-all">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
          删除用户组
        </h3>
        <div className="text-slate-300 mb-4 sm:mb-6 bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50 text-sm sm:text-base">
          确定要删除用户组 "{groupName}" 吗？
        </div>
        <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-lg border border-slate-600 text-white font-medium hover:bg-slate-800/50 transition-all disabled:opacity-50 text-sm sm:text-base"
          >
            取消
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 text-sm sm:text-base"
          >
            {deleting ? '删除中...' : '删除'}
          </button>
        </div>
      </div>
    </div>
  );
};
