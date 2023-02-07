export class FileUpload {
  id: number;
  name: string;
  path: string;
  url: string;
  createdAt: Date;

  constructor(
    id: number,
    name: string,
    path: string,
    url: string,
    createdAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.url = url;
    this.createdAt = createdAt;
  }

  static fromJson(json: { [key: string]: any }): FileUpload {
    return new FileUpload(
      json.id,
      json.name,
      json.path,
      json.url,
      json.createdAt
    );
  }

  static fromJsonArray(json: any[]): FileUpload[] {
    const attachments = [];
    for (const file of json) {
      attachments.push(FileUpload.fromJson(file));
    }
    return attachments;
  }
}
