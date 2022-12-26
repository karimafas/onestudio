import { AxiosError } from "axios";
import { AuthRepository } from "../repositories/AuthRepository";
import { LoggerService } from "./LoggerService";
import { TokenService } from "./TokenService";
const axios = require("axios");

const baseUrl = "http://localhost:3000/api/";

const unauthorisedRoutes = ["login", "reset-password"];

export enum RequestType {
  get = "GET",
  post = "POST",
  put = "PUT",
  delete = "DELETE",
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
      const status: number = e.response.status;
      if (
        !retried &&
        url !== "auth/login" &&
        url !== "auth/refreshToken" &&
        url !== "auth/logout" &&
        (status === 403 || status === 401)
      ) {
        LoggerService.log("Token seems expired, refreshing auth token.");
        retried = true;
        const refreshed = await AuthRepository.refreshToken();
        if (refreshed) {
          response = await performRequest(type, url, body);
        } else {
          window.location.reload();
        }
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
      break;
    case RequestType.post:
      return await axios.post(baseUrl + url, body, {
        headers,
      });
      break;
    case RequestType.put:
      return await axios.put(baseUrl + url, body, {
        headers,
      });
      break;
    case RequestType.delete:
      return await axios.delete(baseUrl + url, {
        headers,
      });
      break;
  }
}
