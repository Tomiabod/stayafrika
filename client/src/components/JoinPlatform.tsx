import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { insertWaitlistSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Home, Briefcase } from "lucide-react";
import { Link } from "wouter";

// Extend the schema with client-side validation
const waitlistFormSchema = insertWaitlistSchema.extend({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  city: z.string().min(1, { message: "Please select a city" }),
  subscribeToNewsletter: z.boolean().default(false),
});

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

const JoinPlatform = () => {
  const { toast } = useToast();
  
  // Set up form with react-hook-form and zod resolver
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      city: "lagos",
      subscribeToNewsletter: false,
    },
  });
  
  // Set up mutation for form submission
  const waitlistMutation = useMutation({
    mutationFn: async (data: WaitlistFormValues) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you for joining our waitlist!",
        description: "We'll notify you when we launch in your city.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: WaitlistFormValues) => {
    waitlistMutation.mutate(data);
  };
  
  return (
    <section className="py-20 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6">Join the StayAfrika Community</h2>
            <p className="text-lg mb-8 text-gray-100">Whether you're looking for a place to stay or want to host your property, StayAfrika connects you with authentic African hospitality.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-accent text-3xl mb-4">
                  <Home className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold font-montserrat mb-2">Become a Host</h3>
                <p className="text-gray-200 mb-4">Earn extra income by sharing your space with travelers.</p>
                <Link href="/become-host">
                  <a className="inline-block text-accent hover:underline">
                    Learn more <ArrowRight className="ml-1 h-4 w-4 inline" />
                  </a>
                </Link>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-accent text-3xl mb-4">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold font-montserrat mb-2">Find a Stay</h3>
                <p className="text-gray-200 mb-4">Discover unique spaces with all the comforts of home.</p>
                <Link href="/listings">
                  <a className="inline-block text-accent hover:underline">
                    Browse listings <ArrowRight className="ml-1 h-4 w-4 inline" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 p-6 md:p-8 rounded-xl backdrop-blur-sm">
            <h3 className="text-2xl font-bold font-montserrat mb-6">Join our waitlist</h3>
            <p className="mb-6">Be the first to know when we launch in your city. Get early access and exclusive offers.</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white" 
                          placeholder="Your name" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white" 
                          placeholder="your@email.com" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">City</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white">
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lagos">Lagos</SelectItem>
                          <SelectItem value="abuja">Abuja</SelectItem>
                          <SelectItem value="accra">Accra</SelectItem>
                          <SelectItem value="nairobi">Nairobi</SelectItem>
                          <SelectItem value="capetown">Cape Town</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subscribeToNewsletter"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="leading-none">
                        <FormLabel className="text-sm font-normal">
                          I'd like to receive updates, travel tips, and exclusive offers from StayAfrika.
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition duration-300"
                  disabled={waitlistMutation.isPending}
                >
                  {waitlistMutation.isPending ? "Processing..." : "Join Waitlist"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Import ArrowRight here to avoid circular dependencies
import { ArrowRight } from "lucide-react";

export default JoinPlatform;
