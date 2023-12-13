import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  TRANSACTION_POPULATION,
  Transaction,
  TransactionDocument,
  TransactionStatus,
} from './entities/transaction.entity';

@Injectable()
export class TransactionsService extends DeletableMixin<Transaction> {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactions: Model<TransactionDocument>,
  ) {
    super();
  }

  create(dto: CreateTransactionDto) {
    return this.transactions.create(dto);
  }

  findTransactionsByAuthor(author: string) {
    return this.transactions
      .find({ author })
      .populate(TRANSACTION_POPULATION)
      .exec();
  }

  findAllTransactions() {
    return this.transactions.find().populate(TRANSACTION_POPULATION).exec();
  }

  findTransactionsByGroup(org: string) {
    return this.transactions.find({ org }).populate(TRANSACTION_POPULATION);
  }

  async findOne(_id: string, populate = true) {
    const transaction = this.transactions.findById(_id).orFail();
    if (populate) return transaction.populate(TRANSACTION_POPULATION).exec();
    return transaction.exec();
  }

  update(_id: string, dto: UpdateTransactionDto) {
    return this.transactions.updateOne(
      { _id },
      {
        $set: dto,
      },
    );
  }

  approveTransaction(_id: string) {
    return this.transactions
      .findByIdAndUpdate(_id, {
        $set: {
          approuved: true,
          status: TransactionStatus.completed,
        },
      })
      .orFail()
      .exec();
  }

  rejectTransaction(_id: string) {
    return this.transactions
      .findByIdAndUpdate(_id, {
        $set: {
          approuved: false,
          status: TransactionStatus.failed,
        },
      })
      .orFail()
      .exec();
  }

  async isValidatorOf(accountId: string, transactionId: string) {
    try {
      await this.transactions
        .findOne({ _id: transactionId, validator: accountId })
        .orFail();
      return true;
    } catch (ex) {
      return false;
    }
  }
}
