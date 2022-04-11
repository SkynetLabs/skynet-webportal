import { APIKey } from "./APIKey";

export const APIKeyList = ({ keys, reloadKeys, title }) => {
  return (
    <>
      <h6 className="text-palette-300 mb-4">{title}</h6>
      <ul className="mt-4">
        {keys.map((key) => (
          <APIKey key={key.id} apiKey={key} onEdited={reloadKeys} onRemoved={reloadKeys} />
        ))}
      </ul>
    </>
  );
};
