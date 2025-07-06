import { KnowledgeBaseForm } from '@/components/forms/knowledge-base-form';
import { PageHeader } from '@/components/shared/page-header';

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Instant Knowledge Base"
        description="Get simple explanations for complex questions, complete with analogies."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <KnowledgeBaseForm />
      </div>
    </div>
  );
}
