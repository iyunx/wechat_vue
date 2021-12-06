type TUser = {
  avatar: string,
  id: number
  name: string
}

type TLists = {
  id?: number
  type: number
  content: string
  room_id: string
  user_id: string
  user: TUser,
  created_at: Date
  updated_at: Date
}

interface IBase {
  lists: TLists[],
  user: any
}

export {
  IBase
}