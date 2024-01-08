import { Injectable } from '@nestjs/common';
import {
  AvailabilityMultipleDays,
  AvailabilitySingleMeeting,
  FreeBusy,
  createEvent,
} from './nylasDto';
import Event from 'nylas/lib/models/event';
import EventParticipant from 'nylas/lib/models/event-participant';
import { Days, RoundRobin } from 'nylas/lib/models/calendar-availability';
@Injectable()
export class NylasService {
  async freeBusy(freeBusyParams: FreeBusy, nylas: any): Promise<string> {
    // Check calendar free or busy status. in a specific time range
    // get begging of the day
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const unixNow = Math.floor(now.getTime() / 1000);

    const startTime = unixNow + freeBusyParams.startTime * 60 * 60; // current unix timestamp in seconds
    const endTime = unixNow + freeBusyParams.endTime * 60 * 60; // add 24 hours in seconds

    // const startTime = Math.floor(Date.now() / 1000); // current unix timestamp in seconds
    // const endTime = startTime + 60 * 60 * 24; // add 24 hours in seconds

    const freeBusy = await nylas.calendars.freeBusy({
      startTime: startTime,
      endTime: endTime,
      emails: ['thiago@objeto.ca'], // multiple calendars
    });

    return freeBusy;
  }

  async getAvailability(
    availabilitySingleMeeting: AvailabilitySingleMeeting,
    nylas: any,
  ): Promise<string> {
    // Check multiple calendars to find available time slots for a single meeting. It checks the provider's primary calendar.

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const unixNow = Math.floor(now.getTime() / 1000);

    const startTime = unixNow + availabilitySingleMeeting.startTime * 60 * 60; // current unix timestamp in seconds
    const endTime = unixNow + availabilitySingleMeeting.endTime * 60 * 60; // add 24 hours in seconds

    availabilitySingleMeeting.interval = Number(
      availabilitySingleMeeting.interval,
    );

    availabilitySingleMeeting.duration = Number(
      availabilitySingleMeeting.duration,
    );

    const availability = await nylas.calendars.availability({
      startTime: startTime, //1704200400
      endTime: endTime, //1704207600
      interval: availabilitySingleMeeting.interval, //30
      duration: availabilitySingleMeeting.duration, //30
      emails: ['thiago@objeto.ca', 'alex@objeto.ca'], // multiple calendars
      roundStart: true,
      roundRobin: 'max-availability',
      openHours: [
        {
          emails: ['alex@objeto.ca'],
          days: [Days.Wednesday],
          timezone: 'America/Sao_Paulo',
          start: '06:00',
          end: '07:00',
          object_type: 'open_hours',
        },
        {
          emails: ['thiago@objeto.ca'],
          days: [Days.Wednesday],
          timezone: 'America/Sao_Paulo',
          start: '06:00',
          end: '07:30',
          object_type: 'open_hours',
        },
      ],
    });

    console.log(availability);

    availability.timeSlots.forEach((element) => {
      element.startTime = new Date(element.startTime * 1000);
      element.endTime = new Date(element.endTime * 1000);
    });

    return availability;
  }

  async getAvailabilityRoundRobin(
    availabilityMultipleDays: AvailabilityMultipleDays,
    nylas: any,
  ): Promise<string> {
    // Check multiple calendars to find available time slots for a single meeting. It checks the provider's primary calendar.

    const startTime = Math.floor(
      // current unix timestamp in seconds
      new Date(availabilityMultipleDays.startTime).getTime() / 1000,
    );

    const endTime = Math.floor(
      // add 24 hours in seconds
      new Date(availabilityMultipleDays.endTime).getTime() / 1000,
    );

    console.log(new Date(availabilityMultipleDays.startTime));
    console.log(new Date(availabilityMultipleDays.endTime));

    availabilityMultipleDays.interval = Number(
      availabilityMultipleDays.interval,
    );

    availabilityMultipleDays.duration = Number(
      availabilityMultipleDays.duration,
    );

    const availability = await nylas.calendars.consecutiveAvailability({
      startTime: startTime, //1672542000
      endTime: endTime, //1688180400
      interval: availabilityMultipleDays.interval, //30
      duration: availabilityMultipleDays.duration, //30
      emails: [['thiago@objeto.ca'], ['alex@objeto.ca']], // multiple calendars
      openHours: [
        {
          emails: ['alex@objeto.ca'],
          days: [Days.Thursday],
          timezone: 'America/Sao_Paulo',
          start: '06:00',
          end: '07:00',
          object_type: 'open_hours',
        },
        {
          emails: ['thiago@objeto.ca'],
          days: [Days.Thursday],
          timezone: 'America/Sao_Paulo',
          start: '06:00',
          end: '07:00',
          object_type: 'open_hours',
        },
      ],
    });

    console.log(availability);

    return availability;
  }

  async createEvent(
    createEventQuery: createEvent,
    nylas: any,
  ): Promise<string> {
    const calendars = await nylas.calendars.list();
    let calendar;
    calendars.forEach((element) => {
      if (element.isPrimary) {
        calendar = element;
      }
    });

    //Create a new event
    const event = new Event(nylas);

    // Provide the appropriate id for a calendar to add the event to a specific calendar
    event.calendarId = calendar.id;

    // Start filling out other fields
    event.title = 'test nylas!';
    event.location = 'test nylas!';
    event.description = "Let's celebrate our calendar integration!!";
    event.busy = true;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const unixNow = Math.floor(now.getTime() / 1000);

    const startTime = unixNow + createEventQuery.startTime * 60 * 60; // current unix timestamp in seconds
    const endTime = unixNow + createEventQuery.endTime * 60 * 60; // add 24 hours in second

    // event.participants = [
    //   new EventParticipant({ name: 'alex', email: 'alex@objeto.ca' }),
    // ];

    event.when.startTime = startTime;
    event.when.endTime = endTime;

    event.start = startTime;
    event.end = endTime;

    // const webhookNotification = new EventNotification({ //webhook
    //   type: EventNotificationType.Webhook,
    //   minutesBeforeEvent: 600,
    //   url: 'https://hooks.service.com/services/T01A03EEXDE/B01TBNH532R/HubIZu1zog4oYdFqQ8VUcuiW',
    //   payload: JSON.stringify({
    //     text: 'Your reminder goes here!',
    //   }),
    // });

    const freeBusy = await nylas.calendars.freeBusy({
      //check availability
      startTime: startTime,
      endTime: endTime,
      emails: ['thiago@objeto.ca'], // multiple calendars
    });

    for (let i = 0; i < freeBusy.length; i++) {
      const currentItem = freeBusy[i];

      // Check if the current item has a timeSlots array
      if (
        currentItem &&
        currentItem.timeSlots.length > 0 &&
        Array.isArray(currentItem.timeSlots)
      ) {
        const timeSlots = currentItem.timeSlots;

        // Check each time slot's status
        const isAnyTimeSlotBusy = timeSlots.some(
          (slot) => slot.status === 'busy',
        );

        // If any time slot is busy, do something
        if (isAnyTimeSlotBusy) {
          console.log(`is occupied`);
          return 'occupied';
          // Perform additional actions if needed
        } else {
          console.log(`FreeBusy item ${i} has no busy time slots.`);
        }
      }
    }

    await event.save({ notify_participants: true });
    return 'sucessfully created';
  }
}
