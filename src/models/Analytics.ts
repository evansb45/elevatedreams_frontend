import mongoose, { Schema, Document } from 'mongoose'

// Page View Schema (tracks page openings & total count increments)
export interface IPageView extends Document {
  path: string
  count: number
  createdAt: Date
  updatedAt: Date
}

const PageViewSchema = new Schema<IPageView>(
  {
    path: { type: String, required: true, unique: true, default: '/ebook' },
    count: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
)

export const PageView =
  mongoose.models.PageView ||
  mongoose.model<IPageView>('PageView', PageViewSchema)

// Button Click Schema (tracks all button/link interactions)
export interface IButtonClick extends Document {
  buttonName: string
  path: string
  createdAt: Date
}

const ButtonClickSchema = new Schema<IButtonClick>(
  {
    buttonName: { type: String, required: true },
    path: { type: String, required: true, default: '/ebook' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const ButtonClick =
  mongoose.models.ButtonClick ||
  mongoose.model<IButtonClick>('ButtonClick', ButtonClickSchema)
