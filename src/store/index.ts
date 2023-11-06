import { IAuthor } from "@scom/scom-post";
import assets from "../assets";

export const getCurrentUser = () => {
  const user: IAuthor = {
    id: "",
    username: "",
    internetIdentifier: "",
    pubKey: "",
    displayName: "",
    description: "",
    avatar: assets.fullPath('img/default_avatar.png')
  }
  return user;
}
