import { faker } from '@faker-js/faker';
import { Calendar } from '@prisma/client';
export class CalendarFactory {
  static generateOne(): Calendar {
    return {
      uuid: faker.string.uuid(),
      name: faker.lorem.word(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
  }

  static generateMany(count: number): Calendar[] {
    return Array.from({ length: count }, () => this.generateOne());
  }
}
