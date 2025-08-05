import { FormUrlQueryProps, RemoveKeysFromQueryProps } from "@/types/formUrlQuerytypes";
import qs from "query-string";


export const formUrlQuery = ({ params, key, value }: FormUrlQueryProps) => {

  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl,
  },
    { skipNull: true });
}

export const removeKeysFromQuery = ({ params, KeysToRemove }: RemoveKeysFromQueryProps) => {
  const currentUrl = qs.parse(params);
  for (const key of KeysToRemove) {
    delete currentUrl[key];
  }

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl,
  },
    { skipNull: true });
}