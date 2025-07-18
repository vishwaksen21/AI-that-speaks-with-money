
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, Bot, Users, ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: 'Smart Goal Planner',
      description: 'Plan your financial goals with AI. "Can I retire at 55?" or "How much for a car in 3 years?"',
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: 'Tax Optimization Advisor',
      description: 'Get AI-powered suggestions for tax-saving strategies based on your salary and investments.',
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: 'Loan Comparison Assistant',
      description: 'Evaluate loan options by comparing EMI, interest, and tax benefits to make informed decisions.',
    },
  ];

  return (
    <AppLayout pageTitle="Home">
        <div className="space-y-16 md:space-y-24">
            {/* Hero Section */}
            <section className="text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight mb-4">
                        Navigate Your Financial Future with AI
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Your personal AI-powered guide for smart investing, goal planning, and wealth creation. Make informed decisions with confidence.
                    </p>
                    <Link href="/dashboard">
                        <Button size="lg">
                            Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

             {/* Features Section */}
            <section id="features" className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose Us?</h2>
                    <p className="text-muted-foreground mt-2">Powerful tools to help you achieve financial freedom.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <Card key={feature.title} className="text-center">
                            <CardHeader>
                                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                                    {feature.icon}
                                </div>
                                <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

             {/* Security Section */}
            <section id="security" className="bg-secondary py-16">
                 <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Security &amp; Privacy First</h2>
                        <p className="text-muted-foreground mt-4 mb-6">
                            Your data security is our top priority. We use industry-leading protocols to ensure your financial information is always safe, secure, and under your control.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <Shield className="w-6 h-6 text-primary mr-3 shrink-0 mt-1" />
                                <span><strong>Secure Consent Model:</strong> OAuth-based secure consent for linking financial accounts.</span>
                            </li>
                            <li className="flex items-start">
                                <Shield className="w-6 h-6 text-primary mr-3 shrink-0 mt-1" />
                                <span><strong>Zero Data Retention:</strong> We don't store your data on third-party models without your explicit consent.</span>
                            </li>
                             <li className="flex items-start">
                                <Shield className="w-6 h-6 text-primary mr-3 shrink-0 mt-1" />
                                <span><strong>Granular Permissions:</strong> You choose exactly what data to share with each AI agent or tool.</span>
                            </li>
                        </ul>
                    </div>
                     <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                        <Image src="/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstatic.aiprompt.io%2F5c7cf1c5-e51c-4b17-a006-2182061217e1.png&w=3840&q=75" alt="Security & Privacy First shield" layout="fill" objectFit="cover" />
                    </div>
                </div>
            </section>


            {/* Personas Section */}
            <section id="personas" className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Built For Everyone</h2>
                     <p className="text-muted-foreground mt-2">No matter your financial journey, our AI is here to help.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                   <Card>
                       <CardHeader>
                           <Users className="w-8 h-8 text-primary" />
                           <CardTitle className="font-headline mt-2 text-lg">Young Professionals</CardTitle>
                       </CardHeader>
                       <CardContent>
                           <p className="text-muted-foreground text-sm">Looking to start investing and build wealth early.</p>
                       </CardContent>
                   </Card>
                    <Card>
                       <CardHeader>
                           <Users className="w-8 h-8 text-primary" />
                           <CardTitle className="font-headline mt-2 text-lg">Families</CardTitle>
                       </CardHeader>
                       <CardContent>
                           <p className="text-muted-foreground text-sm">Managing expenses, EMIs, and planning for the future.</p>
                       </CardContent>
                   </Card>
                    <Card>
                       <CardHeader>
                           <Users className="w-8 h-8 text-primary" />
                           <CardTitle className="font-headline mt-2 text-lg">Freelancers</CardTitle>
                       </CardHeader>
                       <CardContent>
                           <p className="text-muted-foreground text-sm">Juggling inconsistent income streams and tax planning.</p>
                       </CardContent>
                   </Card>
                    <Card>
                       <CardHeader>
                           <Users className="w-8 h-8 text-primary" />
                           <CardTitle className="font-headline mt-2 text-lg">Retirees</CardTitle>
                       </CardHeader>
                       <CardContent>
                           <p className="text-muted-foreground text-sm">Focused on stable returns and protecting their capital.</p>
                       </CardContent>
                   </Card>
                </div>
            </section>

             {/* Testimonial Section */}
            <section className="bg-secondary py-16">
                 <div className="container mx-auto px-4 text-center">
                     <h2 className="text-3xl md:text-4xl font-bold font-headline">Loved by Users Worldwide</h2>
                     <p className="text-muted-foreground mt-2 mb-8 max-w-2xl mx-auto">Don't just take our word for it. Here's what our users have to say about their experience.</p>
                    <Card className="max-w-3xl mx-auto text-left">
                        <CardHeader className="flex-row items-center gap-4">
                            <Image src="https://placehold.co/100x100.png" alt="User avatar" width={56} height={56} className="rounded-full" data-ai-hint="person portrait" />
                            <div>
                                <CardTitle className="font-headline text-xl">Sarah K.</CardTitle>
                                <div className="flex text-yellow-500 mt-1">
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="italic text-muted-foreground">"This app has been a game-changer for my financial planning. The AI-powered scenario simulator helped me understand the impact of my investment choices clearly. Highly recommended!"</p>
                        </CardContent>
                    </Card>
                 </div>
            </section>
        </div>
    </AppLayout>
  );
