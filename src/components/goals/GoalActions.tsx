import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Trash2 } from 'lucide-react';

type Props = {
  goal: { id: string; title: string };
  onChanged?: () => void; // refetch o invalidate
};

export default function GoalActions({ goal, onChanged }: Props) {
  const [loading, setLoading] = useState<'complete' | 'delete' | null>(null);

  const handleComplete = async () => {
    if (loading) return;
    setLoading('complete');
    try {
      const { error } = await supabase
        .from('goals')
        .update({
          active: false,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', goal.id);

      if (error) throw error;
      toast.success('✅ Objetivo marcado como completado');
      onChanged?.();
    } catch (e: any) {
      toast.error(e?.message || 'Error al completar el objetivo');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    const ok = confirm(`¿Eliminar "${goal.title}"? Esta acción no se puede deshacer.`);
    if (!ok) return;

    setLoading('delete');
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goal.id);

      if (error) throw error;
      toast.success('🗑️ Objetivo eliminado');
      onChanged?.();
    } catch (e: any) {
      toast.error(e?.message || 'Error al eliminar el objetivo');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        className="rounded-xl"
        onClick={handleComplete}
        disabled={loading !== null}
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Objetivo cumplido
      </Button>

      <Button
        variant="destructive"
        size="sm"
        className="rounded-xl"
        onClick={handleDelete}
        disabled={loading !== null}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Eliminar
      </Button>
    </div>
  );
}
