export class LoggerService {
  public static log(message: any, params?: any) {
    if (process.env.ENVIRONMENT === "production") return;
    console.log(message, params ?? "");
  }
}
