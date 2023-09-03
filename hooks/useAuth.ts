import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";

const cookies = new Cookies();

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = cookies.get("access_token");
    const refreshToken = cookies.get("refresh_token");

    if (!accessToken || !refreshToken) {
      router.push("/auth/login");
      return;
    }

    const decodedAccessToken: any = jwtDecode(accessToken);

    console.log({ decodedAccessToken });

    if (decodedAccessToken.exp * 1000 < Date.now()) {
      router.push("/auth/login");
      return;
    }

    setCurrentUser(decodedAccessToken);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [currentUser];
};
