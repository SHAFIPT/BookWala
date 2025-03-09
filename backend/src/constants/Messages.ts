export enum ResponseMessages {
    OTP_SENT = "OTP sent successfully",
    OTP_VERIFIED = "OTP verified successfully",
    OTP_INVALID = "Invalid OTP.",
    OTP_RESENT = "OTP resent successfully",
    PASSWORD_RESET_EMAIL = "Password reset token sent to email",
    PASSWORD_UPDATED = "Password updated successfully",
    USER_REGISTERED = "User registered successfully",
    USER_LOGGED_IN = "User login successfully",
    USER_LOGGED_OUT = "User logged out successfully",
    UNAUTHORIZED = "Unauthorized",
    MISSING_FIELDS = "Email, name, and password are required",
    ACCESS_DENIED = "Access Denied",
    INVALID_TOKEN = "Invalid Token"
}