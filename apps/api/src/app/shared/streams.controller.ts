import { Controller, Param, Sse } from '@nestjs/common';
import { StreamerService } from './streamer.service';

@Controller('streams')
export class StreamsController {
    constructor(private readonly streamService: StreamerService) {}

    @Sse('balance/:user_id')
    streamCurrentBalance(@Param('user_id') user_id: string) {
        return this.streamService.streamUserBalance(user_id);
    }
}
