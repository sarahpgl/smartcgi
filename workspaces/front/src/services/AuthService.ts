// AuthService.ts
export const AuthService = {
    isAuthenticated: false,
    login() {
      this.isAuthenticated = true;
    },
    logout() {
      this.isAuthenticated = false;
    },
    isAuthenticatedUser() {
      return this.isAuthenticated;
    }
  };
  