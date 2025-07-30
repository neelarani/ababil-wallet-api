import { createQuery } from "mongoose-qb";

export const useQuery = createQuery({
  defaultLimit: 10,
  defaultPage: 1,
  defaultSortField: "-createdAt",
});
