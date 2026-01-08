
import { Service, Testimonial, GalleryImage, FAQCategory } from './types';
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

export const SERVICE_AREA_ZIPS: string[] = [
  // Missouri - Kansas City & Surrounding (50-mile radius approx)
  '64012', '64013', '64014', '64015', '64016', '64024', '64029', '64030', '64048', '64050',
  '64051', '64052', '64053', '64054', '64055', '64056', '64057', '64058', '64060', '64062',
  '64063', '64064', '64066', '64068', '64069', '64070', '64074', '64075', '64076', '64077',
  '64078', '64079', '64080', '64081', '64082', '64083', '64084', '64085', '64086', '64088',
  '64089', '64090', '64093', '64096', '64097', '64098',
  '64101', '64102', '64105', '64106', '64108', '64109', '64110', '64111', '64112', '64113',
  '64114', '64116', '64117', '64118', '64119', '64120', '64121', '64123', '64124', '64125',
  '64126', '64127', '64128', '64129', '64130', '64131', '64132', '64133', '64134', '64136',
  '64137', '64138', '64139', '64141', '64144', '64145', '64146', '64147', '64148', '64149',
  '64150', '64151', '64152', '64153', '64154', '64155', '64156', '64157', '64158', '64161',
  '64163', '64164', '64165', '64166', '64167', '64168', '64170', '64171', '64179', '64180',
  '64184', '64187', '64188', '64190', '64191', '64195', '64196', '64199',
  // Kansas - Kansas City & Surrounding (50-mile radius approx)
  '66002', '66006', '66007', '66012', '66013', '66018', '66019', '66021', '66025', '66030',
  '66031', '66035', '66036', '66040', '66043', '66044', '66045', '66046', '66047', '66048',
  '66049', '66050', '66051', '66052', '66053', '66054', '66061', '66062', '66064', '66070',
  '66071', '66073', '66083', '66085', '66086', '66087', '66088', '66092',
  '66101', '66102', '66103', '66104', '66105', '66106', '66109', '66111', '66112', '66115',
  '66117', '66118', '66119', '66160',
  '66201', '66202', '66203', '66204', '66205', '66206', '66207', '66208', '66209', '66210',
  '66211', '66212', '66213', '66214', '66215', '66216', '66217', '66218', '66219', '66220',
  '66221', '66222', '66223', '66224', '66225', '66226', '66227', '66250', '66251', '66276',
  '66282', '66283', '66285', '66286'
];

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
        before: 'https://storage.googleapis.com/aistudio-hosting/generative-ai-app-builder/roofing_before_damaged_shingles.png',
        after: 'https://storage.googleapis.com/aistudio-hosting/generative-ai-app-builder/roofing_after_1.png',
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


export const CHATBOT_SYSTEM_INSTRUCTION = `You are 'Claire', a friendly and professional AI Concierge for 'Elite Roofing Solutions'.

**Your Identity:**
- Your name is Claire.
- You work for "Elite Roofing Solutions".
- Your company provides: Roof Replacement, Roof Repair, Roof Inspection, and Emergency Tarping.
- You can direct users to the AI Estimate tool by including the special tag [ESTIMATE_LINK] in your reply.

**Conversation Rules:**
1.  Your first message is fixed in the app. You've already introduced yourself, asked "who am I speaking with?", and asked "how can I help you today?".
2.  When the user responds, greet them by name if they provide one (e.g., "Hi John!"). If they state their problem, answer it directly and professionally.
3.  After the initial greeting, be helpful and answer questions about roofing.
4.  Keep your replies conversational and brief.

**Response Format:**
- You MUST respond with a JSON object.
- The JSON object must have two keys:
  1. "reply": (string) Your conversational response to the user.
  2. "suggestedQuestions": (string[]) An array of exactly three relevant, concise follow-up questions or actions the user might want to take. These should be short and direct (e.g., "Tell me about repairs.", "Book an inspection.").
- Example: { "reply": "We offer asphalt shingles, metal roofing, and tile.", "suggestedQuestions": ["What are the pros and cons?", "Tell me about pricing.", "Book a free inspection."] }

**Generating Suggested Questions (Very Important!):**
- Your primary goal is to guide the user. Questions MUST be highly relevant to the last user message and your reply.
- **Anticipate needs:** If you answer about a problem (like a leak), suggest a solution ("Book a repair inspection").
- **Offer comparisons:** If you describe one material (asphalt), suggest asking about another ("How is metal different?").
- **Invite detail:** If you give a summary, suggest asking for more ("Tell me more about the warranty.").
- **Drive action:** When appropriate, suggest a key action ("Can I get an AI estimate?", "Book a free inspection.").
- **Be diverse:** Do not repeat the same generic questions in every response. Make them contextual.
`;

export const FAQ_DATA: FAQCategory[] = [
  {
    category: 'General Roofing Questions',
    items: [
      {
        question: 'How do I know if I need a new roof or just repairs?',
        answer: 'Signs include missing or curling shingles, leaks, water stains on ceilings, granules in gutters, and roof age over 15–25 years. We can schedule a free inspection to evaluate your roof’s condition.',
      },
      {
        question: 'How long does a roof replacement take?',
        answer: 'Most residential roofs are completed in 1–2 days, depending on size, materials, and weather conditions.',
      },
      {
        question: 'What types of roofing materials do you offer?',
        answer: 'We offer asphalt shingles, architectural shingles, metal roofing, cedar shake, tile, and flat roof systems (TPO, EPDM, Modified Bitumen).',
      },
      {
        question: 'How long will a new roof last?',
        answer: 'Lifespan varies by material:\n- Asphalt shingles: 15–30 years\n- Architectural shingles: 25–40 years\n- Metal roofing: 40–70 years\nRegular maintenance helps maximize lifespan.',
      },
      {
        question: 'Do I need to be home during the roofing project?',
        answer: 'No — not necessary. We will keep you updated and ensure the area is clean and secure during and after the job.',
      },
    ],
  },
  {
    category: 'Cost & Financing',
    items: [
      {
        question: 'How much does a roof replacement cost?',
        answer: 'Cost depends on roof size, pitch, materials, and condition. We provide free quotes after an inspection.',
      },
      {
        question: 'Do you offer financing options?',
        answer: 'Yes, we offer flexible financing plans with low monthly payments. We’ll review all available options during your estimate.',
      },
      {
        question: 'Can you provide an itemized estimate?',
        answer: 'Yes — all quotes include material, labor, permits, and cleanup costs with no hidden fees.',
      },
    ],
  },
  {
    category: 'Insurance & Storm Damage',
    items: [
      {
        question: 'Can you help with insurance claims for storm damage?',
        answer: 'Yes. We guide you through the entire claims process and work directly with your insurance adjuster when needed.',
      },
      {
        question: 'What if my insurance claim is denied?',
        answer: 'We can review the denial and provide documentation or photos to support a re-evaluation if appropriate.',
      },
      {
        question: 'How quickly should I get my roof inspected after a storm?',
        answer: 'As soon as possible. Even small damage can worsen over time and affect insurance eligibility.',
      },
    ],
  },
  {
    category: 'Maintenance & Repairs',
    items: [
      {
        question: 'Do you offer roof inspections?',
        answer: 'Yes — we offer scheduled and post-storm inspections.',
      },
      {
        question: 'Do you provide emergency roof repair services?',
        answer: 'Yes, we offer urgent repairs for leaks, storm damage, and roof failures.',
      },
      {
        question: 'How often should I have my roof inspected?',
        answer: 'We recommend once per year, or after major weather events.',
      },
      {
        question: 'What are common signs of roof damage?',
        answer: 'Leaks, missing shingles, sagging areas, mold/mildew, granule loss, and dark spots on ceilings.',
      },
    ],
  },
  {
    category: 'Workmanship & Warranty',
    items: [
      {
        question: 'Do you offer warranties on your work?',
        answer: 'Yes — we provide manufacturer warranties on materials and workmanship warranties that vary by project.',
      },
      {
        question: 'Are you licensed and insured?',
        answer: 'Yes — we are fully licensed, insured, and compliant with local building codes.',
      },
      {
        question: 'How do you handle cleanup after installation?',
        answer: 'We protect landscaping, remove debris, and use magnetic sweepers to collect nails. Your property will be clean when we finish.',
      },
    ],
  },
  {
    category: 'Scheduling & Process',
    items: [
      {
        question: 'How soon can you start once I approve the quote?',
        answer: 'Typically within 1–2 weeks, depending on material availability and weather.',
      },
      {
        question: 'What does your installation process include?',
        answer: 'Tear-off (if needed), wood decking inspection, underlayment installation, roof installation, ventilation check, cleanup, and final inspection.',
      },
    ],
  },
];
