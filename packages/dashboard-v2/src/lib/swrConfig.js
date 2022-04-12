import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends Error {}

const config = {
  fetcher: (key) =>
    fetch(`/api/${key}`).then(async (response) => {
      if (response.ok) {
        return response.json();
      }

      const data = await response.json();

      if (response.status === StatusCodes.UNAUTHORIZED) {
        throw new UnauthorizedError(data?.message || "Unauthorized");
      }

      throw new Error(data?.message || `Error occurred when trying to fetch: ${key}`);
    }),
};

export default config;
