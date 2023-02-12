import { AxiosResponse } from "axios";
import { DelayHelper } from "../helpers/DelayHelper";
import { Studio } from "../objects/Studio";
import { StudioUser } from "../objects/StudioUser";
import { RegistrationDfo } from "../pages/InvitationPage";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";
import { TokenService } from "../services/TokenService";

export class AuthRepository {
  public static async login(email: string, password: string): Promise<boolean> {
    let success: boolean = false;

    try {
      const body = {
        email: email,
        password: password,
      };

      const resp = await RequestService.request(
        "auth/login",
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        await DelayHelper.sleep(1);
        success = true;
        LoggerService.log("Logged in user.", resp.data);

        const rt = (resp as AxiosResponse).data.refreshToken;
        const at = (resp as AxiosResponse).data.accessToken;

        TokenService.setTokens(rt, at);
      }
    } catch (e) {
      LoggerService.log("Couldn't login user.");
    }

    return success;
  }

  public static async logout(): Promise<boolean> {
    let success: boolean = false;

    try {
      window.localStorage.removeItem("rt");
      success = true;
      LoggerService.log("Logged out.");
    } catch (e) {
      LoggerService.log("Couldn't log out user.");
    }

    return success;
  }

  public static async refreshToken(): Promise<boolean> {
    let success: boolean = false;

    const rt = window.localStorage.getItem("rt");

    try {
      const resp = await RequestService.request(
        "auth/refreshToken",
        RequestType.post,
        {
          refreshToken: rt,
        }
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Token refreshed successfully.", resp.data);

        const rt = (resp as AxiosResponse).data.refreshToken;
        const at = (resp as AxiosResponse).data.accessToken;

        TokenService.setTokens(rt, at);
      }
    } catch (e) {
      LoggerService.log("Could not refresh token.");
    }

    return success;
  }

  public static async getUser(id: number): Promise<StudioUser | undefined> {
    let user: StudioUser | undefined;

    try {
      const resp = await RequestService.request(
        `auth/user/${id}`,
        RequestType.get
      );

      if (resp.status === 200) {
        LoggerService.log("Found user info.", resp.data);

        if (resp.data) {
          user = StudioUser.fromJson(resp.data);
        }
      }
    } catch (e) {
      LoggerService.log("Couldn't find user info.");
    }

    return user;
  }

  public static async getCurrentUser(): Promise<StudioUser | undefined> {
    let user: StudioUser | undefined;

    try {
      const resp = await RequestService.request(
        "auth/currentUser",
        RequestType.get
      );

      if (resp.status === 200) {
        LoggerService.log("Found current user info.", resp.data);

        if (resp.data) {
          user = StudioUser.fromJson(resp.data);
        }
      }
    } catch (e) {
      LoggerService.log("Couldn't find current user info.");
    }

    return user;
  }

  public static async getStudioUsers(): Promise<StudioUser[]> {
    let users: StudioUser[] = [];

    try {
      const resp = await RequestService.request(
        "auth/studioUsers",
        RequestType.get
      );

      if (resp.status === 200) {
        LoggerService.log("Found studio users info.", resp.data);

        if (resp.data) {
          for (const jsonUser of resp.data) {
            users.push(StudioUser.fromJson(jsonUser));
          }
        }
      }
    } catch (e) {
      LoggerService.log("Couldn't find studio users info.");
    }

    return users;
  }

  public static async sendPasswordResetEmail(email: string): Promise<boolean> {
    let success = false;

    try {
      const body = {
        email: email,
      };
      const resp = await RequestService.request(
        "auth/sendPasswordResetEmail",
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log(`Password reset email sent.`);
      }
    } catch (e) {
      LoggerService.log("Couldn't send password reset email.");
    }

    return success;
  }

  public static async validatePasswordResetToken(
    token: string
  ): Promise<boolean> {
    let success = false;

    try {
      const body = {
        token: token,
      };
      const resp = await RequestService.request(
        "auth/validatePasswordResetToken",
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log(`Reset token valid.`);
      }
    } catch (e) {
      LoggerService.log("Couldn't validate reset token.");
    }

    return success;
  }

  public static async resetPassword(
    token: string,
    password: string
  ): Promise<boolean> {
    let success = false;

    try {
      const body = {
        token: token,
        password: password,
      };
      const resp = await RequestService.request(
        "auth/resetPassword",
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log(`Password reset.`);
      }
    } catch (e) {
      LoggerService.log("Error resetting password.");
    }

    return success;
  }

  public static async getStudio(): Promise<{
    success: boolean;
    studio: Studio | undefined;
  }> {
    let success = false;
    let studio: Studio | undefined;

    try {
      const resp = await RequestService.request(
        "auth/currentStudio",
        RequestType.get
      );

      LoggerService.log("Loaded current studio from API.", resp);

      const _studio = resp.data;

      if (_studio) {
        studio = Studio.fromJson(_studio);
      }
    } catch (e) {
      LoggerService.log(`Couldn't load studio.`);
    }

    return { success, studio };
  }

  public static async registerFrominvitation(
    invitationId: number,
    dfo: RegistrationDfo
  ): Promise<boolean> {
    let success = false;

    try {
      if (!dfo.studioId) throw "No studioId was provided.";

      const resp = await RequestService.request(
        `auth/register/invitation/${invitationId}`,
        RequestType.post,
        dfo
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Registered user from invitation.", resp.data);

        const rt = (resp as AxiosResponse).data.refreshToken;
        const at = (resp as AxiosResponse).data.accessToken;

        TokenService.setTokens(rt, at);
        success = true;
      }
    } catch (e) {
      LoggerService.log("Could not register user from invitation.");
    }

    return success;
  }
}
