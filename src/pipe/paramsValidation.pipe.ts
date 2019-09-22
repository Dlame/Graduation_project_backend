import { Injectable, PipeTransform, ArgumentMetadata, HttpStatus } from "@nestjs/common"
import { validate } from "class-validator"
import { plainToClass } from "class-transformer"
import { ApiException } from "../common/api.exception"

@Injectable()
export class ParamsValidationPipe implements PipeTransform {

  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata

    // 如果参数不是类，而是普通 js对象 则不进行验证
    if (!metadata || !this.toValidate(metatype)) {
      return value
    }

    // 通过元数据和对象实例， 去构建原有类型
    const object = plainToClass(metatype, value)
    const errors = await validate(object)

    if (errors.length > 0) {
      // 获取到第一个没有通过的验证的错误对象
      let error = errors.shift()
      let constraints = error.constraints

      // 将未通过验证的字段的错误信息和状态码， 以ApiException的形式抛给我们的全局异常过滤器
      for (let key in constraints) {
        throw new ApiException(constraints[key], HttpStatus.BAD_REQUEST)
      }
    }

    return value

  }

  toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find(type => metatype === type)
  }


}