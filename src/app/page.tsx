import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, TrendingUp, BarChart, Sliders, ShieldCheck, FileText, Bot, Users, Globe, BookOpen, BrainCircuit } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex items-start gap-4">
    <div className="bg-primary/10 text-primary p-2 rounded-lg">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-lg font-semibold font-headline">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const InfoCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <Icon className="w-5 h-5" />
        </div>
        <CardTitle className="text-lg font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

export default function HomePage() {
  return (
    <AppLayout pageTitle="Welcome">
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary">
            Navigate Your Financial Future
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            An AI-powered platform to unify your financial data, generate powerful insights, and simulate future scenarios with confidence.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/chat">Chat with AI <ArrowRight className="ml-2" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/scenario-simulator">Simulate Scenarios</a>
            </Button>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-headline">Actionable Insights, Real-World Impact</h2>
            <p className="mt-2 text-muted-foreground">From planning retirement to optimizing loans, our AI agents are here to help.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={TrendingUp} title="Wealth Growth Tracker" description="Track and forecast your net worth over time, suggesting adjustments to improve your financial trajectory." />
            <FeatureCard icon={Bot} title="Smart Goal Planner" description="Ask questions like 'Can I retire at 55?' or 'How much do I need to save for a car in 3 years?'" />
            <FeatureCard icon={BarChart} title="Loan Comparison Assistant" description="Evaluate EMI, interest outgo, and tax benefits for various loan options to make the smartest choice." />
            <FeatureCard icon={FileText} title="Tax Optimization Advisor" description="Suggests tax-saving strategies based on your salary and investments before the financial year ends." />
            <FeatureCard icon={Sliders} title="SIP Rebalancer" description="Recommends changes in your mutual fund allocation based on risk, returns, and market trends." />
            <FeatureCard icon={BrainCircuit} title="Anomaly Detector" description="Flags unusual spikes in spending, investment withdrawals, or sudden changes in loan interest." />
          </div>
        </section>

        {/* Security and Data Section */}
        <section className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <div className="text-left">
                    <h2 className="text-3xl font-bold font-headline">Your Data, Your Control</h2>
                    <p className="mt-2 text-muted-foreground">Security and privacy are at the core of our platform. You decide what to share and with whom.</p>
                </div>
                <InfoCard icon={ShieldCheck} title="Secure Consent Model" description="We use an OAuth-based secure consent model for linking your financial accounts. Your credentials are never stored."/>
                <InfoCard icon={BookOpen} title="Granular Permissions" description="You can choose which data (e.g., only credit score, or only EPF) to share with which agent or tool."/>
            </div>
            <div className="space-y-6">
                <div className="text-left">
                    <h2 className="text-3xl font-bold font-headline">Comprehensive Data Support</h2>
                    <p className="mt-2 text-muted-foreground">Connect a wide range of financial accounts to get a true 360-degree view of your finances.</p>
                </div>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-muted-foreground">
                    {['Income & Salary', 'Real Estate', 'Gold Holdings', 'Insurance', 'UPI Spends', 'Recurring Expenses', 'Equity & Crypto', 'Tax History'].map(item => (
                        <li key={item} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" /> {item}
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        {/* Integration and Personas Section */}
        <section className="grid lg:grid-cols-2 gap-8 items-start">
             <div className="space-y-6">
                <div className="text-left">
                    <h2 className="text-3xl font-bold font-headline">Powerful Integrations</h2>
                    <p className="mt-2 text-muted-foreground">Connect your financial life to the tools you already use.</p>
                </div>
                <InfoCard icon={Globe} title="Connect Your Ecosystem" description="Export summaries to Google Sheets, get alerts on WhatsApp/Telegram, sync reminders with your Calendar, and get real-time insights in Google Pay."/>
            </div>
             <div className="space-y-6">
                <div className="text-left">
                    <h2 className="text-3xl font-bold font-headline">For Everyone on a Financial Journey</h2>
                    <p className="mt-2 text-muted-foreground">Tailored advice for every stage of life.</p>
                </div>
                <InfoCard icon={Users} title="Built for Diverse Needs" description="Perfect for young professionals starting to invest, families managing complex budgets, freelancers with variable income, and retirees protecting their capital."/>
            </div>
        </section>
      </div>
    </AppLayout>
  );
}
