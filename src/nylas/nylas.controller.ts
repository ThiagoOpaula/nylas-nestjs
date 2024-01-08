import { Param, Controller, Get, Post, Req, Body, Query } from '@nestjs/common';
import { NylasService } from './nylas.service';
import {
  AvailabilityMultipleDays,
  AvailabilitySingleMeeting,
  FreeBusy,
  createEvent,
} from './nylasDto';

@Controller('nylas')
export class NylasController {
  constructor(private readonly nylasService: NylasService) {}
  @Get('/freeBusy/:startTime/:endTime')
  getFreeBusy(
    @Param() freeBusyParams: FreeBusy,
    @Req() req: any,
  ): Promise<any> {
    return this.nylasService.freeBusy(freeBusyParams, req.nylas);
  }

  @Post('/getAvailability')
  getAvailability(
    @Query() availabilitySingleMeeting: AvailabilitySingleMeeting,
    @Req() req: any,
  ): Promise<any> {
    return this.nylasService.getAvailability(
      availabilitySingleMeeting,
      req.nylas,
    );
  }

  @Post('/getAvailabilityRoundRobin')
  getNylas(
    @Query() availabilityMultipleDays: AvailabilityMultipleDays,
    @Req() req: any,
  ): Promise<any> {
    return this.nylasService.getAvailabilityRoundRobin(
      availabilityMultipleDays,
      req.nylas,
    );
  }

  @Post('/createEvent')
  async createEvent(
    @Query() createEventQuery: createEvent,
    @Req() req: any,
  ): Promise<any> {
    // function delay(ms: number) {
    //   return new Promise((resolve) => setTimeout(resolve, ms));
    // }

    // this.nylasService.createEvent(createEventQuery, req.nylas);
    // await delay(5000);
    return this.nylasService.createEvent(createEventQuery, req.nylas);
  }
}
