import axios from "../libs/axios";
import { IMessage } from "../utils";

const groupStore = async (arr: Array<number>) => {
  const data = ((await axios.post('/group/store', arr)).data) as IMessage
  return data.data
}

export {
  groupStore,
}