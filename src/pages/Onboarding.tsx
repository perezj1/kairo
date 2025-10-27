import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
    bestSlot: 'Tarde',
  });
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (step === 1) navigate('/home');
    else setStep((s) => Math.max(1, s - 1));
  };

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
    setStep(2);
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    setSubCategory(subCategoryId);
    setStep(3);
  };

  const handleFinish = async () => {
    if (!user) return toast.error('Please sign in to continue');
    if (!category) return toast.error('Select a category');
    if (!formData.title?.trim()) return toast.error('Add a goal title');

    setLoading(true);
    try {
      const best_slot =
        bestSlotMap[formData.bestSlot] ??
        (['morning', 'noon', 'afternoon', 'night'].includes(formData.bestSlot)
          ? (formData.bestSlot as 'morning' | 'noon' | 'afternoon' | 'night')
          : 'afternoon');

      const specificDetails = {
        subCategory,
        minutes: formData.minutes,
        targetWeight: formData.targetWeight,
        deadlineWeeks: formData.deadlineWeeks,
        languageTarget: formData.languageTarget,
        currentLevel: formData.currentLevel,
        targetLevel: formData.targetLevel,
        savingsTarget: formData.savingsTarget,
        bestSlotUi: formData.bestSlot,
      };

      const goalData = {
        user_id: user.id,
        title: formData.title.trim(),
        category,
        minutes_per_day: Number(formData.minutes),
        level: 1,
        xp: 0,
        streak: 0,
        hearts: 3,
        active: true,
        best_slot,
        specific_details: specificDetails,
      };

      const { data: goal, error: goalError } = await supabase
        .from('goals')
        .insert([goalData])
        .select()
        .single();
      if (goalError) throw goalError;

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
        if (chErr) console.error('Challenge insert error:', chErr.message || chErr);
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
      <Card className="w-full max-w-lg shadow-card relative">
        {/* Flecha flotante SOLO en paso 1 para evitar duplicados */}
        {step === 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="absolute top-3 left-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        <CardContent className="p-6 pt-10">
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
              onBack={handleBack}
            />
          )}

          {step === 3 && (
            <GoalDetailsForm
              categoryId={category}
              subCategoryId={subCategory}
              formData={formData}
              onUpdate={setFormData}
              onBack={handleBack}
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
