import cookie from "react-cookies";
import { Logger } from "../services/logger";

export class AuthorizationHelper {
  public static check(): boolean {
    let success = false;
    const jwt = cookie.load("access_token");
    if (jwt) {
      success = true;
    } else {
      success = false;
    }

    Logger.log(`Found access_token`, success);

    return success;
  }
}
