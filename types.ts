

export interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  location: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface EstimateFormData {
  roofType: string;
  sqft: string;
  slope: string;
  stories: string;
  zipCode: string;
  email: string;
}

export interface GalleryImage {
    before: string;
    after: string;
    title: string;
    description: string;
}