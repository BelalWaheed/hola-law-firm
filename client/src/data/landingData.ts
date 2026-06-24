export interface StatData {
  target: number;
  label: string;
  suffix: string;
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface LawyerData {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface OfficeData {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface LandingPageContent {
  navbarBrand: string;
  badgeText: string;
  heroTitlePrefix: string;
  heroTitleSuffix: string;
  heroSubtitle: string;
  heroCtaText: string;
  stats: StatData[];
  servicesTitle: string;
  servicesSubtitle: string;
  services: ServiceData[];
  lawyersTitle: string;
  lawyersSubtitle: string;
  lawyers: LawyerData[];
  contactTitle: string;
  contactSubtitle: string;
  office: OfficeData;
  footerBrand: string;
  footerDesc: string;
  copyrightText: string;
  facebookLink: string;
  twitterLink: string;
  linkedinLink: string;
  instagramLink: string;
}

export const defaultLandingData: LandingPageContent = {
  navbarBrand: "عبدالمنعم أبو السعود السيد",
  badgeText: "محامون معتمدون منذ 1995",
  heroTitlePrefix: "خبرة قانونية",
  heroTitleSuffix: "تحمي حقوقك",
  heroSubtitle:
    "نقدم خدمات قانونية متكاملة بأعلى معايير الاحترافية والسرية. فريق من أفضل المحامين المتخصصين في جميع المجالات القانونية.",
  heroCtaText: "احصل على استشارة مجانية",
  stats: [
    { target: 25, label: "سنة خبرة", suffix: "+" },
    { target: 3500, label: "قضية ناجحة", suffix: "+" },
    { target: 50, label: "محامي متخصص", suffix: "+" },
    { target: 98, label: "نسبة الرضا", suffix: "%" },
  ],
  servicesTitle: "خدماتنا القانونية",
  servicesSubtitle:
    "نقدم مجموعة شاملة من الخدمات القانونية المتخصصة لتلبية جميع احتياجاتك",
  services: [
    {
      id: "s1",
      title: "استشارات قانونية",
      description:
        "نقدم استشارات قانونية متخصصة في جميع المجالات مع ضمان السرية التامة والاحترافية العالية.",
      iconName: "consultation",
    },
    {
      id: "s2",
      title: "قضايا تجارية",
      description:
        "تمثيل ومتابعة القضايا التجارية والشركات بمهارة عالية وخبرة واسعة في هذا المجال.",
      iconName: "commercial",
    },
    {
      id: "s3",
      title: "قضايا الأحوال الشخصية",
      description:
        "معالجة قضايا الأسرة والطلاق والحضانة والنفقة بحساسية عالية واهتمام بجميع التفاصيل.",
      iconName: "family",
    },
    {
      id: "s4",
      title: "قضايا جنائية",
      description:
        "دفاع قوي ومحترف في القضايا الجنائية مع فريق متخصص في هذا النوع من القضايا.",
      iconName: "criminal",
    },
    {
      id: "s5",
      title: "تأسيس شركات وصيدليات",
      description:
        "نقدم خدمات تأسيس الشركات، صياغة لوائحها الداخلية، وإجراءات تراخيص الصيدليات والمنشآت التجارية.",
      iconName: "corporate",
    },
    {
      id: "s6",
      title: "عقارات ومقاولات",
      description:
        "صياغة ومراجعة العقود العقارية والتعامل مع نزاعات المقاولات والمباني.",
      iconName: "property",
    },
  ],
  lawyersTitle: "فريق المحامين",
  lawyersSubtitle:
    "نخبة من أفضل المحامين المتخصصين ذوي الخبرة والكفاءة العالية",
  lawyers: [
    {
      id: "l1",
      name: "محمد علي",
      title: "محامي أول - القانون التجاري",
      imageUrl:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "https://youtu.be/guI8282wn5Q?si=tZWhHCg-u7Gf-wtD",
      email: "#",
    },
    {
      id: "l2",
      name: "سارة العتيبي",
      title: "محامية - الأحوال الشخصية",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
      email: "#",
    },
    {
      id: "l3",
      name: "رمضان فؤاد",
      title: "محامي - القانون الجنائي",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
      email: "#",
    },
    {
      id: "l4",
      name: "محمود ابو السعود",
      title: "محامي - العقارات",
      imageUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
      email: "#",
    },
  ],
  contactTitle: "تواصل معنا",
  contactSubtitle:
    "احصل على استشارة قانونية مجانية. اترك بياناتك وسيتواصل معك أحد محامينا خلال 24 ساعة.",
  office: {
    address: "حدائق الأهرام",
    phone: "01019675108",
    email: "info@arabic-lawyer.com",
    hours: "الأحد - الخميس: 9 صباحاً - 5 مساءً",
  },
  footerBrand: "عبدالمنعم أبو السعود السيد",
  footerDesc: "نقدم أفضل الخدمات القانونية بأعلى درجات الجودة والسرية التامة.",
  copyrightText: "جميع الحقوق محفوظة 2024 - المحامي العربي",
  facebookLink: "",
  twitterLink: "#",
  linkedinLink: "#",
  instagramLink: "#",
};

export const getLandingData = (): LandingPageContent => {
  const data = localStorage.getItem("hola_landing_data");
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return defaultLandingData;
    }
  }
  // Initialize in localStorage if not present
  localStorage.setItem("hola_landing_data", JSON.stringify(defaultLandingData));
  return defaultLandingData;
};

export const saveLandingData = (data: LandingPageContent) => {
  localStorage.setItem("hola_landing_data", JSON.stringify(data));
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event("landingDataChanged"));
};
