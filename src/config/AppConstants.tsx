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
    new AppColumn("serial", true),
    new AppColumn("notes", false),
    new AppColumn("owner", true),
    new AppColumn("status", false),
  ];

  static tableColumns = [
    new TableColumn("details", "Details", true, 15, 0),
    new TableColumn("price", "Price", true, 10, 0),
    new TableColumn("location", "Location", true, 10, 0),
    new TableColumn("category", "Category", true, 10, 0),
    new TableColumn("serial", "Serial", true, 10, 1),
    new TableColumn("notes", "Notes", true, 10, 1),
    new TableColumn("owner", "Owner", true, 5, 1),
    new TableColumn("status", "Status", false, 10, 1),
  ];

  static routesWithoutSidebar: string[] = [
    "login",
    "import",
    "reset-password",
    "invitation",
  ];
  static unauthorisedRoutes: string[] = ["reset-password", "invitation"];

  static hasSidebar(location: string) {
    if (this.routesWithoutSidebar.includes(location.replace("/", "")))
      return false;
    return true;
  }
}
