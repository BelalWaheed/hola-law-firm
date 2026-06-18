import { Schema, model, Document } from "mongoose";

export interface IStat {
  target: number;
  label: string;
  suffix: string;
}

export interface IService {
  title: string;
  description: string;
  iconName: string;
}

export interface ILawyer {
  name: string;
  title: string;
  imageUrl: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface IOffice {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface ISiteSettings extends Document {
  navbarBrand: string;
  badgeText: string;
  heroTitlePrefix: string;
  heroTitleSuffix: string;
  heroSubtitle: string;
  heroCtaText: string;
  stats: IStat[];
  servicesTitle: string;
  servicesSubtitle: string;
  services: IService[];
  lawyersTitle: string;
  lawyersSubtitle: string;
  lawyers: ILawyer[];
  contactTitle: string;
  contactSubtitle: string;
  office: IOffice;
  footerBrand?: string;
  footerDesc: string;
  copyrightText?: string;
  facebookLink: string;
  twitterLink: string;
  linkedinLink: string;
  instagramLink: string;
  createdAt: Date;
  updatedAt: Date;
}

const StatSchema = new Schema<IStat>({
  target: { type: Number, required: true },
  label: { type: String, required: true },
  suffix: { type: String, required: true }
}, { _id: false });

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconName: { type: String, required: true }
}, { _id: false });

const LawyerSchema = new Schema<ILawyer>({
  name: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  linkedin: { type: String, default: "" },
  twitter: { type: String, default: "" },
  email: { type: String, default: "" }
}, { _id: false });

const OfficeSchema = new Schema<IOffice>({
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  hours: { type: String, required: true }
}, { _id: false });

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    navbarBrand: { type: String, required: true },
    badgeText: { type: String, required: true },
    heroTitlePrefix: { type: String, required: true },
    heroTitleSuffix: { type: String, required: true },
    heroSubtitle: { type: String, required: true },
    heroCtaText: { type: String, required: true },
    stats: [StatSchema],
    servicesTitle: { type: String, required: true },
    servicesSubtitle: { type: String, required: true },
    services: [ServiceSchema],
    lawyersTitle: { type: String, required: true },
    lawyersSubtitle: { type: String, required: true },
    lawyers: [LawyerSchema],
    contactTitle: { type: String, required: true },
    contactSubtitle: { type: String, required: true },
    office: { type: OfficeSchema, required: true },
    footerBrand: { type: String, required: false },
    footerDesc: { type: String, required: true },
    copyrightText: { type: String, required: false },
    facebookLink: { type: String, default: "" },
    twitterLink: { type: String, default: "" },
    linkedinLink: { type: String, default: "" },
    instagramLink: { type: String, default: "" }
  },
  { timestamps: true }
);

export const SiteSettingsModel = model<ISiteSettings>("SiteSettings", siteSettingsSchema);
