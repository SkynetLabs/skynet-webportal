import { ContainerLoadingIndicator } from "./ContainerLoadingIndicator";

export const FullScreenLoadingIndicator = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-palette-100/50">
    <ContainerLoadingIndicator className="!text-palette-200/50" />
  </div>
);
