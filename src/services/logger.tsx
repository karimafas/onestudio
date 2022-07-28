export class Logger {
  public static log(message: any, params?: any) {
    console.log(message, params ?? "");
  }
}
