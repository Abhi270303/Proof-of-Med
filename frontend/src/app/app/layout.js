import LoginChecker from "@/auth/login-checker";
import PrivyWrapper from "@/privy/privyProvider";

export default function RootLayout({ children }) {
  return (
    <PrivyWrapper>
      <LoginChecker>{children}</LoginChecker>
    </PrivyWrapper>
  );
}
