import { createContext, ReactNode, useState } from "react";

interface Breadcrumb {
  path: string;
  breadcrumbName: string;
}

interface BreadcrumbContextProps {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>;
}

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export const BreadcrumbContext = createContext<BreadcrumbContextProps>({
  breadcrumbs: [],
  setBreadcrumbs: () => {
    throw new Error("setBreadcrumbs function must be overridden");
  },
});

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({
  children,
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
