import { Controller, Post, Body } from '@nestjs/common';

@Controller('sync')
export class SyncController {
  @Post()
  async handleSync(@Body() syncData: any) {
    // Process incoming sync payload from desktop apps
    return { success: true };
  }
}
