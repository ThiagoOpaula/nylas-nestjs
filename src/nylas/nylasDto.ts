import { ApiProperty } from '@nestjs/swagger';

export class FreeBusy {
  @ApiProperty({
    description: 'start time in hours',
  })
  startTime: number;

  @ApiProperty({
    description: 'end time in hours',
  })
  endTime: number;
}

export class createEvent {
  @ApiProperty({
    description: 'start time in hours',
  })
  startTime: number;

  @ApiProperty({
    description: 'end time in hours',
  })
  endTime: number;
}

export class AvailabilitySingleMeeting {
  @ApiProperty({
    description: 'hour to check',
    type: Number,
  })
  startTime: number;

  @ApiProperty({
    description: 'duration in hours',
    type: Number,
  })
  endTime: number;

  @ApiProperty({
    description: 'duration in minutes',
    type: Number,
  })
  interval: number;

  @ApiProperty({
    description: 'duration in minutes',
    type: Number,
  })
  duration: number;
}
