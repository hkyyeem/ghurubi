import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

type Row = Record<string, any>;
const FIELDS: { key: string; label: string; long?: boolean; area?: boolean }[] = [
  { key: 'title', label: 'العنوان' },
  { key: 'kicker', label: 'التصنيف الصغير فوق العنوان' },
  { key: 'lead', label: 'المقدمة', area: true },
  { key: 'desc', label: 'وصف جوجل (اختياري)', area: true },
  { key: 'tweet', label: 'نص التغريدة الرئيسية', area: true },
  { key: 'body', label: 'المحتوى', long: true },
];
const EMPTY: Row = { slug: '', published: false, ...Object.fromEntries(FIELDS.flatMap(f => [[`${f.key}_ar`, ''], [`${f.key}_en`, '']])) };
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const AdminPage = () => {
  const nav = useNavigate();
  const [state, setState] = useState<'loading' | 'denied' | 'ok'>('loading');
  const [rows, setRows] = useState<Row[]>([]);
  const [edit, setEdit] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    setRows(data ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return nav('/login');
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      if (!data) return setState('denied');
      setState('ok'); load();
    })();
  }, [nav, load]);

  const save = async () => {
    if (!edit) return;
    setSaving(true);
    const p: Row = { ...edit };
    p.slug = slugify(p.slug || p.title_en || '') || `article-${Date.now()}`;
    if (p.published && !p.published_at) p.published_at = new Date().toISOString();
    p.updated_at = new Date().toISOString();
    delete p.created_at;
    const { error } = p.id ? await supabase.from('articles').update(p as never).eq('id', p.id) : await supabase.from('articles').insert(p as never);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success('تم الحفظ'); setEdit(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm('حذف المقال نهائياً؟')) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) toast.error(error.message); else load();
  };
  const logout = async () => { await supabase.auth.signOut(); nav('/login'); };

  if (state === 'loading') return <div className="min-h-screen bg-background" />;
  if (state === 'denied') return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
      <p>هذا الحساب لا يملك صلاحية المشرف.</p><Button variant="outline" onClick={logout}>خروج</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container-narrow max-w-5xl py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">غروبي · لوحة المقالات</Link>
          <Button variant="ghost" size="sm" onClick={logout}>خروج</Button>
        </div>
      </header>
      <main className="container-narrow max-w-5xl py-10">
        {!edit ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold">المقالات</h1>
              <Button onClick={() => setEdit({ ...EMPTY })}>مقال جديد</Button>
            </div>
            {rows.length === 0 && <p className="text-muted-foreground text-sm">لا مقالات بعد. مقال «يوم العمل» الحالي مكتوب داخل الموقع ويبقى ظاهراً.</p>}
            <ul className="divide-y divide-border border-y border-border">
              {rows.map(r => (
                <li key={r.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{r.title_ar || r.title_en || r.slug}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">/articles/{r.slug} · {r.published ? 'منشور' : 'مسودة'}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {r.published && <Button variant="ghost" size="sm" asChild><a href={`/articles/${r.slug}`} target="_blank" rel="noreferrer">عرض</a></Button>}
                    <Button variant="outline" size="sm" onClick={() => setEdit(r)}>تعديل</Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(r.id)}>حذف</Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="space-y-6">
            <div className="rounded-md border border-border p-4 text-sm text-muted-foreground leading-relaxed">
              طريقة كتابة المحتوى: سطر يبدأ بـ <code dir="ltr">## </code> = عنوان قسم جديد. سطر يبدأ بـ <code dir="ltr">&gt; </code> = اقتباس قابل للتغريد (يمكن وضع أكثر من اقتباس). سطر فارغ = فقرة جديدة. رابط: <code dir="ltr">[النص](https://...)</code> أو الصق الرابط مباشرة.
            </div>
            <label className="block space-y-1.5">
              <span className="text-xs text-muted-foreground">الرابط (بالإنجليزية، مثلاً night-first)</span>
              <Input dir="ltr" value={edit.slug ?? ''} onChange={e => setEdit({ ...edit, slug: e.target.value })} />
            </label>
            {FIELDS.map(f => (
              <div key={f.key} className="grid md:grid-cols-2 gap-4">
                {(['ar', 'en'] as const).map(l => {
                  const k = `${f.key}_${l}`;
                  const props = { dir: l === 'ar' ? 'rtl' : 'ltr', value: edit[k] ?? '', onChange: (e: any) => setEdit({ ...edit, [k]: e.target.value }) };
                  return (
                    <label key={k} className="block space-y-1.5">
                      <span className="text-xs text-muted-foreground">{f.label} ({l === 'ar' ? 'عربي' : 'English'})</span>
                      {f.long ? <Textarea rows={18} {...props} /> : f.area ? <Textarea rows={3} {...props} /> : <Input {...props} />}
                    </label>
                  );
                })}
              </div>
            ))}
            <label className="flex items-center gap-3">
              <Switch checked={!!edit.published} onCheckedChange={v => setEdit({ ...edit, published: v })} />
              <span className="text-sm">{edit.published ? 'منشور' : 'مسودة'}</span>
            </label>
            <div className="flex gap-3">
              <Button onClick={save} disabled={saving}>{saving ? '...' : 'حفظ'}</Button>
              <Button variant="outline" onClick={() => setEdit(null)}>إلغاء</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default AdminPage;
