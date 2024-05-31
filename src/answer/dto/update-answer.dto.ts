
export class UpdateAnswerDto {
  readonly mark: string
  readonly answerChecked: boolean
  readonly answers: AnswerDto[]
}

class AnswerDto {
  readonly correct: boolean
}