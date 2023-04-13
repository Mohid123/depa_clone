import { mongoose } from "./config/config";
import { Types } from "mongoose";
import ApiError from "./utils/ApiError";
import httpStatus from "http-status";

const baseSchema = new mongoose.Schema({}, { strict: false });

export class baseApiHelper {
  constructor() {}
  /**
   * create new dto
   * @param {Object} body 
   * @param {string} collectionName 
   * @returns {Promise<BaseResponse<T>>}
   */
  async post(body = {}, collectionName) {
    const Model = mongoose.model('Model', baseSchema, collectionName);
    if (!body.id) {
      body.id = new Types.ObjectId().toString();
    }
    else {
      const bodyItem = await Model.findById(body.id);
      if (!bodyItem) {
        bodyItem.id = bodyItem.id;
      } else {
        bodyItem.id = new Types.ObjectId().toString();
      }
    }
    const newItem = new Model(body);
    return this.mapAndCatchError(newItem.save());
  }

  /**
   * get all data or get data by query parameter
   * @param {any} queryFilter 
   * @param {string} collectionName 
   * @returns {Promise<BaseResponse<T>>}
   */
  async get(queryFilter, collectionName) {
    const Model = mongoose.model('Model', baseSchema, collectionName);
    return this.mapAndCatchError(Model.find(queryFilter).exec())
  }

  /**
   * update an item
   * @param {string} id 
   * @param {Object} body 
   * @param {string} collectionName 
   * @returns {Promise<BaseResponse<T>>}
   */
  async put(id, body, collectionName) {
    const Model = mongoose.model('Model', baseSchema, collectionName);
    const oldItem = await Model.findOne({ _id: id });
    if(!oldItem) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Item does not exist')
    }
    return this.mapAndCatchError(Model.updateOne({ _id: id }, body));
  }

  /**
   * delete an item
   * @param {string} id 
   * @param {string} collectionName
   * @returns 
   */
  async delete(id, collectionName) {
    const Model = mongoose.model('Model', baseSchema, collectionName);
    const oldItem = await Model.findOne({ _id: id });
    if(!oldItem) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Item does not exist')
    }
    return this.mapAndCatchError(Model.deleteOne({ _id: id }));
  }

  /**
   * get promise response object (resolved or rejected)
   * @param {Promise<any>} response 
   * @returns {Promise<BaseResponse<TData>>}
   */
  async mapAndCatchError(response) {
    return await response
    .then(res => {
      const result = new BaseResponse();
      result.status = true;
      Object.assign(result.data, res);
      return result;
    })
    .catch(err => {
      const result = new BaseResponse();
      result.status = false;
      result.errors.push({
        code: err.code,
        message: err.name
      });
      return result
    })
  }
}

// GENERIC RESPONSE MODEL
/**
 * @var {boolean} status
 * @var {T} data
 * @var {Array<any>} errors
 */
export class BaseResponse {
  constructor() {
    this.errors = [];
  }
  status;
  data;
  errors;
  getErrorsText() {
    return this.errors.map((e) => e.message).join(' ');
  }
  hasErrors() {
    return this.errors.length > 0;
  }
}