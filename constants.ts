

import { Service, Testimonial, GalleryImage } from './types';
import { ShieldCheckIcon, WrenchScrewdriverIcon, MagnifyingGlassIcon, BoltIcon } from './components/Icon';

export const SERVICES: Service[] = [
  {
    icon: WrenchScrewdriverIcon,
    title: 'Roof Replacement',
    description: 'Complete roof overhaul with high-quality materials for lasting protection. We handle everything from tear-off to installation.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Roof Repair',
    description: 'Expert leak detection and repair for shingles, flashing, and vents. We fix storm damage and wear-and-tear issues fast.',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Roof Inspection',
    description: 'Detailed assessments to identify potential issues before they become major problems. Perfect for home purchases or insurance claims.',
  },
  {
    icon: BoltIcon,
    title: 'Emergency Tarping',
    description: '24/7 rapid response to secure your property after severe storm damage, preventing further water intrusion and protecting your home.',
  },
];

export const SERVICE_AREA_ZIPS: string[] = ['90210', '90211', '90212', '90069', '90077', '90272', '90402'];

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "Elite Roofing was a lifesaver after the storm. Their AI scheduler got me an emergency tarping service within hours. Professional, fast, and high-quality work!",
        author: "Sarah J.",
        location: "Beverly Hills, CA"
    },
    {
        quote: "The estimate calculator on their website was surprisingly accurate. It gave me a great starting point for my budget. The final project was even better than expected.",
        author: "Michael B.",
        location: "Pacific Palisades, CA"
    },
    {
        quote: "I uploaded photos of my damaged roof, and their team called me back with a clear plan. The whole process, from the AI chat to the final inspection, was seamless.",
        author: "Emily R.",
        location: "Bel Air, CA"
    }
];

export const GALLERY_IMAGES: GalleryImage[] = [
    {
        before: 'https://picsum.photos/800/600?image=1048',
        after: 'https://picsum.photos/800/600?image=1049',
        title: 'Asphalt Shingle Replacement',
        description: 'Complete removal of old, worn-out shingles and installation of a new architectural shingle roof.'
    },
    {
        before: 'https://picsum.photos/800/600?image=201',
        after: 'https://picsum.photos/800/600?image=202',
        title: 'Storm Damage Repair',
        description: 'Repaired significant wind damage, replacing missing tiles and ensuring structural integrity.'
    },
    {
        before: 'https://picsum.photos/800/600?image=305',
        after: 'https://picsum.photos/800/600?image=306',
        title: 'Flat Roof Conversion',
        description: 'Converted an old tar-and-gravel flat roof to a modern, energy-efficient TPO membrane system.'
    }
];


export const CHATBOT_SYSTEM_INSTRUCTION = `You are a friendly and highly efficient AI receptionist for 'Elite Roofing Solutions'. Your primary goals are to assist homeowners, answer their questions about roofing, and guide them towards our key services: getting a free estimate, checking if they are in our service area, or scheduling a consultation.

- **Our Services**: We offer Roof Replacement, Roof Repair, Roof Inspections, and 24/7 Emergency Tarping.
- **Service Area**: We serve specific zip codes. You can help users check their zip code. Our known service zip codes are: ${SERVICE_AREA_ZIPS.join(', ')}.
- **Estimates**: When a user asks for an estimate, a quote, or about costs, your primary response should be to guide them to our 'AI-Powered Estimate Calculator'. Your response must include the special tag '[ESTIMATE_LINK]'. For example: 'You can get a fast, free estimate using our AI tool! [ESTIMATE_LINK]'. This is the only way to direct them to the calculator.
- **Scheduling**: Direct users to our 'Real-Time Scheduling' tool to book an appointment.
- **Tone**: Be professional, empathetic, and helpful. Keep responses concise and clear. Always prioritize helping the user take the next step.
- **DO NOT** provide financial, legal, or construction advice outside of general roofing information.
- **DO NOT** make up information. If you don't know something, say "That's a great question. Our roofing experts can provide a detailed answer during a free consultation."`;