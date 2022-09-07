import { useTypedSelector } from "@/store";
import { PropsWithChildren, ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

const NeedAuth = ({
  children,
}: PropsWithChildren<{ children: ReactElement }>) => {
  const token = useTypedSelector((state) => state.login).token;

  const location = useLocation();

  return token === "" ? (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  ) : (
    children
  );
};

export default NeedAuth;
