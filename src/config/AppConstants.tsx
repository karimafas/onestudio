import { TableColumn } from "../objects/TableColumn";

export class AppColumn {
  name: string;
  required: boolean;

  constructor(name: string, required: boolean) {
    this.name = name;
    this.required = required;
  }
}

export class AppConstants {
  static columns = [
    new AppColumn("manufacturer", true),
    new AppColumn("model", true),
    new AppColumn("price", true),
    new AppColumn("location", true),
    new AppColumn("category", true),
    new AppColumn("owner", true),
    new AppColumn("m_number", true),
    new AppColumn("serial", true),
    new AppColumn("notes", false),
  ];

  static tableColumns = [
    new TableColumn("select", "", true, 5, 0),
    new TableColumn("details", "Details", true, 10, 0),
    new TableColumn("price", "Price", true, 10, 0),
    new TableColumn("location", "Location", true, 10, 0),
    new TableColumn("category", "Category", true, 10, 0),
    new TableColumn("owner", "Owner", true, 10, 0),
    new TableColumn("mNumber", "M-Number", true, 15, 0),
    new TableColumn("serial", "Serial", true, 10, 0),
    new TableColumn("notes", "Notes", true, 10, 1),
  ];

  static routesWithoutSidebar: string[] = ["login", "import"];

  static hasSidebar(location: string) {
    if (this.routesWithoutSidebar.includes(location.replace("/", "")))
      return false;
    return true;
  }
}
