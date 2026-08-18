import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import NotFound from '@/pages/not-found';
import { LoginPage, SignupPage } from '@/pages/auth';
import { AppPage } from '@/pages/app';
import { CalendarPage } from '@/pages/calendar';
import { RemindersPage } from '@/pages/reminders';
import { MemoryPage } from '@/pages/memory';
import { SettingsPage } from '@/pages/settings';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => { if (!isLoading) setLocation(user ? '/app' : '/login'); }, [isLoading, user, setLocation]);
  return <div data-testid="status-route-loading" className="min-h-[100dvh] bg-background" />;
}

function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={Home} />
    <Route path="/login" component={LoginPage} />
    <Route path="/signup" component={SignupPage} />
    <Route path="/app" component={AppPage} />
    <Route path="/app/calendar" component={CalendarPage} />
    <Route path="/app/reminders" component={RemindersPage} />
    <Route path="/app/memory" component={MemoryPage} />
    <Route path="/app/settings" component={SettingsPage} />
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><AuthProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter></AuthProvider><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;