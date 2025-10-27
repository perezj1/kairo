import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { pickTodayTask } from '@/lib/taskPlanner';
import { CategorySelector } from '@/components/onboarding/CategorySelector';
import { SubCategorySelector } from '@/components/onboarding/SubCategorySelector';
import { GoalDetailsForm } from '@/components/onboarding/GoalDetailsForm';

type FormData = {
  title: string;
  minutes: number;
  targetWeight: number | null;
  deadlineWeeks: number | null;
  languageTarget: string;
  currentLevel: string;
  targetLevel: string;
  savingsTarget: number | null;
  bestSlot: string; // UI label (es): 'Mañana' | 'Mediodía' | 'Tarde' | 'Noche'
};

const bestSlotMap: Record<string, 'morning' | 'noon' | 'afternoon' | 'night'> = {
  'Mañana': 'morning',
  'Mediodía': 'noon',
  'Tarde': 'afternoon',
  'Noche': 'night',
};

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: category, 2: subcategory, 3: details
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    minutes: 15,
    targetWeight: null,
    deadlineWeeks: null,
    languageTarget: '',
    currentLevel: '',
    targetLevel: '',
    savingsTarget: null,
    bestSlot: 'Tarde', // UI label; se normaliza antes de guardar
  });
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
    setStep(2);
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    setSubCategory(subCategoryId);
    setStep(3);
  };

  const handleFinish = async () => {
    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }
    if (!category) {
      toast.error('Select a category');
      return;
    }
    if (!formData.title?.trim()) {
      toast.error('Add a goal title');
      return;
    }

    setLoading(true);
    try {
      // Normaliza best_slot a slug en inglés
      const best_slot =
        bestSlotMap[formData.bestSlot] ??
        (['morning', 'noon', 'afternoon', 'night'].includes(formData.bestSlot)
          ? (formData.bestSlot as 'morning' | 'noon' | 'afternoon' | 'night')
          : 'afternoon');

      // specific_details guarda todo lo extra (no columnas fijas)
      const specificDetails = {
        subCategory,
        minutes: formData.minutes,
        targetWeight: formData.targetWeight,
        deadlineWeeks: formData.deadlineWeeks,
        languageTarget: formData.languageTarget,
        currentLevel: formData.currentLevel,
        targetLevel: formData.targetLevel,
        savingsTarget: formData.savingsTarget,
        bestSlotUi: formData.bestSlot, // lo que vio/eligió el usuario (etiqueta)
      };

      // payload SOLO con columnas que existen en DB
      const goalData = {
        user_id: user.id,
        title: formData.title.trim(),
        category,                         // text
        minutes_per_day: Number(formData.minutes), // smallint/int
        level: 1,
        xp: 0,
        streak: 0,
        hearts: 3,
        active: true,
        best_slot,                        // 'morning' | 'noon' | 'afternoon' | 'night'
        specific_details: specificDetails // jsonb
      };

      const { data: goal, error: goalError } = await supabase
        .from('goals')
        .insert([goalData])
        .select()
        .single();

      if (goalError) throw goalError;

      // Crea el reto de hoy (si aplica)
      const task = pickTodayTask(category, 1, formData.minutes, []);
      if (task) {
        const today = new Date().toISOString().split('T')[0];
        const { error: chErr } = await supabase.from('challenges').insert({
          goal_id: goal.id,
          day: today,
          kind: task.kind,
          minutes: task.minutes,
          text: task.text,
          status: 'pending',
        });
        if (chErr) {
          // no bloquea el flujo, solo avisa
          console.error('Challenge insert error:', chErr.message || chErr);
        }
      }

      toast.success('¡Objetivo creado! Comencemos tu viaje.');
      navigate('/home');
    } catch (e: any) {
      console.error('Insert goal error:', e?.message || e);
      toast.error(e?.message || 'Error creating the goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg shadow-card">
        <CardContent className="p-6">
          {step === 1 && (
            <CategorySelector
              selectedCategory={category}
              onSelect={handleCategorySelect}
            />
          )}

          {step === 2 && (
            <SubCategorySelector
              categoryId={category}
              selectedSubCategory={subCategory}
              onSelect={handleSubCategorySelect}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <GoalDetailsForm
              categoryId={category}
              subCategoryId={subCategory}
              formData={formData}
              onUpdate={setFormData}
              onBack={() => setStep(2)}
              onSubmit={handleFinish}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
