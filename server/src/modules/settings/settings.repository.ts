import { SiteSettingsModel, ISiteSettings } from "./settings.model";
import { UpdateSettingsDTO } from "./settings.schema";

export class SettingsRepository {
  async findOne(): Promise<ISiteSettings | null> {
    return SiteSettingsModel.findOne().exec();
  }

  async create(data: UpdateSettingsDTO): Promise<ISiteSettings> {
    const settings = new SiteSettingsModel(data);
    return settings.save();
  }

  async update(data: UpdateSettingsDTO): Promise<ISiteSettings | null> {
    return SiteSettingsModel.findOneAndUpdate({}, data, { returnDocument: "after", upsert: true }).exec();
  }
}
