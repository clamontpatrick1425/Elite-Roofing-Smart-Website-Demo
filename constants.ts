
import { Service, Testimonial, GalleryImage, FAQCategory } from './types';
import { ShieldCheckIcon, WrenchScrewdriverIcon, MagnifyingGlassIcon, BoltIcon } from './components/Icon';

export interface ExtendedGalleryImage extends GalleryImage {
    aiPrompt?: string;
}

export const SERVICES: Service[] = [
  {
    icon: WrenchScrewdriverIcon,
    title: 'Roof Replacement',
    description: 'Complete roof overhaul with premium architectural shingles for lasting protection. We handle everything from tear-off to solar-ready installations.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Roof Repair',
    description: 'Expert leak detection and rapid repair for shingles, flashing, and vents. We fix storm damage and wear-and-tear issues fast using high-grade sealants.',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Roof Inspection',
    description: 'Detailed assessments powered by AI and human expertise to identify potential issues before they become disasters. Ideal for home sales or claims.',
  },
  {
    icon: BoltIcon,
    title: 'Emergency Tarping',
    description: '24/7 rapid response to secure your property after severe storm damage, preventing water intrusion and mitigating further structural loss.',
  },
];

export const SERVICE_AREA_ZIPS: string[] = [
  '64012', '64013', '64014', '64015', '64016', '64024', '64029', '64030', '64048', '64050',
  '64051', '64052', '64053', '64054', '64055', '64056', '64057', '64058', '64060', '64062',
  '64063', '64064', '64066', '64068', '64069', '64070', '64074', '64075', '64076', '64077',
  '64078', '64079', '64080', '64081', '64082', '64083', '64084', '64085', '64086', '64088',
  '64089', '64090', '64093', '64096', '64097', '64098',
  '64101', '64102', '64105', '64106', '64108', '64110', '64111', '64112', '64113',
  '64114', '64116', '64117', '64118', '64119', '64120', '64121', '64123', '64124', '64125',
  '64126', '64127', '64128', '64129', '64129', '64130', '64131', '64132', '64133', '64134', '64136',
  '64137', '64138', '64139', '64141', '64144', '64145', '64146', '64147', '64148', '64149',
  '64150', '64151', '64152', '64153', '64154', '64155', '64156', '64157', '64158', '64161',
  '64163', '64164', '64165', '64166', '64167', '64168', '64170', '64171', '64179', '64180',
  '64184', '64187', '64188', '64190', '64191', '64195', '64196', '64199',
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
        quote: "Elite Roofing was a lifesaver after the storm. Their AI scheduler got me an emergency tarping service within hours.",
        author: "Sarah J.",
        location: "Beverly Hills, CA"
    },
    {
        quote: "The estimate calculator on their website was surprisingly accurate. It gave me a great starting point.",
        author: "Michael B.",
        location: "Pacific Palisades, CA"
    },
    {
        quote: "I uploaded photos of my damaged roof, and their team called me back with a clear plan.",
        author: "Emily R.",
        location: "Bel Air, CA"
    }
];

export const GALLERY_IMAGES: ExtendedGalleryImage[] = [
    {
        before: 'https://images.pexels.com/photos/1209990/pexels-photo-1209990.jpeg?auto=compress&cs=tinysrgb&w=800',
        after: 'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'Asphalt Shingle Replacement',
        description: 'Complete removal of old, worn-out shingles and installation of a new architectural shingle roof.',
        aiPrompt: "A high-resolution, side-by-side comparison of a residential home's roof. Left side (Before): Old, weathered gray asphalt shingles with visible curling, moss growth, and missing granules; cloudy overcast lighting. Right side (After): Brand new, high-definition architectural shingles in a deep charcoal black; crisp lines, perfect flashing, and bright sunny lighting. Photographed from a 45-degree drone angle to show texture and scale. Professional real estate photography style."
    },
    {
        before: 'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        after: 'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'Storm Damage Repair',
        description: 'Repaired significant wind damage, replacing missing tiles with modern impact-resistant materials.',
        aiPrompt: "A side-by-side comparison of a roof during storm damage repair. Left side: A house with massive storm damage, missing roof tiles, and debris. Right side: The same house with a perfectly repaired, modern impact-resistant tile roof. Professional drone photography."
    },
    {
        before: 'https://images.pexels.com/photos/159353/architecture-modern-house-exterior-glass-159353.jpeg?auto=compress&cs=tinysrgb&w=800',
        after: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'Flat Roof Conversion',
        description: 'Converted an old flat roof to a modern TPO membrane system for maximum energy efficiency.',
        aiPrompt: "A comparison of a commercial/residential flat roof conversion. Left: Cracked black tar paper roof. Right: Clean, bright white modern TPO membrane roof. High-end real estate angle."
    }
];


export const CHATBOT_SYSTEM_INSTRUCTION = `You are 'Hannah', a friendly AI Concierge for 'Elite Roofing Solutions'.

**STRICT ENGAGEMENT PROTOCOL:**
1. **Name Check:** Always ask for the user's name first.
2. **Wellness Check:** Once they name themselves, greet them by name and ask how they are.
3. **Assistance:** Only then ask how you can help.

**STRICT LEAD & APPOINTMENT COLLECTION:**
If an inspection or quote is requested, you MUST collect the property details ONE BY ONE in separate turns. Never ask for multiple address components at once.
1. **Street Address:** Ask "What is the street address (number and street name) of the property?"
2. **City:** Once they provide the street, ask "Which city is that located in?"
3. **State:** Once they provide the city, ask "And what is the state?"
4. **Zip Code:** Finally, ask "What is the 5-digit zip code for that address?"
5. **Preferred Schedule:** Ask "What day and time window would work best for our technician to visit?"
6. **Email:** Ask "What is your email address so we can send you a confirmation?"
7. **Phone:** Ask "Lastly, what's a good phone number where we can reach you?"

**FINAL CONFIRMATION:**
When ALL data is collected, you MUST provide a "Confirmation Summary". 
List the Name, Address, Time, and Contact details clearly.
State that our dispatcher will call them within 2 hours to confirm the technician's arrival.

**JSON Requirement:**
Return a valid JSON object with:
- "reply": The conversational text.
- "appointmentSummary": (Optional) If an appointment was just finalized, provide a structured object with: {"name", "address", "time", "email", "phone"}. Only include this on the final confirmation message.
`;

export const FAQ_DATA: FAQCategory[] = [
  {
    category: 'General Roofing Questions',
    items: [
      {
        question: 'How do I know if I need a new roof or just repairs?',
        answer: 'Signs include missing shingles, leaks, and roof age over 15–25 years.',
      },
      {
        question: 'How long does a roof replacement take?',
        answer: 'Most residential roofs are completed in 1–2 days.',
      },
    ],
  },
  {
    category: 'Cost & Financing',
    items: [
      {
        question: 'How much does a roof replacement cost?',
        answer: 'Cost depends on size and materials. We provide free quotes after an inspection.',
      },
    ],
  },
];

export const WEBSITE_AUDIT_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Growth Audit | Midwest Roofing Services</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #f3f4f6; color: #1f2937; }
        .page { background: white; max-width: 850px; margin: 40px auto; padding: 60px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 8px; }
        h1 { color: #1e40af; }
        h2 { border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; color: #1e3a8a; }
        .grade { font-size: 4rem; font-weight: 800; color: #dc2626; }
        .highlight { background-color: #fef3c7; padding: 2px 4px; border-radius: 4px; }
    </style>
</head>
<body class="p-4 md:p-8">
    <div class="page">
        <div class="flex justify-between items-start mb-12">
            <div>
                <h1 class="text-4xl font-black uppercase tracking-tight">Website Growth Audit</h1>
                <p class="text-xl text-gray-500 mt-2">Prepared for: <span class="font-bold text-gray-900">The Midwest Roofing Team</span></p>
                <p class="text-lg text-blue-600 font-medium">Focus: Turning website visitors into booked roofing jobs.</p>
            </div>
            <div class="text-right">
                <p class="text-xs font-bold text-gray-400 uppercase">Audit Grade</p>
                <div class="grade">C+</div>
            </div>
        </div>

        <section>
            <h2>1) Executive Summary (The "So What")</h2>
            <p class="text-lg leading-relaxed mb-4">
                Your website looks professional and established, but it acts more like a static brochure than a high-performing salesperson. It tells people who you are, but it doesn't do enough to <strong>convince them to call you right now.</strong>
            </p>
            <h3 class="font-bold text-xl mt-6 mb-3">Top 3 things hurting your leads right now:</h3>
            <ul class="list-decimal list-inside space-y-4 text-gray-700">
                <li><span class="font-bold">Passive Language:</span> The site waits for people to find the "Contact" page rather than guiding them there.</li>
                <li><span class="font-bold">Mobile Friction:</span> It's a bit difficult to "click-to-call" or fill out a form quickly on a smartphone.</li>
                <li><span class="font-bold">Local "Invisibility":</span> You aren't claiming enough territory in specific Kansas towns through your website's text.</li>
            </ul>
        </section>

        <section>
            <h2>2) First Impression & Clarity</h2>
            <div class="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600 mb-6">
                <p class="font-bold text-blue-900">The 5-Second Test:</p>
                <p class="text-blue-800 italic">"A visitor knows you do roofing immediately. However, they don't immediately see why they should choose you over the next guy."</p>
            </div>
            <ul class="space-y-4">
                <li><span class="font-bold">Main Call-to-Action:</span> Currently, it's a bit "quiet." We need a loud, clear invitation to start a project.</li>
                <li><span class="font-bold">Trust Signals:</span> You have a great BBB rating, but we need to see more "social proof" (customer faces or local house photos) right on the front page.</li>
            </ul>
        </section>

        <section>
            <h2>3) Recommendations</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p class="font-bold text-blue-600 mb-2">1. Change Headline</p>
                    <p class="text-sm">Use: "Reliable Roofing for Kansas Homeowners – Free Estimates & Quality Workmanship."</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p class="font-bold text-blue-600 mb-2">2. Move Phone Number</p>
                    <p class="text-sm">Put your phone number in a large, bold font at the very top right.</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p class="font-bold text-blue-600 mb-2">3. Add "Why Us" Row</p>
                    <p class="text-sm">Icons for: Fully Insured, A+ BBB Rating, and Local Family Owned.</p>
                </div>
            </div>
        </section>

        <section>
            <h2>4) Performance & Usability</h2>
            <p class="mb-4">Mobile Experience Score: <span class="font-bold text-orange-600">6/10</span></p>
            <div class="space-y-3 text-gray-600">
                <p>• <strong>Sticky Header:</strong> Keep the "Call Now" button at the top as they scroll.</p>
                <p>• <strong>Thumb-Friendly Buttons:</strong> Make all buttons at least 44 pixels tall.</p>
                <p>• <strong>Text-to-Quote:</strong> Add a button that lets them text you a photo of their roof damage.</p>
            </div>
        </section>

        <div class="mt-20 pt-10 border-t border-gray-100 text-center text-gray-400 text-sm">
            Audit by Calvin Patrick, Website Growth Specialist | &copy; 2025
        </div>
    </div>
</body>
</html>
`;
