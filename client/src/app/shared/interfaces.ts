export interface User {
  _id: string
  login: string;
  email: string;
  password: string;
  roles: UserRole;
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}


export interface UserRating {
  userId: string;
  averagePercentage: number;
  normalizedMark: number;
  userDetails: User;
}

export interface Message {
  message: string
}
export interface Category {
  name: string
  imageSrc?: string
  description?: string
  user?: string
  _id?: string
}
export interface CategoryRating {
  categoryId?: string;
  averageMark?: number;
  categoryDetails: Category;
}
export interface Feedback {
  _id?: string
  title: string
  description: string
  createdAt?: Date
  updatedAt?: Date
  adminResponses?: AdminResponse[]
  user?: User
}

export interface AdminResponse {
  response: string
  respondedAt: Date
}

export interface Test {
  date?: Date
  name: string
  mark: number
  description?: string
  user?: User
  item?: Item[]
  comment?: Comment[]
  category: string
  _id?: string
}
export interface CategoryResponse {
  data: Category[]
  total: number
}
export interface TestResponse {
  data: Test[]
  total: number
}
export interface Item {
  _id?: string
  question: string
  answer: string
}
export interface Comment {
  text: string;
  createdAt: Date;
  createdBy: string;
  type: User
}


export interface CommentDetails {
  text: string;
  createdAt: Date;
}
export interface AnswerComment {
  text: string;
  answeredBy: User;
  answeredAt: Date;
}

export interface Answer {
  _id?: string
  mark?: number
  answerChecked?: boolean
  testId?: string
  name: string
  user?: User
  answers: AnswerItem[]
  createdAt?: Date
}

export interface AnswerItem {
  correctAnswer: string;
  itemId: string
  question: string
  answer: string
  correct: boolean
}


