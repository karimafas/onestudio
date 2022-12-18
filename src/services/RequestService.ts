import { AuthRepository } from "../repositories/AuthRepository";
import { LoggerService } from "./LoggerService";
const axios = require("axios");

const baseUrl = "http://localhost:3001/";

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

export class RequestService {
  public static async request(
    url: string,
    type: RequestType = RequestType.post,
    body: {} | undefined = undefined
  ) {
    let retried = false;
    let response;

    LoggerService.log(
      `Attempting ${getRequestString(type)} request for ${baseUrl + url}.`
    );

    try {
      response = await performRequest(type, url, body);
    } catch (e: any) {
      if (
        !retried &&
        url !== "auth/login" &&
        url !== "auth/refreshToken" &&
        url !== "auth/logout"
      ) {
        LoggerService.log(
          "Request failed, trying to refresh authentication token."
        );
        retried = true;
        await AuthRepository.refreshToken();
        response = await performRequest(type, url, body);
      }
    }

    return response;
  }
}

async function performRequest(type: RequestType, url: string, body: any) {
  switch (type) {
    case RequestType.get:
      return await axios.get(baseUrl + url, {
        withCredentials: true,
      });
      break;
    case RequestType.post:
      return await axios.post(baseUrl + url, body, {
        withCredentials: true,
      });
      break;
    case RequestType.put:
      return await axios.put(baseUrl + url, body, {
        withCredentials: true,
      });
      break;
    case RequestType.delete:
      return await axios.delete(baseUrl + url, {
        withCredentials: true,
      });
      break;
  }
}
