import { StudioUser } from "../objects/StudioUser";

export class StringHelper {
  static toFirstUpperCase(text: string) {
    return `${text.substring(0, 1).toUpperCase()}${text.substring(1)}`;
  }

  static userInitials(user?: StudioUser) {
    if (!user) return "";
    return `${user?.firstName?.substring(0, 1) ?? ""}${
      user?.lastName?.substring(0, 1) ?? ""
    }`.toUpperCase();
  }
}
