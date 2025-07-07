export function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "The email address is badly formatted.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
      return "No user found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "This email address is already registered.";
    case "auth/weak-password":
      return "The password is too weak. Please choose a stronger password.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing the sign in.";
    case "auth/invalid-credential":
      return "Invalid authentication credentials provided.";
    default:
      return "An unknown error occurred. Please try again later.";
  }
}
