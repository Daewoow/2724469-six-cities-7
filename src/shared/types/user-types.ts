const userTypes = ['обычный', 'pro'] as const;
export type UserType = (typeof userTypes)[number];

export function getAllUserTypes(): UserType[] {
  return [...userTypes];
}

export function isUserType(str: string): UserType | undefined {
  const foundStr = userTypes.find((val) => val === str);

  if (!foundStr) {
    return;
  }

  return foundStr;
}
