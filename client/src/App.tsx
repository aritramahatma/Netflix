import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MoviePage from "@/pages/MoviePage";
import GenrePage from "@/pages/GenrePage";
import { useEffect } from "react";
import Footer from './components/Footer';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/movie/:id" component={MoviePage} />
      <Route path="/genre/:id" component={GenrePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Set the document title
  useEffect(() => {
    document.title = "404 Movie - Netflix-inspired Movie Platform";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      <Footer />
    </QueryClientProvider>
  );
}

export default App;