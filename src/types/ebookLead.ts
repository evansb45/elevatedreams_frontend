import { ObjectId } from 'mongodb'

export interface IEbookLead {
  _id?: ObjectId
  firstName: string
  surname: string
  email: string
  phone: string
  company?: string
  createdAt: Date
}
