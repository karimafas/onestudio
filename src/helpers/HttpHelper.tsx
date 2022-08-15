import { Logger } from "../services/logger";
import { ApiHelper } from "./ApiHelper";
const axios = require("axios");

export enum RequestType {
  get,
  post,
  put,
  delete,
}

function getRequestString(type: RequestType): string {
  switch (type) {
    case RequestType.get:
      return "GET";
    case RequestType.post:
      return "POST";
    case RequestType.put:
      return "PUT";
    case RequestType.delete:
      return "DELETE";
  }
}

export class HttpHelper {
  public static async checkAndRefresh(): Promise<boolean> {
    const res = await ApiHelper.refreshToken();

    if (res) {
      return true;
    } else {
      Logger.log("Could not generate new access token.");
      // Logout user.
      return false;
    }
  }

  public static async request(
    url: string,
    type: RequestType = RequestType.post,
    body: {} | undefined = undefined,
    requiresAuthentication: boolean = true
  ) {
    let attempts = 0;
    let response;

    while (attempts < 2) {
      Logger.log(
        `Attempting ${getRequestString(
          type
        )} request for ${url}. Attempt no: ${attempts}.`
      );
      
      try {
        switch (type) {
          case RequestType.get:
            response = await axios.get(url);
            break;
          case RequestType.post:
            response = await axios.post(url, body);
            break;
          case RequestType.put:
            response = await axios.put(url, body);
            break;
          case RequestType.delete:
            response = await axios.delete(url, body);
            break;
        }

        attempts = 2;
      } catch (e: any) {
        attempts++;
        // If access token has expired, request a new one.
        if (requiresAuthentication && e.response.status === 401) {
          Logger.log(`Access token has expired. Trying to refresh...`);
          await HttpHelper.checkAndRefresh();
        }
      }
    }

    return response;
  }
}
