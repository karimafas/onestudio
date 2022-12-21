export enum Images {
  addBlue = "add-blue.png",
  addCircle = "add-circle.png",
  addPurple = "add-purple.png",
  addWhite = "add-white.png",
  arrowRight = "arrow-right.png",
  backBlue = "back-blue.png",
  calendar = "calendar.png",
  check = "check.png",
  closePurple = "close-purple.png",
  closeWhite = "close-white.png",
  dashboardFocused = "dashboard-focused.png",
  dashboardUnfocused = "dashboard-unfocused.png",
  delete = "delete.png",
  edit = "edit.png",
  exit = "exit.png",
  faultBlue = "fault-blue.png",
  fault = "fault.png",
  fixBlue = "fix-blue.png",
  fix = "fix.png",
  forwardBlue = "forward-blue.png",
  forwardPurple = "forward-purple.png",
  forward = "forward.png",
  infoPurple = "info-purple.png",
  info = "info.png",
  inventoryFocused = "inventory-focused.png",
  inventoryUnfocused = "inventory-unfocused.png",
  inventoryWhite = "inventory-white.png",
  logoTyped = "logo-typed.png",
  logo = "logo.png",
  person = "person.png",
  save = "save.png",
  settingsFocused = "settings-focused.png",
  settingsUnfocused = "settings-unfocused.png",
  settings = "settings.png",
}

export class ImageHelper {
  static image(image: Images) {
    return require(`../assets/images/${image}`);
  }
}