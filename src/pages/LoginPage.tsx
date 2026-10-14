import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const nav = useNavigate();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => data.session && nav('/admin'));
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === 'in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message); else nav('/admin');
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) toast.error(error.message); else toast.success('تحقق من بريدك لتأكيد الحساب');
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 border border-border rounded-lg p-8">
        <p className="text-center text-2xl font-bold">غروبي</p>
        <h1 className="text-center text-sm text-muted-foreground">{mode === 'in' ? 'دخول لوحة التحكم' : 'إنشاء حساب المشرف'}</h1>
        <Input type="email" dir="ltr" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" dir="ltr" placeholder="Password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={busy}>{mode === 'in' ? 'دخول' : 'إنشاء الحساب'}</Button>
        <button type="button" onClick={() => setMode(mode === 'in' ? 'up' : 'in')} className="w-full text-xs text-muted-foreground hover:text-foreground">
          {mode === 'in' ? 'أول مرة؟ أنشئ حساب المشرف' : 'لديك حساب؟ سجّل الدخول'}
        </button>
      </form>
    </div>
  );
};
export default LoginPage;
