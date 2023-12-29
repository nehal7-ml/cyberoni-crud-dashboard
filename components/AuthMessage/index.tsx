import { CheckCircle2, XCircle } from "lucide-react";

export function Message({ message, type }: { message: string, type: 'green' | 'red' }) {
    return (<>
  
      <div className={`flex gap-3 p-4 ${type === 'green' ? 'ring-green-500 bg-green-400/60' : 'ring-red-500 bg-rose-400/60'}  ring-2 `}>
        {type === 'green' ? <CheckCircle2 className="text-emerald-900" /> : <XCircle className="text-rose-900" />} {message}
      </div>
    </>)
  }