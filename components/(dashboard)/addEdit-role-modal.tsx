import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AddEditRoleModal({ open, onClose, modalMode, newRole, setNewRole, onSave }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold">{modalMode==='add'?'إضافة دور جديد':'تعديل الدور'}</h3>
          <button onClick={onClose}><FontAwesomeIcon icon={faTimes}/></button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-4">
          <input
            required
            value={newRole.name}
            onChange={(e:any)=>setNewRole({...newRole,name:e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="اسم الدور"
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg">الغاء</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white">
              {modalMode==='add'?'اضافة':'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
