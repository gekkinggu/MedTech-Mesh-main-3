export interface Model {
  id: string
  title: string
  author?: string
  username?: string
  category?: string
  likes: number
  downloads: number
  shares?: number
  status: 'published' | 'verification' | 'rejected'
  createdAt: string
  publishedDate?: string
  description?: string
  license?: string
  tags?: string[]
  modelUrl?: string
  previewImage?: string
  images?: string[] // changed from string to string[] for multiple images
  relatedModels?: {
    id: string
    title: string
    author: string
    downloads: number
    likes: number
    shares: number
  }[]
  rejectionReason?: string
  adminNotes?: string
}