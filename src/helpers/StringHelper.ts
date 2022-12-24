export class StringHelper {
  static toFirstUpperCase(text: string) {
    return `${text.substring(0, 1).toUpperCase()}${text.substring(1)}`;
  }
}
