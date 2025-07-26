import { UserDataOnly } from "@/entities/user.entity";
import { createContext, useContext } from "react";

// Define types for the contexts
export type ActiveDialogContextType = {
  activeDialogId: string | null;
  setActiveDialogId: React.Dispatch<React.SetStateAction<string | null>>;
};

export type SearchContextType = {
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type QueryContextType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

export type UserDataContextType = {
  userData: UserDataOnly | null;
  setUserData: React.Dispatch<React.SetStateAction<UserDataOnly | null>>;
};

export const ActiveDialogContext = createContext<
  ActiveDialogContextType | undefined
>(undefined);
export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);
export const QueryContext = createContext<QueryContextType | undefined>(
  undefined
);
export const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const useActiveDialogContext = () => {
  const context = useContext(ActiveDialogContext);
  if (!context)
    throw new Error(
      "useActiveDialogContext must be used within AppContextProvider"
    );
  return context;
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("useSearchContext must be used within AppContextProvider");
  return context;
};

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (!context)
    throw new Error("useQueryContext must be used within AppContextProvider");
  return context;
};

export const useUserDataContext = () => {
  const context = useContext(UserDataContext);
  if (!context)
    throw new Error(
      "useUserDataContext must be used within AppContextProvider"
    );
  return context;
};
