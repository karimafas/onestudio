import { AuthRepository } from "../repositories/AuthRepository";
import { LoggerService } from "./LoggerService";
import { TokenService } from "./TokenService";
const axios = require("axios");

const baseUrl = `${process.env.API_URL}/`;

const unauthorisedRoutes = ["reset-password"];

export enum RequestType {
  get = "GET",
  post = "POST",
  put = "PUT",
  delete = "DELETE",
  patch = "PATCH",
}

export class RequestService {
  public static async request(
    url: string,
    type: RequestType = RequestType.post,
    body: {} | undefined = undefined
  ) {
    let retried = false;
    let response;

    LoggerService.log(`Attempting ${type} request for ${baseUrl + url}.`);

    try {
      response = await performRequest(type, url, body);
    } catch (e: any) {
      if (url.includes("refreshToken")) return;

      LoggerService.log("Token seems expired, refreshing auth token.");
      retried = true;
      const success = await AuthRepository.refreshToken();
      if (success) {
        response = await performRequest(type, url, body);
      }
    }

    return response;
  }

  public static needsAuth(route: string) {
    if (unauthorisedRoutes.includes(route.replace("/", ""))) return false;
    return true;
  }
}

async function performRequest(type: RequestType, url: string, body: any) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TokenService.token}`,
  };

  switch (type) {
    case RequestType.get:
      return await axios.get(baseUrl + url, {
        headers,
      });
    case RequestType.post:
      return await axios.post(baseUrl + url, body, {
        headers,
      });
    case RequestType.put:
      return await axios.put(baseUrl + url, body, {
        headers,
      });
    case RequestType.patch:
      return await axios.patch(baseUrl + url, body, {
        headers,
      });
    case RequestType.delete:
      return await axios.delete(baseUrl + url, {
        headers,
      });
  }
}
