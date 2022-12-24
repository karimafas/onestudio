export class TableColumn {
  id: string;
  name: string;
  required: boolean;
  widthPercent: number;
  priority: number;

  constructor(
    id: string,
    name: string,
    required: boolean,
    widthPercent: number,
    priority: number
  ) {
    this.id = id;
    this.name = name;
    this.required = required;
    this.widthPercent = widthPercent;
    this.priority = priority;
  }
}
