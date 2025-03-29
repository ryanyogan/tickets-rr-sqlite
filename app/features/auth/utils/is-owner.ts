import type { User } from "@prisma/client";

type Entity = {
  userId: string | null;
};

export function isOwner(
  user: Omit<User, "passwordHash"> | null | undefined,
  entity: Entity | null | undefined
) {
  if (!user || !entity) {
    return false;
  }

  if (!entity.userId) {
    return false;
  }

  if (entity.userId !== user.id) {
    return false;
  } else {
    return true;
  }
}
