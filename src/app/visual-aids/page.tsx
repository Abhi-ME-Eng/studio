import { VisualAidsForm } from '@/components/forms/visual-aids-form';
import { PageHeader } from '@/components/shared/page-header';

export default function VisualAidsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Visual Aid Generation"
        description="Create drawings, charts, and other visual aids from a simple description."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <VisualAidsForm />
      </div>
    </div>
  );
}
