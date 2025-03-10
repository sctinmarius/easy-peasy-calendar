-- CreateTable
CREATE TABLE "calendars" (
    "uuid" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendars_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "calendar_entries" (
    "uuid" TEXT NOT NULL,
    "calendar_uuid" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "recurrence_rule" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_entries_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "calendar_entries" ADD CONSTRAINT "calendar_entries_calendar_uuid_fkey" FOREIGN KEY ("calendar_uuid") REFERENCES "calendars"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
