'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, Calendar, ShoppingCart, Book, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils/cn';

interface NavigationProps {
  onSettingsClick: () => void;
}

export function Navigation({ onSettingsClick }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Generate', icon: ChefHat },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/shopping-list', label: 'Shopping', icon: ShoppingCart },
  ];

  return (
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">Recipe Generator</h1>
            </Link>

            <nav className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex gap-2">
            <Link href="/library">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                Library
              </Button>
            </Link>
            <Button
              onClick={onSettingsClick}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}