type TUser = {
  avatar: string,
  id: number
  name: string
}

type TLists = {
  id?: number
  type: number
  content: any
  room_id: string
  user_id: string
  user: TUser,
  created_at: Date | string
  updated_at: Date | string
}

interface IBase {
  count: number
  lists: TLists[],
  user: any
}

export {
  IBase,
  TLists
}