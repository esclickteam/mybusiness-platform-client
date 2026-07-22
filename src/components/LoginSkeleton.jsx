import React from "react";
import BizuplyLoader from "./ui/BizuplyLoader";

export function LoginSkeleton() {
  return <BizuplyLoader fullScreen label="Loading..." />;
}
