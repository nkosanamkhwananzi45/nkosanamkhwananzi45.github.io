export interface ServicePackage {
  name: string;
  price: number | null;
  priceLabel: string;
  features: string[];
  badge?: "Most Popular" | "Best Value";
  isCustom?: boolean;
}

export interface ServiceCategory {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  highlight: string;
  icon: string;
  startingPrice: string;
  packages: ServicePackage[];
  heroTagline: string;
}

export const services: ServiceCategory[] = [
  {
    slug: "academic",
    title: "Academic Support",
    shortTitle: "Academic",
    description: "Assignment support, exam preparation, and tutoring for all South African institutions.",
    highlight: "Assignment Specialist",
    icon: "GraduationCap",
    startingPrice: "R600",
    heroTagline: "Assignment Support That Actually Works",
    packages: [
      {
        name: "2 Assignments",
        price: 600,
        priceLabel: "R600",
        features: ["2 assignment submissions", "All institutions supported", "Plagiarism-free guidance", "WhatsApp support"],
      },
      {
        name: "4 Assignments",
        price: 900,
        priceLabel: "R900",
        badge: "Most Popular",
        features: ["4 assignment submissions", "All institutions supported", "Plagiarism-free guidance", "Priority WhatsApp support", "Free referencing check"],
      },
      {
        name: "Full Semester",
        price: 1500,
        priceLabel: "R1,500",
        badge: "Best Value",
        features: ["All semester assignments", "All institutions supported", "Plagiarism-free guidance", "Priority WhatsApp support", "Free referencing check", "Exam preparation notes"],
      },
    ],
  },
  {
    slug: "ecd",
    title: "ECD Online Training",
    shortTitle: "ECD Training",
    description: "Comprehensive training for ECD Level 4 & 5 practitioners with live Teams sessions.",
    highlight: "Live Sessions",
    icon: "Baby",
    startingPrice: "R600",
    heroTagline: "Empowering Early Childhood Practitioners",
    packages: [
      {
        name: "5-Month Teams Access",
        price: 600,
        priceLabel: "R600",
        features: ["5 months Teams access", "Tue–Thu sessions (21:00–22:00)", "WhatsApp Q&A group", "Community vacancy updates"],
      },
      {
        name: "Full Year Teams Access",
        price: 900,
        priceLabel: "R900",
        badge: "Best Value",
        features: ["12 months Teams access", "Tue–Thu sessions (21:00–22:00)", "WhatsApp Q&A group", "Free CV revamp ×2", "Community vacancy updates", "Small group workshops"],
      },
      {
        name: "Individual Course",
        price: 1500,
        priceLabel: "R1,500",
        features: ["Complete course materials", "1-on-1 mentoring", "Certificate of completion", "CV revamp included", "WhatsApp support"],
      },
    ],
  },
  {
    slug: "research",
    title: "Research & Writing Support",
    shortTitle: "Research",
    description: "Expert guidance for dissertations, theses, proposals, and academic writing at all levels.",
    highlight: "PhD to Honours",
    icon: "BookOpen",
    startingPrice: "R600",
    heroTagline: "Expert Research Guidance at Every Level",
    packages: [
      {
        name: "Research Proposal",
        price: 600,
        priceLabel: "R600",
        features: ["Research proposal development", "Literature review guidance", "Methodology support", "WhatsApp consultation"],
      },
      {
        name: "Dissertation / Thesis",
        price: 1500,
        priceLabel: "R1,500",
        badge: "Most Popular",
        features: ["Full dissertation support", "Chapter-by-chapter guidance", "Data analysis (SPSS/R/Excel)", "Turnitin similarity check", "Viva preparation"],
      },
      {
        name: "Journal Article",
        price: 900,
        priceLabel: "R900",
        features: ["Article writing support", "Proofreading & referencing", "Journal submission guidance", "Plagiarism check"],
      },
    ],
  },
  {
    slug: "workshops",
    title: "Workshops & Training",
    shortTitle: "Workshops",
    description: "Interactive workshops for skills development, career guidance, and professional growth.",
    highlight: "Group Sessions",
    icon: "Users",
    startingPrice: "R600",
    heroTagline: "Interactive Learning Experiences",
    packages: [
      {
        name: "Single Workshop",
        price: 600,
        priceLabel: "R600",
        features: ["3-hour interactive session", "Workshop materials included", "Certificate of attendance", "WhatsApp follow-up"],
      },
      {
        name: "Workshop Series (4)",
        price: 900,
        priceLabel: "R900",
        badge: "Best Value",
        features: ["4 workshop sessions", "All materials included", "Certificate of completion", "Group WhatsApp support", "Networking opportunities"],
      },
    ],
  },
  {
    slug: "tutoring",
    title: "Tutoring & Exam Prep",
    shortTitle: "Tutoring",
    description: "One-on-one and group tutoring sessions with examination preparation across all fields.",
    highlight: "All Fields",
    icon: "PenTool",
    startingPrice: "R600",
    heroTagline: "Personalised Learning, Real Results",
    packages: [
      {
        name: "Single Session",
        price: 600,
        priceLabel: "R600",
        features: ["1-hour tutoring session", "Any subject/module", "Personalised approach", "WhatsApp follow-up"],
      },
      {
        name: "Monthly Package (8 Sessions)",
        price: 2000,
        priceLabel: "R2,000",
        badge: "Most Popular",
        features: ["8 tutoring sessions", "Any subject/module", "Personalised study plan", "Exam preparation materials", "Priority WhatsApp support"],
      },
    ],
  },
  {
    slug: "consultation",
    title: "Consultation & Training",
    shortTitle: "Consultation",
    description: "Professional consultation for institutions, organisations, and individual academic needs.",
    highlight: "Custom Solutions",
    icon: "Briefcase",
    startingPrice: "R600",
    heroTagline: "Tailored Solutions for Your Organisation",
    packages: [
      {
        name: "Initial Consultation",
        price: 600,
        priceLabel: "R600",
        features: ["60-minute discovery call", "Needs assessment", "Tailored recommendations", "Action plan included"],
      },
      {
        name: "Full Consultation Package",
        price: 1500,
        priceLabel: "R1,500",
        badge: "Best Value",
        features: ["Comprehensive needs analysis", "Custom training programme", "Implementation support", "Ongoing mentoring", "Progress reporting"],
      },
    ],
  },
];

export const institutions = [
  "SANTS", "UNISA", "University of Johannesburg", "Wits University",
  "University of Cape Town", "UKZN", "Stadio", "North-West University",
  "Walter Sisulu University", "University of Mpumalanga", "Tshwane University of Technology",
  "University of Pretoria", "Stellenbosch University", "University of the Free State",
  "Nelson Mandela University", "Rhodes University", "University of Limpopo",
  "University of Venda", "Sol Plaatje University", "Sefako Makgatho University",
  "Cape Peninsula University of Technology", "Durban University of Technology",
  "Central University of Technology", "Mangosuthu University of Technology",
  "Vaal University of Technology",
];

export const getServiceBySlug = (slug: string) => services.find(s => s.slug === slug);