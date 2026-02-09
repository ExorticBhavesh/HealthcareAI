import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Upload,
  Image,
  Loader2,
  AlertTriangle,
  Shield,
  Heart,
  Activity,
  Apple,
  Stethoscope,
  ChevronRight,
  X,
  CheckCircle2,
} from 'lucide-react';

interface ReportAnalysis {
  reportSummary: string;
  healthConcerns: { concern: string; severity: string; details: string }[];
  preventiveSteps: string[];
  lifestyleCorrections: string[];
  nutritionGuidance: string[];
  followUpActions: string[];
  overallRiskLevel: string;
  disclaimer: string;
}

export default function HealthReport() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({ title: 'Invalid file type', description: 'Please upload a PDF, JPG, PNG, or WebP file.', variant: 'destructive' });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum file size is 10MB.', variant: 'destructive' });
      return;
    }

    setSelectedFile(file);
    setAnalysis(null);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        handleFileSelect({ target: { files: dt.files } } as any);
      }
    }
  };

  const analyzeReport = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const { data, error } = await supabase.functions.invoke('analyze-report', {
        body: {
          fileContent,
          fileType: selectedFile.type,
          fileName: selectedFile.name,
        },
      });

      if (error) throw error;
      setAnalysis(data);
      toast({ title: 'Analysis Complete', description: 'Your medical report has been analyzed successfully.' });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({ title: 'Analysis Failed', description: 'Please try again with a clearer image.', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const riskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Medical <span className="gradient-text">Report Analysis</span> 📄
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Upload your medical report for AI-powered wellness insights
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="flex gap-4 p-4">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                ⚕️ This tool provides informational wellness guidance only. It does NOT provide medical diagnosis or treatment recommendations. Always consult a qualified healthcare professional for medical advice.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card border-border/40 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Report
                </CardTitle>
                <CardDescription>Upload a medical report image or PDF for analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-border/60 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Drop your file here or click to browse</p>
                        <p className="text-sm text-muted-foreground mt-1">Supports PDF, JPG, PNG, WebP (max 10MB)</p>
                      </div>
                      <div className="flex gap-3">
                        <Badge variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" /> PDF
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Image className="h-3 w-3" /> Image
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-muted/30 rounded-xl p-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {selectedFile.type.startsWith('image/') ? (
                          <Image className="h-5 w-5 text-primary shrink-0" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={clearFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {filePreview && (
                      <div className="rounded-xl overflow-hidden border border-border/40">
                        <img src={filePreview} alt="Report preview" className="w-full max-h-64 object-contain bg-muted/20" />
                      </div>
                    )}

                    <Button
                      onClick={analyzeReport}
                      disabled={isAnalyzing}
                      className="w-full gradient-health shadow-lg shadow-primary/20 gap-2"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Analyzing Report...
                        </>
                      ) : (
                        <>
                          <Stethoscope className="h-5 w-5" />
                          Analyze Report
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="shadow-card border-border/40 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: '📤', title: 'Upload Your Report', desc: 'Upload a medical report image or PDF document' },
                  { icon: '🤖', title: 'AI Analysis', desc: 'Our AI reads and identifies key health indicators' },
                  { icon: '📋', title: 'Get Insights', desc: 'Receive wellness guidance and preventive steps' },
                  { icon: '🩺', title: 'Consult Doctor', desc: 'Share insights with your healthcare provider' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <span className="text-2xl">{step.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Summary */}
              <Card className="shadow-card border-border/40 overflow-hidden">
                <div className="h-1 w-full gradient-health" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Analysis Results
                    </CardTitle>
                    <Badge variant={riskColor(analysis.overallRiskLevel)}>
                      {analysis.overallRiskLevel} Risk
                    </Badge>
                  </div>
                  <CardDescription>{analysis.reportSummary}</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Health Concerns */}
                <Card className="shadow-card border-border/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-4 w-4 text-destructive" />
                      Health Concerns Identified
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.healthConcerns.map((concern, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <Badge variant={riskColor(concern.severity)} className="shrink-0 mt-0.5">
                          {concern.severity}
                        </Badge>
                        <div>
                          <h4 className="font-medium text-sm">{concern.concern}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{concern.details}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Preventive Steps */}
                <Card className="shadow-card border-border/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4 text-success" />
                      Preventive Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {analysis.preventiveSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Lifestyle Corrections */}
                <Card className="shadow-card border-border/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Lifestyle Corrections
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {analysis.lifestyleCorrections.map((correction, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{correction}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Nutrition Guidance */}
                <Card className="shadow-card border-border/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Apple className="h-4 w-4 text-warning" />
                      Nutrition Guidance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {analysis.nutritionGuidance.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Follow Up & Disclaimer */}
              <Card className="shadow-card border-border/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">📌 Recommended Follow-Up Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.followUpActions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-warning/30 bg-warning/5">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{analysis.disclaimer}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
