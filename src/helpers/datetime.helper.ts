export class DateTimeHelper {
  static getTimeStringConfig() {
    return {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h24',
    };
  }

  static compareTimes(time1: string, time2: string) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    if (hours1 < hours2) {
      return -1;
    } else if (hours1 > hours2) {
      return 1;
    } else if (minutes1 < minutes2) {
      return -1;
    } else if (minutes1 > minutes2) {
      return 1;
    } else {
      return 0;
    }
  }

  static isInPast(time: Date) {
    return new Date(time) < new Date();
  }
}
