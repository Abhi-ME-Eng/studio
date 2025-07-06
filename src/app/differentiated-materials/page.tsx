import { DifferentiatedMaterialsForm } from '@/components/forms/differentiated-materials-form';
import { PageHeader } from '@/components/shared/page-header';

export default function DifferentiatedMaterialsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Differentiated Material Creation"
        description="Upload a textbook page to create worksheets for different grade levels."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <DifferentiatedMaterialsForm />
      </div>
    </div>
  );
}
