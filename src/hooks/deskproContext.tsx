import { createContext, useContext, useState } from "react";

import { useDeskproAppEvents, Context } from "@deskpro/app-sdk";

import IDeskproContext from "../types/deskproContext";

const DeskproContext = createContext<IDeskproContext | null>(null);

export const useDeskpro = () => useContext(DeskproContext);

export const DeskproContextProvider: React.FC = ({ children }) => {
  const [deskproData, setDeskproData] = useState<IDeskproContext | null>(null);

  useDeskproAppEvents({
    onShow: (c: Context) => {
      const data = c?.data;

      if (data?.currentAgent) {
        const stateData = { user: data.currentAgent, settings: c.settings };

        setDeskproData(stateData);
      }
    },
  });

  return (
    <DeskproContext.Provider value={deskproData}>
      {children}
    </DeskproContext.Provider>
  );
};
