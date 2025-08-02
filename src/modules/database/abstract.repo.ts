import { Injectable, NotFoundException } from '@nestjs/common';
import { AbstractSchema } from './abstract.schema';
import { Model, Types, FilterQuery, UpdateQuery } from 'mongoose';

@Injectable()
export abstract class AbstractRepo<TDocument extends AbstractSchema> {
  constructor(protected readonly model: Model<TDocument>) {}

  async createOne(data: Omit<TDocument, '_id'>): Promise<TDocument> {
    const insertedData = new this.model({
      ...data,
      _id: new Types.ObjectId(),
    });
    const saved = await insertedData.save();
    return saved;
  }

  async getOne(filter: FilterQuery<TDocument>): Promise<TDocument | null> {
    return this.model.findOne(filter).exec();
  }

  async getOneOrThrow(
    filter: FilterQuery<TDocument>,
    message = 'Document not found',
  ): Promise<TDocument> {
    const doc = await this.getOne(filter);
    if (!doc) throw new NotFoundException(message);
    return doc;
  }

  async getMany(
    filter: FilterQuery<TDocument> = {},
    options: {
      skip?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
    } = {},
  ): Promise<TDocument[]> {
    return this.model
      .find(filter)
      .skip(options.skip ?? 0)
      .limit(options.limit ?? 0)
      .sort(options.sort ?? {})
      .exec();
  }

  async updateOne(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    return this.model
      .findOneAndUpdate(filter, update, {
        new: true,
      })
      .exec();
  }

  async deleteOne(filter: FilterQuery<TDocument>): Promise<boolean> {
    const res = await this.model.deleteOne(filter).exec();
    return res.deletedCount > 0;
  }

  async deleteMany(filter: FilterQuery<TDocument>): Promise<number> {
    const res = await this.model.deleteMany(filter).exec();
    return res.deletedCount ?? 0;
  }

  async exists(filter: FilterQuery<TDocument>): Promise<boolean> {
    return this.model.exists(filter).then((doc) => doc !== null);
  }

  async count(filter: FilterQuery<TDocument> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
