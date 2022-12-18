export class LoggerService {
  public static log(message: any, params?: any) {
    console.log(message, params ?? "");
  }
}
