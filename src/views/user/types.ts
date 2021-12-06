type TContact = {
  uid?: number,
  fid?: number,
  is_out?: boolean,
  rname?: string,
  rphone?: string,
  remark?: string,
  star?: boolean
}
interface IUser {
  id: number,
  name: string,
  sex: boolean,
  avatar: string,
  self_id: string,
  region?: string,
  Contact: TContact
}
export type TLists = {
  [x: string]: IUser[]
}
export type TData = {
  lists: TLists,
  star: IUser[],
  reminds: []
}

export {
  IUser
}