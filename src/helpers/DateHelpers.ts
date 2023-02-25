export enum TimeOfDay {
  morning,
  afternoon,
  evening,
}

export class DateHelper {
  static getTimeOfDay(): TimeOfDay {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    switch (true) {
      case currentHour < 12:
        return TimeOfDay.morning;
      case currentHour > 12 && currentHour < 17:
        return TimeOfDay.afternoon;
      default:
        return TimeOfDay.evening;
    }
  }

  static getGreeting() {
    const timeOfDay = this.getTimeOfDay();

    switch (timeOfDay) {
      case TimeOfDay.morning:
        return "Good morning";
      case TimeOfDay.afternoon:
        return "Good afternoon";
      case TimeOfDay.evening:
        return "Good evening";
    }
  }
}
