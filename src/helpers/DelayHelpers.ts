export class DelayHelper {
  static sleep = (s: number) =>
    new Promise((p) => setTimeout(p, (s * 1000) | 0));
}
