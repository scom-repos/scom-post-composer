import { IAuthor } from "@scom/scom-post";

export const getCurrentUser = () => {
  const user: IAuthor = {
    id: "",
    username: "",
    internetIdentifier: "",
    pubKey: "",
    displayName: "",
    description: "",
    avatar: undefined
  }
  return user;
}
