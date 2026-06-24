import { Router, Request, Response, NextFunction } from "express";
import { SiteSettingsModel } from "../models/SiteSettings";
import { requireAuth } from "../middleware/auth";
import { validate, ValidationResult } from "../middleware/validate";

const router = Router();

export interface UpdateSettingsDTO {
  navbarBrand: string;
  badgeText: string;
  heroTitlePrefix: string;
  heroTitleSuffix: string;
  heroSubtitle: string;
  heroCtaText: string;
  stats: Array<{ target: number; label: string; suffix: string }>;
  servicesTitle: string;
  servicesSubtitle: string;
  services: Array<{ title: string; description: string; iconName: string }>;
  lawyersTitle: string;
  lawyersSubtitle: string;
  lawyers: Array<{ name: string; title: string; imageUrl: string; linkedin?: string; twitter?: string; email?: string }>;
  contactTitle: string;
  contactSubtitle: string;
  office: { address: string; phone: string; email: string; hours: string };
  footerBrand?: string;
  footerDesc: string;
  copyrightText?: string;
  facebookLink?: string;
  twitterLink?: string;
  linkedinLink?: string;
  instagramLink?: string;
}

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

const validateUpdateSettings = (req: Request): ValidationResult => {
  const body = req.body || {};
  const errors: any[] = [];

  const requiredStringFields = [
    "navbarBrand", "badgeText", "heroTitlePrefix", "heroTitleSuffix", "heroSubtitle", "heroCtaText",
    "servicesTitle", "servicesSubtitle", "lawyersTitle", "lawyersSubtitle",
    "contactTitle", "contactSubtitle", "footerDesc"
  ];

  requiredStringFields.forEach(field => {
    if (!body[field] || typeof body[field] !== "string" || body[field].trim() === "") {
      errors.push({ message: `${field} is required`, path: ["body", field] });
    }
  });

  // Validate stats
  if (!Array.isArray(body.stats)) {
    errors.push({ message: "stats must be an array", path: ["body", "stats"] });
  } else {
    body.stats.forEach((stat: any, index: number) => {
      if (typeof stat.target !== "number" || stat.target < 0) {
        errors.push({ message: "target must be a non-negative number", path: ["body", "stats", index, "target"] });
      }
      if (!stat.label || typeof stat.label !== "string" || stat.label.trim() === "") {
        errors.push({ message: "label is required", path: ["body", "stats", index, "label"] });
      }
      if (typeof stat.suffix !== "string") {
        errors.push({ message: "suffix must be a string", path: ["body", "stats", index, "suffix"] });
      }
    });
  }

  // Validate services
  if (!Array.isArray(body.services)) {
    errors.push({ message: "services must be an array", path: ["body", "services"] });
  } else {
    body.services.forEach((service: any, index: number) => {
      if (!service.title || typeof service.title !== "string" || service.title.trim() === "") {
        errors.push({ message: "title is required", path: ["body", "services", index, "title"] });
      }
      if (!service.description || typeof service.description !== "string" || service.description.trim() === "") {
        errors.push({ message: "description is required", path: ["body", "services", index, "description"] });
      }
      if (!service.iconName || typeof service.iconName !== "string" || service.iconName.trim() === "") {
        errors.push({ message: "iconName is required", path: ["body", "services", index, "iconName"] });
      }
    });
  }

  // Validate lawyers
  if (!Array.isArray(body.lawyers)) {
    errors.push({ message: "lawyers must be an array", path: ["body", "lawyers"] });
  } else {
    body.lawyers.forEach((lawyer: any, index: number) => {
      if (!lawyer.name || typeof lawyer.name !== "string" || lawyer.name.trim() === "") {
        errors.push({ message: "name is required", path: ["body", "lawyers", index, "name"] });
      }
      if (!lawyer.title || typeof lawyer.title !== "string" || lawyer.title.trim() === "") {
        errors.push({ message: "title is required", path: ["body", "lawyers", index, "title"] });
      }
      if (!lawyer.imageUrl || typeof lawyer.imageUrl !== "string" || lawyer.imageUrl.trim() === "") {
        errors.push({ message: "imageUrl is required", path: ["body", "lawyers", index, "imageUrl"] });
      } else {
        try {
          new URL(lawyer.imageUrl);
        } catch (_) {
          errors.push({ message: "رابط الصورة غير صالح", path: ["body", "lawyers", index, "imageUrl"] });
        }
      }
      if (lawyer.linkedin === undefined || lawyer.linkedin === null) lawyer.linkedin = "";
      if (lawyer.twitter === undefined || lawyer.twitter === null) lawyer.twitter = "";
      if (lawyer.email === undefined || lawyer.email === null) lawyer.email = "";
    });
  }

  // Validate office
  const office = body.office || {};
  if (typeof body.office !== "object" || body.office === null) {
    errors.push({ message: "office must be an object", path: ["body", "office"] });
  } else {
    const requiredOfficeFields = ["address", "phone", "email", "hours"];
    requiredOfficeFields.forEach(field => {
      if (!office[field] || typeof office[field] !== "string" || office[field].trim() === "") {
        errors.push({ message: `${field} is required in office`, path: ["body", "office", field] });
      }
    });
  }

  if (body.facebookLink === undefined || body.facebookLink === null) body.facebookLink = "";
  if (body.twitterLink === undefined || body.twitterLink === null) body.twitterLink = "";
  if (body.linkedinLink === undefined || body.linkedinLink === null) body.linkedinLink = "";
  if (body.instagramLink === undefined || body.instagramLink === null) body.instagramLink = "";

  return {
    success: errors.length === 0,
    errors,
  };
};

router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await SiteSettingsModel.findOne();
    if (!settings) {
      settings = await SiteSettingsModel.create(DEFAULT_SETTINGS);
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

router.put("/", requireAuth, validate(validateUpdateSettings), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await SiteSettingsModel.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
