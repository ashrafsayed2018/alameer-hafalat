import { createClient } from '../../../lib/supabase/server'
import AdminShell from '../../../components/admin/AdminShell'
import { redirect } from 'next/navigation'
import ChangePasswordForm from '../../../components/admin/ChangePasswordForm'

export default async function ChangePasswordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">تغيير كلمة المرور</h2>
        <p className="text-gray-500 text-sm mt-1">قم بتحديث كلمة مرور حسابك</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-md">
        <ChangePasswordForm />
      </div>
    </AdminShell>
  )
}
