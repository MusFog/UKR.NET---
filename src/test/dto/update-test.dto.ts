export class UpdateTestDto {
  readonly name?: string;
  readonly mark?: string;
  readonly description?: string;
  readonly category?: string;
  readonly item?: ItemDto[];
}

class ItemDto {
  readonly _id: string;
  readonly question: string;
  readonly answer: string;
}
