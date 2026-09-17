import { Analytics } from "@vercel/analytics/react";
import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { PortalLayout } from "@/components/Layout/PortalLayout";
import { ChromelessLayout } from "@/components/Layout/ChromelessLayout";
import { PageLoading } from "@/components/Loading";
import { AuthProvider, useAuth } from "@/lib/auth";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Committees = lazy(() => import("./pages/Committees"));
const Officers = lazy(() => import("./pages/Officers"));
const Events = lazy(() => import("./pages/Events"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Create = lazy(() => import("./pages/Create"));
const Research = lazy(() => import("./pages/Research"));
const Educate = lazy(() => import("./pages/Educate"));
const HackUTA = lazy(() => import("./pages/HackUTA"));
const Marketing = lazy(() => import("./pages/Marketing"));
const Outreach = lazy(() => import("./pages/Outreach"));
const Community = lazy(() => import("./pages/Community"));
const Projects = lazy(() => import("./pages/Projects"));
const Apply = lazy(() => import("./pages/Apply"));
const ApplyDetail = lazy(() => import("./pages/ApplyDetail"));
const ApplyForm = lazy(() => import("./pages/ApplyForm"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Profile = lazy(() => import("./pages/Profile"));
const CheckIn = lazy(() => import("./pages/CheckIn"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Notifications = lazy(() => import("./pages/Notifications"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminApplicationForms = lazy(() => import("./pages/admin/AdminApplicationForms"));
const AdminApplicationBuilder = lazy(() => import("./pages/admin/AdminApplicationBuilder"));
const AdminApplicationSubmissions = lazy(() => import("./pages/admin/AdminApplicationSubmissions"));
const AdminMembers = lazy(() => import("./pages/admin/AdminMembers"));
const AdminTeams = lazy(() => import("./pages/admin/AdminTeams"));
const AdminMentorship = lazy(() => import("./pages/admin/AdminMentorship"));
const AdminRoster = lazy(() => import("./pages/admin/AdminRoster"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAuditLog = lazy(() => import("./pages/admin/AdminAuditLog"));
const AdminHackUTA = lazy(() => import("./pages/admin/AdminHackUTA"));
const AdminNews = lazy(() => import("./pages/admin/AdminNews"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
            <Suspense fallback={<PageLoading />}>
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
            </Suspense>
          </OnboardingGate>
        </AuthProvider>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
