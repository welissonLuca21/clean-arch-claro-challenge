import { Service } from 'typedi'
import { v4 } from 'uuid'

@Service()
export class UniqueIdProvider {
  createUniqueId() {
    return v4()
  }
}
