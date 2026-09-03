import { Analytics } from "@vercel/analytics/react";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { PortalLayout } from "@/components/Layout/PortalLayout";
import { ChromelessLayout } from "@/components/Layout/ChromelessLayout";
import { AuthProvider, useAuth } from "@/lib/auth";
import Index from "./pages/Index";
import About from "./pages/About";
import Committees from "./pages/Committees";
import Officers from "./pages/Officers";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Create from "./pages/Create";
import Research from "./pages/Research";
import Educate from "./pages/Educate";
import HackUTA from "./pages/HackUTA";
import Marketing from "./pages/Marketing";
import Outreach from "./pages/Outreach";
import Community from "./pages/Community";
import Projects from "./pages/Projects";
import Apply from "./pages/Apply";
import ApplyDetail from "./pages/ApplyDetail";
import ApplyForm from "./pages/ApplyForm";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import CheckIn from "./pages/CheckIn";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminApplicationForms from "./pages/admin/AdminApplicationForms";
import AdminApplicationBuilder from "./pages/admin/AdminApplicationBuilder";
import AdminApplicationSubmissions from "./pages/admin/AdminApplicationSubmissions";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminMentorship from "./pages/admin/AdminMentorship";
import AdminRoster from "./pages/admin/AdminRoster";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAuditLog from "./pages/admin/AdminAuditLog";
import AdminHackUTA from "./pages/admin/AdminHackUTA";
import AdminNews from "./pages/admin/AdminNews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Paths where the onboarding gate should not redirect
const GATE_EXCLUDED = [
  "/onboarding",
  "/auth/callback",
  "/reset-password",
  "/signin",
  "/signup",
];

// After sign-in, redirect users who haven't completed onboarding to /onboarding.
// This runs once - once profile.onboarded is true the gate is permanently inactive.
function OnboardingGate({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (loading || !user || profile === null) return;
    if (!profile.onboarded && !GATE_EXCLUDED.includes(pathname)) {
      navigate("/onboarding", { replace: true });
    }
  }, [user, profile, loading, pathname, navigate]);

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OnboardingGate>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/"            element={<Index />} />
                <Route path="/about"       element={<About />} />
                <Route path="/committees"  element={<Committees />} />
                <Route path="/create"      element={<Create />} />
                <Route path="/research"    element={<Research />} />
                <Route path="/educate"     element={<Educate />} />
                <Route path="/marketing"   element={<Marketing />} />
                <Route path="/outreach"    element={<Outreach />} />
                <Route path="/community"   element={<Community />} />
                <Route path="/officers"    element={<Officers />} />
                <Route path="/projects"    element={<Projects />} />
                <Route path="/hackuta"     element={<HackUTA />} />
                <Route path="/events"      element={<Events />} />
                <Route path="/gallery"     element={<Gallery />} />
                <Route path="/contact"     element={<Contact />} />
                <Route path="/apply"       element={<Apply />} />
                <Route path="/apply/:committeeSlug/:track" element={<ApplyDetail />} />
                <Route path="/apply/:committeeSlug/:track/:formId" element={<ApplyForm />} />
                <Route path="/checkin"          element={<CheckIn />} />
                <Route path="*"            element={<NotFound />} />
              </Route>

              <Route element={<ChromelessLayout />}>
                <Route path="/signin"      element={<SignIn />} />
                <Route path="/signup"      element={<SignUp />} />
                <Route path="/auth/callback"    element={<AuthCallback />} />
                <Route path="/reset-password"   element={<ResetPassword />} />
                <Route path="/onboarding"       element={<Onboarding />} />
              </Route>

              <Route element={<PortalLayout />}>
                <Route path="/profile"          element={<Profile />} />
                <Route path="/leaderboard"      element={<Leaderboard />} />
                <Route path="/notifications"    element={<Notifications />} />
              </Route>

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="applications" element={<AdminApplicationForms />} />
                <Route path="applications/builder" element={<AdminApplicationBuilder />} />
                <Route path="applications/builder/:formId" element={<AdminApplicationBuilder />} />
                <Route path="applications/:formId/submissions" element={<AdminApplicationSubmissions />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="teams" element={<AdminTeams />} />
                <Route path="mentorship" element={<AdminMentorship />} />
                <Route path="roster" element={<AdminRoster />} />
                <Route path="audit-log" element={<AdminAuditLog />} />
                <Route path="hackuta" element={<AdminHackUTA />} />
                <Route path="news" element={<AdminNews />} />
              </Route>
            </Routes>
          </OnboardingGate>
        </AuthProvider>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
