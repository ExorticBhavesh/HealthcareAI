import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SymptomCard } from '@/components/symptoms/SymptomCard';
import { SymptomAnalysisResult } from '@/components/symptoms/SymptomAnalysisResult';
import { SymptomAnalysisModal } from '@/components/symptoms/SymptomAnalysisModal';
import { SymptomHistoryTimeline } from '@/components/symptoms/SymptomHistoryTimeline';
import { FloatingMedicalBackground } from '@/components/symptoms/FloatingMedicalBackground';
import { SYMPTOMS_LIST, SYMPTOM_CATEGORIES, MEDICAL_DISCLAIMER } from '@/lib/constants';
import { searchDiseases, getFeaturedDiseases, type DiseaseEntry } from '@/lib/diseaseDatabase';
import { supabase } from '@/integrations/supabase/client';
import { useSymptomHistory } from '@/hooks/useSymptomHistory';
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, AlertTriangle, Sparkles, History, Search, X, Pill } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore?: number;
  analysis: string;
  recommendations: string[];
  possibleCauses?: { cause: string; confidence: 'Low' | 'Medium' | 'High' }[];
  immediateActions?: string[];
  lifestyleChanges?: string[];
  monitoringAdvice?: string[];
  doctorTriggers?: string[];
}

export default function SymptomsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { refetch } = useSymptomHistory();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [diseaseQuery, setDiseaseQuery] = useState('');

  const matchedDiseases = useMemo(() => {
    if (diseaseQuery.length >= 2) return searchDiseases(diseaseQuery);
    return getFeaturedDiseases();
  }, [diseaseQuery]);

  const selectDiseaseSymptoms = (disease: DiseaseEntry) => {
    const validSymptoms = disease.relatedSymptoms.filter(s => 
      SYMPTOMS_LIST.some(sl => sl.id === s)
    );
    setSelectedSymptoms(prev => {
      const combined = new Set([...prev, ...validSymptoms]);
      return Array.from(combined);
    });
    toast({ title: `${disease.name} symptoms selected`, description: `${validSymptoms.length} related symptoms added.` });
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedSymptoms([]);
    setResult(null);
    setIsModalOpen(false);
  };

  const filteredSymptoms = useMemo(() => {
    return SYMPTOMS_LIST.filter(symptom => {
      const matchesSearch = symptom.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || symptom.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const groupedSymptoms = useMemo(() => {
    return filteredSymptoms.reduce((acc, symptom) => {
      if (!acc[symptom.category]) acc[symptom.category] = [];
      acc[symptom.category].push(symptom);
      return acc;
    }, {} as Record<string, typeof SYMPTOMS_LIST[number][]>);
  }, [filteredSymptoms]);

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      toast({ title: 'Please select at least one symptom', variant: 'destructive' });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: { symptoms: selectedSymptoms },
      });

      if (error) throw error;

      setResult(data);
      setIsModalOpen(true);

      // Save to database
      if (user) {
        await supabase.from('symptom_checks').insert({
          user_id: user.id,
          symptoms: selectedSymptoms,
          risk_level: data.riskLevel,
          risk_score: data.riskScore || null,
          ai_analysis: data.analysis,
          recommendations: data.recommendations,
        });
        refetch();
      }
    } catch (error) {
      toast({ title: 'Analysis failed', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categories = Object.entries(SYMPTOM_CATEGORIES);

  return (
    <MainLayout>
      <FloatingMedicalBackground />
      
      <div className="space-y-8 animate-fade-in relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
            AI Symptom Checker
          </h1>
          <p className="text-muted-foreground mt-2">
            Select your symptoms for a comprehensive AI-powered health assessment
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-warning/30 bg-warning/5 backdrop-blur-sm">
            <CardContent className="flex gap-4 p-4">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{MEDICAL_DISCLAIMER}</p>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="checker" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md glass">
            <TabsTrigger value="checker" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              Symptom Checker
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checker">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Symptom Selection */}
            <div className="lg:col-span-2 space-y-4">
              {/* Disease Search */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="glass border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Pill className="h-4 w-4 text-primary" />
                      Search by Health Condition
                    </CardTitle>
                    <CardDescription>Search any disease or condition to auto-select related symptoms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search diseases (e.g., diabetes, asthma, migraine...)"
                        value={diseaseQuery}
                        onChange={(e) => setDiseaseQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto">
                      {matchedDiseases.map((disease) => (
                        <div
                          key={disease.id}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                          onClick={() => selectDiseaseSymptoms(disease)}
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{disease.name}</p>
                            <p className="text-xs text-muted-foreground">{disease.category} • {disease.relatedSymptoms.length} symptoms</p>
                          </div>
                          <Button variant="ghost" size="sm" className="shrink-0 text-xs h-7 px-2">Select</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Search and Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search symptoms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass"
                    />
                  </div>

                  {/* Category filters */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={activeCategory === null ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveCategory(null)}
                      className="rounded-full"
                    >
                      All
                    </Button>
                    {categories.map(([key, value]) => (
                      <Button
                        key={key}
                        variant={activeCategory === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                        className="rounded-full"
                        style={{
                          borderColor: activeCategory === key ? 'transparent' : `${value.color}40`,
                          backgroundColor: activeCategory === key ? value.color : 'transparent',
                        }}
                      >
                        {value.label}
                      </Button>
                    ))}
                  </div>
                </motion.div>

                {/* Selected symptoms */}
                <AnimatePresence>
                  {selectedSymptoms.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Card className="glass border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">
                              Selected ({selectedSymptoms.length})
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearSelection}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Clear all
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedSymptoms.map((id) => {
                              const symptom = SYMPTOMS_LIST.find(s => s.id === id);
                              return (
                                <motion.div
                                  key={id}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-destructive/20"
                                    onClick={() => toggleSymptom(id)}
                                  >
                                    {symptom?.label}
                                    <X className="h-3 w-3 ml-1" />
                                  </Badge>
                                </motion.div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Symptom grid */}
                {Object.entries(groupedSymptoms).map(([category, symptoms], categoryIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + categoryIndex * 0.05 }}
                  >
                    <Card className="shadow-card border-border/50 glass overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: SYMPTOM_CATEGORIES[category as keyof typeof SYMPTOM_CATEGORIES]?.color }}
                          />
                          {SYMPTOM_CATEGORIES[category as keyof typeof SYMPTOM_CATEGORIES]?.label || category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {symptoms.map((symptom) => (
                            <SymptomCard
                              key={symptom.id}
                              id={symptom.id}
                              label={symptom.label}
                              category={symptom.category}
                              isSelected={selectedSymptoms.includes(symptom.id)}
                              onToggle={() => toggleSymptom(symptom.id)}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Analysis Panel */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="sticky top-24"
                >
                  <Card className="shadow-card border-border/50 glass overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5" />
                        Analysis
                      </CardTitle>
                      <CardDescription>
                        {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        onClick={analyzeSymptoms}
                        disabled={isAnalyzing || selectedSymptoms.length === 0}
                        className="w-full gradient-health shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                        size="lg"
                      >
                        {isAnalyzing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <Sparkles className="mr-2 h-5 w-5" />
                            </motion.div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Analyze Symptoms
                          </>
                        )}
                      </Button>

                      <SymptomAnalysisResult 
                        result={result} 
                        isAnalyzing={isAnalyzing} 
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <SymptomHistoryTimeline />
          </TabsContent>
        </Tabs>
      </div>

      {/* Analysis Result Popup Modal */}
      <SymptomAnalysisModal
        result={result}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSymptoms={selectedSymptoms}
      />
    </MainLayout>
  );
}
