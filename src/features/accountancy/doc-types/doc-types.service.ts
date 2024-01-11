import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateDocTypeDto } from './dto/create-doc-type.dto';
import { UpdateDocTypeDto } from './dto/update-doc-type.dto';
import { DocType, DocTypeDocument } from './entities/doc-type.entity';

@Injectable()
export class DocTypesService extends DeletableMixin<DocType> {
  constructor(
    @InjectModel(DocType.name)
    private readonly docTypes: Model<DocTypeDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateDocTypeDto) {
    return this.docTypes.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.docTypes.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.docTypes.find().where('state').in(states).exec();
  }

  findAll() {
    return this.docTypes.find().exec();
  }

  async update(_id: string, dto: UpdateDocTypeDto) {
    return await this.docTypes
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
