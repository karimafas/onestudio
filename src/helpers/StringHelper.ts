import { StudioUser } from "../objects/StudioUser";

export function toFirstUpperCase(text: string) {
  return `${text.substring(0, 1).toUpperCase()}${text.substring(1)}`;
}

export function userInitials(user?: StudioUser) {
  if (!user) return "";
  return `${user?.firstName?.substring(0, 1) ?? ""}${
    user?.lastName?.substring(0, 1) ?? ""
  }`.toUpperCase();
}

export function collapseString(text?: string, maxCharacters?: number) {
  if (!text) return "";
  const limit = maxCharacters || 20;
  const ellipsis = text.length > limit ? "..." : "";
  return `${text.substring(0, limit)}${ellipsis}`;
}
