import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, HelpCircle, Layers, ArrowRight, Crown, Activity, Sparkles } from 'lucide-react'

const page = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Words Management',
      description: 'Comprehensive word database with definitions, examples, and difficulty levels',
      href: '/words',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      icon: Layers,
      title: 'Phrasal Verbs',
      description: 'Manage phrasal verbs and expressions with meanings and examples',
      href: '/phrasal-verbs',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      icon: HelpCircle,
      title: 'Questions Bank',
      description: 'Create and manage vocabulary questions for practice and assessments',
      href: '/questions',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(128, 128, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(128, 128, 128, 0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Admin Portal</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Best Vocabulary
              <span className="block text-muted-foreground mt-2 text-2xl sm:text-3xl font-normal">
                Admin Center
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Manage your vocabulary database, content, and questions with an intuitive and powerful interface
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild size="lg" className="rounded-xl">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link href="/words" className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Browse Words
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Everything You Need to Manage
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive tools for vocabulary management, content curation, and question creation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="group h-full border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="border bg-card">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="inline-flex p-3 rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">10K+</h3>
                <p className="text-sm text-muted-foreground">Words Available</p>
              </div>
              <div className="space-y-2">
                <div className="inline-flex p-3 rounded-xl bg-emerald-500/10">
                  <Layers className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">500+</h3>
                <p className="text-sm text-muted-foreground">Phrasal Verbs</p>
              </div>
              <div className="space-y-2">
                <div className="inline-flex p-3 rounded-xl bg-amber-500/10">
                  <HelpCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">200+</h3>
                <p className="text-sm text-muted-foreground">Practice Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Best Vocabulary Admin</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
