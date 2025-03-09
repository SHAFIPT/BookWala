import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { IUser } from "../types/user";
import { setIsUserAuthenticated, setUser } from "../store/slice/userSlice";

const useGoogleAuth = () => {
  const dispatch = useDispatch();

  const loginWithGoogle = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google Auth Token:", tokenResponse);

        // Fetch user profile from Google
        const userInfo = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );

        console.log("User Info:", userInfo.data);

        // Construct user object based on IUser type
        const user: IUser = {
          name: userInfo.data.name,
          email: userInfo.data.email,
          profilePicture: userInfo.data.picture,
          // Add more fields as per your user model
        };

        // Save user data to Redux store
        dispatch(setUser(user));
        dispatch(setIsUserAuthenticated(true));

        // Optionally, store the token in local storage
        localStorage.setItem("authToken", tokenResponse.access_token);
      } catch (error) {
        console.error("Google Login Error:", error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return { loginWithGoogle };
};

export default useGoogleAuth;
