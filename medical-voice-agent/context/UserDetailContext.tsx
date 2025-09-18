import { IUser } from "@/config/schema";
import { createContext } from "react";

const UserDetailContext = createContext<{
  userDetail: IUser | undefined;
  setUserDetail: React.Dispatch<React.SetStateAction<IUser | undefined>>;
} | undefined>(undefined);

export default UserDetailContext;