import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function PrivilegesModal({ open, onClose, privileges, rolePrivileges, setRolePrivileges }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="bg-white rounded-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between p-4 border-b">
          <h3>صلاحيات الدور</h3>
          <button onClick={onClose}><FontAwesomeIcon icon={faTimes}/></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <table className="w-full">
            <tbody>
              {privileges.map((p:any)=>(
                <tr key={p.id}>
                  <td>{p.name}</td>
                  {['insert','delete','update','view'].map((key:any)=>(
                    <td key={key}>
                      <button onClick={()=>setRolePrivileges((prev:any)=>({
                        ...prev,
                        [p.id]: {...prev[p.id],[key]:!prev[p.id]?.[key]}
                      }))}>
                        {rolePrivileges[p.id]?.[key] ? '✔' : '✖'}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose}>الغاء</button>
          <button onClick={()=>{onClose();alert('تم حفظ الصلاحيات')}} className="bg-primary text-white px-4 py-2 rounded">
            حفظ الصلاحيات
          </button>
        </div>
      </div>
    </div>
  );
}
