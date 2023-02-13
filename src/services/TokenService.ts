export class TokenService {
  static token: string = "";

  static setTokens(refreshToken: string, accessToken: string) {
    window.localStorage.removeItem("rt");
    window.localStorage.setItem("rt", refreshToken);
    this.token = accessToken;
  }
}
