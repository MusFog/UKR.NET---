export class CreateTestDto {
  readonly name: string;
  readonly mark: string;
  readonly description: string;
  readonly category: string;
  user: string;
  readonly item: ItemDto[];
}
class ItemDto {
  readonly question: string;
  readonly answer: string;
}
