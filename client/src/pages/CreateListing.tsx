import { useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AfricanPattern } from "@/components/africanPatterns";
import { apiRequest } from "@/lib/queryClient";
import { insertPropertySchema } from "@shared/schema";
import { ArrowLeft, ArrowRight, Bed, Bath, Users, Upload, Info, Home } from "lucide-react";

// Extend the property schema with validation
const createPropertySchema = insertPropertySchema.extend({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  neighborhood: z.string().min(1, { message: "Neighborhood is required" }),
  city: z.string().min(1, { message: "City is required" }),
  propertyType: z.enum(["entire_apartment", "private_room", "shared_space"], {
    required_error: "Property type is required",
  }),
  pricePerNight: z.coerce.number().min(1000, { message: "Price must be at least ₦1,000" }),
  cleaningFee: z.coerce.number().optional(),
  maxGuests: z.coerce.number().min(1, { message: "Maximum guests must be at least 1" }),
  bedrooms: z.coerce.number().min(1, { message: "Number of bedrooms must be at least 1" }),
  beds: z.coerce.number().min(1, { message: "Number of beds must be at least 1" }),
  bathrooms: z.coerce.number().min(0.5, { message: "Number of bathrooms must be at least 0.5" }),
  amenities: z.array(z.string()).min(1, { message: "At least one amenity is required" }),
  houseRules: z.string().optional(),
  cancellationPolicy: z.enum(["flexible", "moderate", "strict"], {
    required_error: "Cancellation policy is required",
  }),
  images: z.array(z.string()).optional(),
});

type CreatePropertyFormValues = z.infer<typeof createPropertySchema>;

// List of common amenities
const amenitiesList = [
  "Wi-Fi",
  "Air Conditioning",
  "Kitchen",
  "Washing Machine",
  "TV",
  "Swimming Pool",
  "Free Parking",
  "Workspace",
  "Hot Water",
  "Refrigerator",
  "Microwave",
  "Security",
  "Balcony",
  "Garden",
  "Coffee Maker",
  "Iron",
  "Hair Dryer"
];

const CreateListing = () => {
  const [, navigate] = useLocation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  // Redirect if not logged in or not a host
  if (!isAuthLoading && !user) {
    navigate("/login");
    return null;
  }
  
  if (!isAuthLoading && user?.role !== "host" && user?.role !== "admin") {
    navigate("/become-host");
    return null;
  }
  
  // Set up form with react-hook-form and zod resolver
  const form = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      neighborhood: "",
      city: "Lagos",
      propertyType: "entire_apartment",
      pricePerNight: 0,
      cleaningFee: 0,
      maxGuests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: [],
      houseRules: "",
      cancellationPolicy: "moderate",
      images: [],
    },
  });
  
  // Handle image uploads
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = [...selectedImages, ...filesArray].slice(0, 10); // Limit to 10 images
      setSelectedImages(newImages);
      
      // Create preview URLs
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(newPreviewUrls);
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    const newPreviewUrls = [...imagePreviewUrls];
    
    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };
  
  // Create property mutation
  const createPropertyMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/properties", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create property");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Property Created!",
        description: "Your property has been submitted for approval.",
      });
      navigate("/host/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create property. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: CreatePropertyFormValues) => {
    if (selectedImages.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one image of your property.",
        variant: "destructive",
      });
      return;
    }
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'amenities') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Add images
    selectedImages.forEach(image => {
      formData.append("images", image);
    });
    
    // Send data to API
    createPropertyMutation.mutate(formData);
  };
  
  // Next step validation
  const goToNextStep = async () => {
    let canProceed = false;
    
    if (currentStep === 1) {
      canProceed = await form.trigger(['title', 'description', 'address', 'neighborhood', 'city', 'propertyType']);
    } else if (currentStep === 2) {
      canProceed = await form.trigger(['pricePerNight', 'cleaningFee', 'cancellationPolicy']);
    } else if (currentStep === 3) {
      canProceed = await form.trigger(['bedrooms', 'beds', 'bathrooms', 'maxGuests', 'amenities']);
    }
    
    if (canProceed) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <>
      <Helmet>
        <title>List Your Property | StayAfrika</title>
      </Helmet>
      
      <div className="min-h-screen bg-neutral-light">
        <AfricanPattern className="absolute inset-0 pointer-events-none" opacity={0.02} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => navigate("/host/dashboard")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold font-montserrat">List Your Property</h1>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    1
                  </div>
                  <span className="ml-2 font-medium hidden sm:inline">Basic Info</span>
                </div>
                <div className={`flex-grow border-t mx-2 ${currentStep >= 2 ? 'border-primary' : 'border-gray-200'}`}></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    2
                  </div>
                  <span className="ml-2 font-medium hidden sm:inline">Pricing</span>
                </div>
                <div className={`flex-grow border-t mx-2 ${currentStep >= 3 ? 'border-primary' : 'border-gray-200'}`}></div>
                <div className={`flex items-center ${currentStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    3
                  </div>
                  <span className="ml-2 font-medium hidden sm:inline">Features</span>
                </div>
                <div className={`flex-grow border-t mx-2 ${currentStep >= 4 ? 'border-primary' : 'border-gray-200'}`}></div>
                <div className={`flex items-center ${currentStep >= 4 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    4
                  </div>
                  <span className="ml-2 font-medium hidden sm:inline">Photos</span>
                </div>
              </div>
            </div>
            
            <Card className="mb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <>
                      <CardHeader>
                        <CardTitle>Basic Property Information</CardTitle>
                        <CardDescription>Tell us about your property and its location</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Title*</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., Modern Apartment in Lekki" {...field} />
                              </FormControl>
                              <FormDescription>
                                Create a title that highlights what makes your place special.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description*</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your property, its surroundings, and what makes it special..." 
                                  className="min-h-[120px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Provide a detailed description of your space, amenities, and the experience guests can expect.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="propertyType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Property Type*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select property type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="entire_apartment">Entire Apartment</SelectItem>
                                    <SelectItem value="private_room">Private Room</SelectItem>
                                    <SelectItem value="shared_space">Shared Space</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  What type of space will guests have?
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address*</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g., 123 Admiralty Way" {...field} />
                                </FormControl>
                                <FormDescription>
                                  This will not be shared publicly.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="neighborhood"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Neighborhood*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select neighborhood" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="lekki">Lekki</SelectItem>
                                    <SelectItem value="vi">Victoria Island</SelectItem>
                                    <SelectItem value="ikoyi">Ikoyi</SelectItem>
                                    <SelectItem value="yaba">Yaba</SelectItem>
                                    <SelectItem value="ikeja">Ikeja</SelectItem>
                                    <SelectItem value="surulere">Surulere</SelectItem>
                                    <SelectItem value="ajah">Ajah</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Lagos">Lagos</SelectItem>
                                    <SelectItem value="Abuja">Abuja</SelectItem>
                                    <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </>
                  )}
                  
                  {/* Step 2: Pricing Information */}
                  {currentStep === 2 && (
                    <>
                      <CardHeader>
                        <CardTitle>Pricing & Policies</CardTitle>
                        <CardDescription>Set your rates and cancellation policy</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="pricePerNight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price Per Night (₦)*</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" placeholder="E.g., 25000" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Set a competitive nightly rate in Nigerian Naira.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cleaningFee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cleaning Fee (₦)</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" placeholder="E.g., 5000" {...field} />
                                </FormControl>
                                <FormDescription>
                                  One-time fee for cleaning your space between guests.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="cancellationPolicy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cancellation Policy*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select cancellation policy" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="flexible">Flexible (Full refund 1 day prior to arrival)</SelectItem>
                                  <SelectItem value="moderate">Moderate (Full refund 5 days prior to arrival)</SelectItem>
                                  <SelectItem value="strict">Strict (Non-refundable)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose the cancellation policy that works best for you.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="flex items-start">
                            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                            <div>
                              <h3 className="font-medium text-blue-800">Price Recommendations</h3>
                              <p className="text-sm text-blue-700">
                                Properties in your area typically rent for ₦20,000 - ₦60,000 per night. Setting a competitive price can help you get more bookings, especially when starting out.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  )}
                  
                  {/* Step 3: Property Features */}
                  {currentStep === 3 && (
                    <>
                      <CardHeader>
                        <CardTitle>Property Features & Amenities</CardTitle>
                        <CardDescription>Tell guests about the features of your property</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Bed className="h-4 w-4" /> Bedrooms*
                                </FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="beds"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Bed className="h-4 w-4" /> Beds*
                                </FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Bath className="h-4 w-4" /> Bathrooms*
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    step="0.5" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Use 0.5 for half bathrooms
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="maxGuests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Users className="h-4 w-4" /> Maximum Guests*
                              </FormLabel>
                              <FormControl>
                                <Input type="number" min="1" max="20" {...field} />
                              </FormControl>
                              <FormDescription>
                                The maximum number of guests your property can accommodate
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator />
                        
                        <FormField
                          control={form.control}
                          name="amenities"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-base">Amenities*</FormLabel>
                                <FormDescription>
                                  Select all amenities available at your property
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {amenitiesList.map((amenity) => (
                                  <FormField
                                    key={amenity}
                                    control={form.control}
                                    name="amenities"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={amenity}
                                          className="flex flex-row items-start space-x-3 space-y-0 p-2 rounded-md hover:bg-muted/50"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(amenity)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, amenity])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== amenity
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal cursor-pointer">
                                            {amenity}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="houseRules"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>House Rules (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="E.g., No smoking, quiet hours after 10 PM, etc." 
                                  className="min-h-[100px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Let guests know about any specific rules or guidelines for your property.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </>
                  )}
                  
                  {/* Step 4: Photos */}
                  {currentStep === 4 && (
                    <>
                      <CardHeader>
                        <CardTitle>Property Photos</CardTitle>
                        <CardDescription>Upload high-quality photos of your property (Max: 10 images)</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <h3 className="font-medium mb-1">Drag photos here or click to upload</h3>
                          <p className="text-sm text-gray-500 mb-4">Upload clear, bright photos to showcase your space</p>
                          <Input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          <label htmlFor="image-upload">
                            <Button type="button" variant="outline" className="cursor-pointer">
                              Choose Photos
                            </Button>
                          </label>
                        </div>
                        
                        {imagePreviewUrls.length > 0 && (
                          <div>
                            <h3 className="font-medium mb-2">Selected Photos ({imagePreviewUrls.length}/10)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {imagePreviewUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={url}
                                    alt={`Property preview ${index + 1}`}
                                    className="h-32 w-full object-cover rounded-md"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(index)}
                                  >
                                    ×
                                  </button>
                                  {index === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-primary/70 text-white text-xs text-center py-1">
                                      Cover Photo
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                          <div className="flex items-start">
                            <Info className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                            <div>
                              <h3 className="font-medium text-amber-800">Photo Tips</h3>
                              <ul className="text-sm text-amber-700 list-disc pl-5 space-y-1 mt-1">
                                <li>Use landscape orientation for better visibility</li>
                                <li>Include photos of all rooms, bathroom, and kitchen</li>
                                <li>Take photos during daytime for natural lighting</li>
                                <li>Show the exterior of the property and any special features</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  )}
                  
                  <CardFooter className="flex justify-between pt-2">
                    {currentStep > 1 ? (
                      <Button type="button" variant="outline" onClick={goToPreviousStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                    ) : (
                      <Button type="button" variant="outline" onClick={() => navigate("/host/dashboard")}>
                        Cancel
                      </Button>
                    )}
                    
                    {currentStep < 4 ? (
                      <Button type="button" onClick={goToNextStep}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90"
                        disabled={createPropertyMutation.isPending || selectedImages.length === 0}
                      >
                        {createPropertyMutation.isPending ? "Creating..." : "Create Listing"}
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Form>
            </Card>
            
            {/* Help Box */}
            <div className="p-6 bg-secondary/5 rounded-lg">
              <div className="flex items-start">
                <Home className="h-6 w-6 text-secondary mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about listing your property, our host support team is ready to assist you.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline">Visit Help Center</Button>
                    <Button variant="outline">Contact Support</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateListing;
