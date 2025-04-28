import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Listings from "@/pages/Listings";
import PropertyDetail from "@/pages/PropertyDetail";
import Dashboard from "@/pages/Dashboard";
import HostDashboard from "@/pages/HostDashboard";
import CreateListing from "@/pages/CreateListing";
import AdminDashboard from "@/pages/AdminDashboard";
import Personas from "@/pages/Personas";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/listings" component={Listings} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/host/dashboard" component={HostDashboard} />
      <Route path="/host/create-listing" component={CreateListing} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/personas" component={Personas} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
