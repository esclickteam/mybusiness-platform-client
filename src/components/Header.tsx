import HeaderView from "./HeaderView";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  return <HeaderView user={user} onLogout={logout} />;
}
