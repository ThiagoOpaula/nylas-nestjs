import { Param, Controller, Get, Post, Req, Body, Query } from '@nestjs/common';
import { NylasService } from './nylas.service';
import { AvailabilitySingleMeeting, FreeBusy, createEvent } from './nylasDto';

@Controller('nylas')
export class NylasController {
  constructor(private readonly nylasService: NylasService) {}
  @Get('/freeBusy/:startTime/:endTime')
  getHello(@Param() freeBusyParams: FreeBusy, @Req() req: any): Promise<any> {
    return this.nylasService.freeBusy(freeBusyParams, req.nylas);
  }

  @Post('/getAvailability')
  getNylas(
    @Query() availabilitySingleMeeting: AvailabilitySingleMeeting,
    @Req() req: any,
  ): Promise<any> {
    return this.nylasService.getAvailability(
      availabilitySingleMeeting,
      req.nylas,
    );
  }

  @Post('/createEvent')
  createEvent(
    @Query() createEventQuery: createEvent,
    @Req() req: any,
  ): Promise<any> {
    return this.nylasService.createEvent(createEventQuery, req.nylas);
  }
}
