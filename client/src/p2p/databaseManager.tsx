export interface UserDocument {
  id: string;
  publicKey: number;
}

export const data: {
  users: UserDocument[];
} = {
  users: [],
};

export const setData = (path: (string | number)[], value: any) => {
  let dataToChange: any = data;
  for (let i = 0; i < path.length; i++) {
    if (i === path.length - 1) {
      dataToChange[i] = value;
    } else {
      dataToChange = dataToChange[path[i]];
    }
  }
};
