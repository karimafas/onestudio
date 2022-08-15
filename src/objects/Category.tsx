export class Category {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
  
  static fromJson(json: { [key: string]: any }) {
    return new Category(json["id"], json["name"]);
  }
}
