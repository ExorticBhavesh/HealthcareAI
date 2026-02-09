import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Save, Loader2, Heart } from 'lucide-react';

export function ProfileOnboarding() {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
  });

  useEffect(() => {
    if (!isLoading && profile && user) {
      // Check if profile is incomplete (new user)
      const isIncomplete = !profile.full_name && !profile.age && !profile.gender;
      const dismissed = localStorage.getItem(`onboarding-dismissed-${user.id}`);
      if (isIncomplete && !dismissed) {
        setIsOpen(true);
      }
    }
  }, [isLoading, profile, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: form.full_name || null,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender || null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
    });
    setIsOpen(false);
    if (user) localStorage.setItem(`onboarding-dismissed-${user.id}`, 'true');
  };

  const handleSkip = () => {
    setIsOpen(false);
    if (user) localStorage.setItem(`onboarding-dismissed-${user.id}`, 'true');
  };

  if (isLoading || !user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl gradient-health">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl">Welcome to Healthcare AI! 🎉</DialogTitle>
              <DialogDescription>
                Complete your profile for personalized health insights
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="onb-name">Full Name</Label>
            <Input
              id="onb-name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="onb-age">Age</Label>
              <Input
                id="onb-age"
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="30"
                min={1}
                max={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="onb-gender">Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="onb-height">Height (cm)</Label>
              <Input
                id="onb-height"
                type="number"
                value={form.height_cm}
                onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
                placeholder="175"
                min={50}
                max={250}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="onb-weight">Weight (kg)</Label>
              <Input
                id="onb-weight"
                type="number"
                value={form.weight_kg}
                onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                placeholder="70"
                min={20}
                max={300}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleSkip} className="flex-1">
              Skip for now
            </Button>
            <Button type="submit" className="flex-1 gradient-health" disabled={isUpdating}>
              {isUpdating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Save Profile</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
