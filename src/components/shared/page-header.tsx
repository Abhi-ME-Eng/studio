import { cn } from '@/lib/utils';
import { SidebarTrigger } from '../ui/sidebar';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children, className, ...props }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 sm:p-6 md:p-8 border-b',
        className
      )}
      {...props}
    >
      <div className="grid gap-1">
        <div className="flex items-center gap-2">
           <SidebarTrigger className="md:hidden"/>
           <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">{title}</h1>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}
