import { faker } from '@faker-js/faker';
import { Calendar, CalendarEntry } from '@prisma/client';
export class CalendarEntryFactory {
  static generateOne(calendar: Calendar): CalendarEntry {
    return {
      uuid: faker.string.uuid(),
      calendarUuid: calendar.uuid,
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      recurrenceRule: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
  }

  static generateMany(count: number, calendar: Calendar): CalendarEntry[] {
    return Array.from({ length: count }, () => this.generateOne(calendar));
  }
}
