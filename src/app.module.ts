import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { CustomerItemModule } from './modules/customer-item/customer-item.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ItemModule } from './modules/item/item.module';
import { MaterialModule } from './modules/material/material.module';
import { MaterialSellerModule } from './modules/material-seller/material-seller.module';
import { SellerModule } from './modules/seller/seller.module';
import { TandonModule } from './modules/tandon/tandon.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    FirebaseModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    ItemModule,
    InvoiceModule,
    CustomerItemModule,
    SellerModule,
    MaterialModule,
    MaterialSellerModule,
    ExpenseModule,
    TandonModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
