import { DelayHelper } from "../helpers/DelayHelper";
import { StudioUser } from "../objects/StudioUser";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

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
      }
    } catch (e) {
      LoggerService.log("Couldn't login user.");
    }

    return success;
  }

  public static async logout(): Promise<boolean> {
    let success: boolean = false;

    try {
      const resp = await RequestService.request(
        "auth/logout",
        RequestType.post
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Logged out.", resp.data);
        window.location.reload();
      }
    } catch (e) {
      LoggerService.log("Couldn't log out user.");
    }

    return success;
  }

  public static async refreshToken(): Promise<boolean> {
    let success: boolean = false;

    try {
      const resp = await RequestService.request(
        "auth/refreshToken",
        RequestType.post,
        {}
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Token refreshed successfully.", resp.data);
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

  public static async getStudioUsers(): Promise<Array<StudioUser>> {
    let users: Array<StudioUser> = [];

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

  public static async resetToken(email: string): Promise<boolean> {
    let success = false;

    try {
      const body = {
        email: email,
      };
      const resp = await RequestService.request(
        "reset-token",
        RequestType.post,
        body
      );

      if (resp.status === 200) {
        success = true;
        LoggerService.log(`Reset email sent.`);
      }
    } catch (e) {
      LoggerService.log("Couldn't send reset email.");
    }

    return success;
  }

  public static async checkResetToken(token: string): Promise<boolean> {
    let success: boolean = false;

    try {
      const body = { token: token };

      const resp = await RequestService.request(
        "reset-token-chk",
        RequestType.post,
        body
      );

      if (resp.status === 200) {
        success = true;
        LoggerService.log("Found valid token.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't find valid token.");
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
        "reset-password",
        RequestType.post,
        body
      );

      if (resp.status === 200) {
        success = true;
        LoggerService.log("Password reset.");
      }
    } catch (e) {
      LoggerService.log("Couldn't reset password.");
    }

    return success;
  }
}
