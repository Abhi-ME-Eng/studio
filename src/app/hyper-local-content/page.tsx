import { HyperLocalContentForm } from '@/components/forms/hyper-local-content-form';
import { PageHeader } from '@/components/shared/page-header';

export default function HyperLocalContentPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Hyper-Local Content Generation"
        description="Generate culturally relevant educational materials in various languages."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <HyperLocalContentForm />
      </div>
    </div>
  );
}
