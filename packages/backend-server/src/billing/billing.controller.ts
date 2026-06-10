import { Controller, Post, Get, Body, Param, UseGuards, Request, UsePipes, ValidationPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post('sales')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async createSale(@Request() req, @Body() data: CreateSaleDto) {
    return this.billingService.createSale(req.user.companyId, req.user.sub, data);
  }

  @Get('sales/:id')
  async getSale(@Param('id') id: string, @Request() req) {
    return this.billingService.getSaleById(id, req.user.companyId);
  }
}
