import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/hooks/useProfile';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Save, Loader2, Bell, Mail, Smartphone, Shield, Calendar, TrendingUp } from 'lucide-react';

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  
  const { profile, isLoading, updateProfile, isUpdating, bmi } = useProfile();
  const { preferences, isLoading: prefsLoading, updatePreferences, isUpdating: prefsUpdating } = useNotificationPreferences();
  
  const [form, setForm] = useState({ full_name: '', age: '', gender: '', height_cm: '', weight_kg: '' });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        height_cm: profile.height_cm?.toString() || '',
        weight_kg: profile.weight_kg?.toString() || '',
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: form.full_name || null,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender || null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
    });
  };

  if (isLoading) {
    return <MainLayout><div className="max-w-3xl mx-auto"><Skeleton className="h-96 rounded-2xl" /></div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1>
          <p className="text-muted-foreground text-lg mt-1">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="profile" className="text-sm gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-sm gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-card border-border/40">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-health shadow-lg">
                    <User className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Personal Information</CardTitle>
                    <CardDescription>Update your health profile for better insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="John Doe" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="30" min={1} max={120} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" type="number" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} placeholder="175" min={50} max={250} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" type="number" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} placeholder="70" min={20} max={300} className="h-11" />
                    </div>
                  </div>

                  {bmi && (
                    <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-6 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Your Body Mass Index (BMI)</p>
                          <p className="text-4xl font-bold gradient-text">{bmi}</p>
                        </div>
                        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                          <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full gradient-health h-12 text-base" disabled={isUpdating}>
                    {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Profile</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {prefsLoading ? (
              <Skeleton className="h-80 rounded-2xl" />
            ) : (
              <>
                <Card className="shadow-card border-border/40">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-energy shadow-lg">
                        <Mail className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Email Notifications</CardTitle>
                        <CardDescription>Receive health summaries and insights via email</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Weekly Health Summary</p>
                          <p className="text-sm text-muted-foreground">Receive a summary of your health data every week</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences?.email_weekly_summary ?? true}
                        onCheckedChange={(checked) => updatePreferences({ email_weekly_summary: checked })}
                        disabled={prefsUpdating}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-4 border-b">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Monthly Health Report</p>
                          <p className="text-sm text-muted-foreground">Get a detailed monthly analysis with trends</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences?.email_monthly_summary ?? true}
                        onCheckedChange={(checked) => updatePreferences({ email_monthly_summary: checked })}
                        disabled={prefsUpdating}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                          <Shield className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Health Alerts</p>
                          <p className="text-sm text-muted-foreground">Important notifications about your health metrics</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences?.email_health_alerts ?? true}
                        onCheckedChange={(checked) => updatePreferences({ email_health_alerts: checked })}
                        disabled={prefsUpdating}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Push Notification Reminders */}
                <NotificationSettings />

                <Card className="shadow-card border-border/40">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-purple shadow-lg">
                        <Smartphone className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Database Push Status</CardTitle>
                        <CardDescription>Sync your push notification status with your account</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Push Notifications Enabled</p>
                          <p className="text-sm text-muted-foreground">Track push notification status in your account</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences?.push_enabled ?? false}
                        onCheckedChange={(checked) => updatePreferences({ push_enabled: checked })}
                        disabled={prefsUpdating}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
