import { SettingsRepository } from "./settings.repository";
import { ISiteSettings } from "./settings.model";
import { UpdateSettingsDTO } from "./settings.schema";

const DEFAULT_SETTINGS: UpdateSettingsDTO = {
  navbarBrand: "عبدالمنعم أبو السعود السيد",
  badgeText: "محامون معتمدون منذ 1995",
  heroTitlePrefix: "خبرة قانونية",
  heroTitleSuffix: "تحمي حقوقك",
  heroSubtitle: "نقدم خدمات قانونية متكاملة بأعلى معايير الاحترافية والسرية. فريق من أفضل المحامين المتخصصين في جميع المجالات القانونية.",
  heroCtaText: "احصل على استشارة مجانية",
  stats: [
    { target: 25, label: "سنة خبرة", suffix: "+" },
    { target: 3500, label: "قضية ناجحة", suffix: "+" },
    { target: 50, label: "محامي متخصص", suffix: "+" },
    { target: 98, label: "نسبة الرضا", suffix: "%" }
  ],
  servicesTitle: "خدماتنا القانونية",
  servicesSubtitle: "نقدم مجموعة شاملة من الخدمات القانونية المتخصصة لتلبية جميع احتياجاتك",
  services: [
    { title: "استشارات قانونية", description: "نقدم استشارات قانونية متخصصة في جميع المجالات مع ضمان السرية التامة والاحترافية العالية.", iconName: "consultation" },
    { title: "قضايا تجارية", description: "تمثيل ومتابعة القضايا التجارية والشركات بمهارة عالية وخبرة واسعة في هذا المجال.", iconName: "commercial" },
    { title: "قضايا الأحوال الشخصية", description: "معالجة قضايا الأسرة والطلاق والحضانة والنفقة بحساسية عالية واهتمام بجميع التفاصيل.", iconName: "family" },
    { title: "قضايا جنائية", description: "دفاع قوي ومحترف في القضايا الجنائية مع فريق متخصص في هذا النوع من القضايا.", iconName: "criminal" },
    { title: "تأسيس شركات وصيدليات", description: "نقدم خدمات تأسيس الشركات، صياغة لوائحها الداخلية، وإجراءات تراخيص الصيدليات والمنشآت التجارية.", iconName: "corporate" },
    { title: "عقارات ومقاولات", description: "صياغة ومراجعة العقود العقارية والتعامل مع نزاعات المقاولات والمباني.", iconName: "property" }
  ],
  lawyersTitle: "فريق المحامين",
  lawyersSubtitle: "نخبة من أفضل المحامين المتخصصين ذوي الخبرة والكفاءة العالية",
  lawyers: [
    { name: "محمد علي", title: "محامي أول - القانون التجاري", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face", linkedin: "#", twitter: "https://youtu.be/guI8282wn5Q?si=tZWhHCg-u7Gf-wtD", email: "#" },
    { name: "سارة العتيبي", title: "محامية - الأحوال الشخصية", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face", linkedin: "#", twitter: "#", email: "#" },
    { name: "رمضان فؤاد", title: "محامي - القانون الجنائي", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", linkedin: "#", twitter: "#", email: "#" },
    { name: "محمود ابو السعود", title: "محامي - العقارات", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face", linkedin: "#", twitter: "#", email: "#" }
  ],
  contactTitle: "تواصل معنا",
  contactSubtitle: "احصل على استشارة قانونية مجانية. اترك بياناتك وسيتواصل معك أحد محامينا خلال 24 ساعة.",
  office: {
    address: "حدائق الأهرام",
    phone: "01019675108",
    email: "info@arabic-lawyer.com",
    hours: "الأحد - الخميس: 9 صباحاً - 5 مساءً"
  },
  footerBrand: "عبدالمنعم أبو السعود السيد",
  footerDesc: "نقدم أفضل الخدمات القانونية بأعلى درجات الجودة والسرية التامة.",
  copyrightText: "جميع الحقوق محفوظة 2024 - المحامي العربي",
  facebookLink: "",
  twitterLink: "#",
  linkedinLink: "#",
  instagramLink: "#"
};

export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async getSettings(): Promise<ISiteSettings> {
    let settings = await this.settingsRepository.findOne();
    if (!settings) {
      settings = await this.settingsRepository.create(DEFAULT_SETTINGS);
    }
    return settings;
  }

  async updateSettings(data: UpdateSettingsDTO): Promise<ISiteSettings> {
    const updated = await this.settingsRepository.update(data);
    if (!updated) {
      throw new Error("Failed to update site settings");
    }
    return updated;
  }
}
