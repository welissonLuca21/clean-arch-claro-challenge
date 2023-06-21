import * as DateFns from 'date-fns'
import { Service } from 'typedi'

@Service()
export class DateProvider {
  addHours = (date: Date | number = new Date(), hours: number) => {
    return DateFns.addHours(date, hours)
  }
}
