import { ENTITY } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";

const setEntityService = (
  client: IDeskproClient,
  ticketId: string,
  entityId: string,
) => {
  return client
    .getEntityAssociation(ENTITY, ticketId)
    .set(entityId);
};

export { setEntityService };
