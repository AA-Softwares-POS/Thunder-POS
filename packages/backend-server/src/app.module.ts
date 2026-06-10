import { Module } from '@nestjs/common';
import { SyncModule } from './sync/sync.module';
import { LicenseModule } from './license/license.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InventoryModule } from './inventory/inventory.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [SyncModule, LicenseModule, AuthModule, UserModule, InventoryModule, BillingModule],
})
export class AppModule {}
