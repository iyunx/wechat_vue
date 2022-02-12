type TContent = {
  id: number,
  name: string,
  avatar: string,
  from: string,
  fromer: string,
  sign: string,
  add_name: string
}

interface IRemindShow {
  id: number
  content: TContent
  created_at: Date
  time: boolean
}

export {
  IRemindShow
}