import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, Globe, GraduationCap, BrainCircuit, Paintbrush, History } from 'lucide-react';

const features = [
  {
    href: '/hyper-local-content',
    label: 'Hyper-Local Content',
    description: 'Generate culturally relevant materials in various languages.',
    icon: Globe,
  },
  {
    href: '/differentiated-materials',
    label: 'Differentiated Materials',
    description: 'Create worksheets tailored for different grade levels.',
    icon: GraduationCap,
  },
  {
    href: '/knowledge-base',
    label: 'Knowledge Base',
    description: 'Get simple explanations for complex questions.',
    icon: BrainCircuit,
  },
  {
    href: '/visual-aids',
    label: 'Visual Aids',
    description: 'Generate drawings and charts from descriptions.',
    icon: Paintbrush,
  },
  {
    href: '/history',
    label: 'Interaction History',
    description: 'Review your past requests and generated content.',
    icon: History,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Welcome to Sahayak AI"
        description="Your AI-powered assistant for education. Choose a tool to get started."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.href} className="group">
              <Card className="h-full hover:border-primary/80 hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <div className="bg-primary/10 p-2 rounded-md">
                         <feature.icon className="h-6 w-6 text-primary" />
                       </div>
                       <CardTitle>{feature.label}</CardTitle>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
