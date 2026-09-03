import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEbookLead extends Document {
  firstName: string
  surname: string
  email: string
  phone: string
  company?: string
  createdAt: Date
}

const EbookLeadSchema = new Schema<IEbookLead>({
  firstName: { type: String, required: true, trim: true },
  surname: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  phone: { type: String, required: true, trim: true },
  company: { type: String, trim: true, default: null },
  createdAt: { type: Date, default: Date.now },
})

const EbookLead: Model<IEbookLead> =
  mongoose.models.EbookLead ||
  mongoose.model<IEbookLead>('EbookLead', EbookLeadSchema)

export default EbookLead
