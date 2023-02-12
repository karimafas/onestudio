export enum Images {
  addBlue = "add-blue.png",
  addCircle = "add-circle.png",
  addPurple = "add-purple.png",
  addWhite = "add-white.png",
  arrowRight = "arrow-right.png",
  attachDark = "attach-dark.png",
  backBlue = "back-blue.png",
  bellWhite = "bell-white.png",
  calendar = "calendar.png",
  changeWhite = "change-white.png",
  check = "check.png",
  closePurple = "close-purple.png",
  closeWhite = "close-white.png",
  complete = "complete.png",
  commentWhite = "comment-white.png",
  dashboardFocused = "dashboard-focused.png",
  dashboardUnfocused = "dashboard-unfocused.png",
  delete = "delete.png",
  duplicate = "duplicate.png",
  duplicateBlue = "duplicate-blue.png",
  duplicateWhite = "duplicate-white.png",
  edit = "edit.png",
  exit = "exit.png",
  faultBlue = "fault-blue.png",
  fault = "fault.png",
  filterLight = "filter-light.png",
  filterDark = "filter-dark.png",
  fixBlue = "fix-blue.png",
  fix = "fix.png",
  forwardBlue = "forward-blue.png",
  forwardPurple = "forward-purple.png",
  forward = "forward.png",
  infoPurple = "info-purple.png",
  info = "info.png",
  inventoryFocused = "inventory-focused.png",
  inventoryPurple = "inventory-purple.png",
  inventoryUnfocused = "inventory-unfocused.png",
  inventoryWhite = "inventory-white.png",
  logoTyped = "logo-typed.png",
  logo = "logo.png",
  person = "person.png",
  save = "save.png",
  settingsFocused = "settings-focused.png",
  settingsUnfocused = "settings-unfocused.png",
  settings = "settings.png",
  spinner = "spinner.png",
  uploadCloud = "upload-cloud.png",
  uploadFile = "upload-file.png",
  users = "users.png",
}

export class ImageHelper {
  static image(image: Images) {
    return require(`../assets/images/${image}`);
  }
}
