import AnimatedBackground from "@/components/AnimatedBackground";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BarChart3,
  Stethoscope,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Users,
} from "lucide-react";
import { WellnessLogo } from "@/components/ui/WellnessLogo";

export default function LandingPage() {
  const features = [
    {
      icon: Activity,
      title: "Lifestyle Tracking",
      description:
        "Log sleep, exercise, diet, and stress daily with beautiful visualizations",
      gradient: "gradient-health",
    },
    {
      icon: Stethoscope,
      title: "AI Symptom Checker",
      description:
        "Get AI-powered health risk assessments and personalized recommendations",
      gradient: "gradient-energy",
    },
    {
      icon: BarChart3,
      title: "Community Insights",
      description:
        "See anonymized regional health trends and compare your progress",
      gradient: "gradient-purple",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "50+", label: "Health Metrics" },
    { value: "24/7", label: "AI Available" },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your health data is encrypted and never shared",
    },
    {
      icon: Zap,
      title: "Instant Insights",
      description: "Get real-time AI analysis of your health data",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Visualize your wellness journey over time",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Learn from anonymized community health trends",
    },
  ];

  const healthImages = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80",
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">

      {/* ✅ Animated Gradient Blobs */}
      <AnimatedBackground />

      {/* ✅ Floating Images Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95 z-10" />

        <div className="absolute inset-0 grid grid-cols-3 gap-4 p-6 opacity-60">
          {healthImages.map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl animate-float"
              style={{ animationDelay: `${i * -2}s` }}
            >
              <img
                src={img}
                alt="Health"
                className="w-full h-full object-cover scale-110 animate-zoom"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <header className="relative z-10">
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <WellnessLogo size="md" />
          <Link to="/auth">
            <Button variant="outline">Sign In</Button>
          </Link>
        </nav>

        <div className="max-w-5xl mx-auto text-center px-6 py-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Health Intelligence
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold mb-8">
            Your Personal
            <span className="block gradient-text">Health Companion</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Track your lifestyle, get AI health insights, and discover community wellness trends.
          </p>

          <Link to="/auth">
            <Button size="lg" className="gradient-health px-8 py-6 text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-20">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className={`h-16 w-16 rounded-2xl ${f.gradient} mb-6 flex items-center justify-center`}>
                <f.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t py-12 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <WellnessLogo size="sm" />
          <p className="text-sm text-muted-foreground">
            © 2026 WellnessAI. For informational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
