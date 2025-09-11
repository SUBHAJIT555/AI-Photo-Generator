export const avatarMap: Record<string, string> = {
  feamale1: "feamale-01.png",
  feamale2: "feamale-02.png",
  feamale3: "feamale-03.png",
  feamale4: "feamale-04.png",
  feamale5: "feamale-05.png",
  feamale6: "feamale-06.png",
  male1: "male-01.png",
  male2: "male-02.png",
  male3: "male-03.png",
  male4: "male-04.png",
  male5: "male-05.png",
  male6: "male-06.png",
};

export type AvatarKey = keyof typeof avatarMap;
export type AvatarValue = (typeof avatarMap)[AvatarKey];
