'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from '@/components/ui/sidebar';
import {
  Home,
  BookMarked,
  Globe,
  GraduationCap,
  BrainCircuit,
  Paintbrush,
  History,
  Loader2,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/components/ui/sidebar';

const links = [
  {
    href: '/home',
    label: 'Home',
    icon: Home,
    tooltip: 'Home',
  },
  {
    href: '/hyper-local-content',
    label: 'Hyper-Local Content',
    icon: Globe,
    tooltip: 'Hyper-Local Content',
  },
  {
    href: '/differentiated-materials',
    label: 'Differentiated Materials',
    icon: GraduationCap,
    tooltip: 'Differentiated Materials',
  },
  {
    href: '/knowledge-base',
    label: 'Knowledge Base',
    icon: BrainCircuit,
    tooltip: 'Knowledge Base',
  },
  {
    href: '/visual-aids',
    label: 'Visual Aids',
    icon: Paintbrush,
    tooltip: 'Visual Aids',
  },
  { href: '/history', label: 'History', icon: History, tooltip: 'History' },
];

export function SidebarNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
       <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <BookMarked className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold font-headline">Sahayak AI</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.tooltip}
                onClick={handleLinkClick}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
