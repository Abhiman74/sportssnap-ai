'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  ImageIcon,
  Zap,
  Target,
  Brain,
  Camera,
  ArrowRight,
  Star,
  CheckCircle,
  Sparkles,
  Heart,
} from "lucide-react";
import Link from "next/link";

export default function SportsRecognitionLanding() {
  // --- START: Logic for the component ---
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<{ sport: string; confidence: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPrediction(null);
      setError(null);
      handlePredict(selectedFile);
    }
  };

  const handlePredict = async (selectedFile: File) => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error("API request failed. Make sure the backend server is running.");
      }
      const data = await response.json();
      setPrediction(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubscription = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormMessage("Subscribing...");

      try {
        const response = await fetch('http://127.0.0.1:8000/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email }),
        });
        const data = await response.json();
        setFormMessage(data.message);
      } catch (err) {
        setFormMessage("Failed to subscribe. Please try again.");
      }
    };
  // --- END: Logic for the component ---

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <Input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*"
      />
      
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-orange-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            SportSnap
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-orange-600 transition-colors text-amber-800">
            Features
          </Link>
          <Link href="#demo" className="text-sm font-medium hover:text-orange-600 transition-colors text-amber-800">
            Try Magic ✨
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-orange-600 transition-colors text-amber-800">
            Pricing
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full opacity-60 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-300 to-yellow-200 rounded-full opacity-40 blur-3xl"></div>
          </div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 hover:from-orange-200 hover:to-amber-200 border-orange-300 shadow-sm">
                    🏆 AI Magic for Sports Recognition
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl/none">
                    Snap, Upload,{" "}
                    <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                      Discover
                    </span>
                    <br />
                    <span className="text-amber-800">Any Sport! 🎯</span>
                  </h1>
                  <p className="max-w-[600px] text-amber-700 md:text-xl leading-relaxed">
                    Turn any sports photo into instant knowledge! Our AI wizard recognizes 50+ sports faster than you
                    can say "touchdown" ⚡
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={triggerFileSelect}
                  >
                    ✨ Try the Magic
                    <Upload className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section id="demo" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300 shadow-sm">
                    🎮 Live Demo Zone
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-amber-900 mt-4">
                    Ready to Be Amazed? 🤯
                </h2>
                <p className="max-w-[600px] text-amber-700 md:text-xl leading-relaxed mt-4">
                    Don't just take our word for it - experience the magic yourself! Upload any sports photo and prepare
                    to be blown away! 🎆
                </p>
            </div>
            <div className="w-full max-w-md mx-auto">
              <div 
                onClick={triggerFileSelect} 
                className="border-3 border-dashed border-amber-300 rounded-2xl p-8 text-center bg-gradient-to-br from-white/90 to-amber-50/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-amber-400 hover:scale-105 cursor-pointer"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                  <Upload className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-amber-800">
                  {isLoading ? "Analyzing..." : "🎯 Click to Upload!"}
                </h3>
                <p className="text-amber-600 text-sm">
                  {isLoading ? "Please wait..." : "And watch our AI work its magic! ✨"}
                </p>
              </div>
              
              <div className="mt-6">
                {error && (
                  <div className="p-4 bg-red-100 rounded-xl border-2 border-red-300 shadow-lg">
                    <p className="font-bold text-red-700 text-lg">Error: {error}</p>
                  </div>
                )}
                {prediction && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-green-700 text-lg">{prediction.sport}</p>
                        <p className="text-sm text-green-600">Confidence: {prediction.confidence}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --- START: Features Section --- */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-orange-100 to-amber-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-amber-200 to-orange-200 text-amber-800 border-amber-300 shadow-sm">
                  ✨ Amazing Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-amber-900">
                  Why Everyone's Obsessed with SportSnap 🤩
                </h2>
                <p className="max-w-[900px] text-amber-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI doesn't just recognize sports - it makes you feel like a sports genius! ⚡
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-orange-300">
                <CardHeader className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-amber-900 text-xl">⚡ Lightning Speed</CardTitle>
                  <CardDescription className="text-amber-700 text-base">
                    Get results faster than a cheetah on Red Bull. Under 2 seconds guaranteed! 🚀
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-orange-300">
                <CardHeader className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-amber-900 text-xl">🎯 High Accuracy</CardTitle>
                  <CardDescription className="text-amber-700 text-base">
                    With an accuracy rate of 99.2%, our AI rarely misses the mark. Trustworthy and reliable results every time.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-orange-300">
                <CardHeader className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-amber-900 text-xl">🧠 Smart AI Brain</CardTitle>
                  <CardDescription className="text-amber-700 text-base">
                    Trained on millions of diverse images, our model understands context, lighting, and tricky angles.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        {/* --- END: Features Section --- */}
        
        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-white to-amber-50">
           {/* ... Your pricing section JSX goes here ... */}
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden"><div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div><div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl text-white">
                  Ready to Become a Sports Detective? 🕵️‍♂️
                </h2>
                <p className="mx-auto max-w-[600px] text-orange-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join 10,000+ sports enthusiasts who are already using SportSnap to identify any sport instantly!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-3">
                <form className="flex gap-2" onSubmit={handleSubscription}>
                  <Input
                    type="email"
                    placeholder="Enter your email for magic ✨"
                    className="max-w-lg flex-1 bg-white/20 border-white/30 text-white placeholder:text-orange-100 backdrop-blur-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg font-semibold"
                  >
                    🎯 Start Magic
                  </Button>
                </form>
                {formMessage && (<p className="text-xs text-white">{formMessage}</p>)}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <p className="text-xs text-amber-700">© 2025 SportSnap. Made with ❤️ for sports lovers everywhere.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-amber-600 hover:text-amber-800">
            Terms of Magic
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-amber-600 hover:text-amber-800">
            Privacy Promise
          </Link>
        </nav>
      </footer>
    </div>
  )
}