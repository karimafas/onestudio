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

  static collapseString(text: string, maxCharacters?: number) {
    const limit = maxCharacters || 20;
    const ellipsis = text.length > limit ? "..." : "";
    return `${text.substring(0, limit)}${ellipsis}`;
  }
}
