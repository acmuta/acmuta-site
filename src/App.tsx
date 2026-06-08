import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Committees from "./pages/Committees";
import Officers from "./pages/Officers";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Album from "./pages/Album";
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
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/committees" element={<Committees />} />
            <Route path="/create" element={<Create />} />
            <Route path="/research" element={<Research />} />
            <Route path="/educate" element={<Educate />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/community" element={<Community />} />
            <Route path="/officers" element={<Officers />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/hackuta" element={<HackUTA />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:albumId" element={<Album />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
