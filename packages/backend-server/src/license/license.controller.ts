import { Controller, Post, Body } from '@nestjs/common';

@Controller('validate')
export class LicenseController {
  @Post()
  async validate(@Body() licenseData: any) {
    // Validate deviceId against stored licenses
    return { isValid: true };
  }
}
