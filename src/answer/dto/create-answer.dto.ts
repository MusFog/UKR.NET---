import { Types } from 'mongoose';

export class CreateAnswerDto {
  readonly user: Types.ObjectId
  readonly name: string
  readonly mark: number
  readonly answerChecked: boolean
  readonly testId: Types.ObjectId
  readonly answers: AnswerDto[]
}

class AnswerDto {
  readonly itemId: Types.ObjectId
  readonly question: string
  readonly answer: string
  readonly correct: boolean
}
