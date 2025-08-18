"use client";

import { Providers } from "./providers";

type Props = {
  children: React.ReactNode;
};
export const App = ({ children }: Props) => {
  return <Providers>{children}</Providers>;
};
