import {
  Controller,
  Inject,
  Post,
  UseGuards,
  Req,
  Body,
  Param,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import { CollectService } from './collect.service';
import { AuthGuard } from '@nestjs/passport';
import { Collect } from '../entities/collect.entity';
import { Result } from 'src/common/result.interface';
import { UserAuthRequest } from '../common/express.custommerge';

@Controller('collect')
export class CollectController {
  constructor(
    @Inject(CollectService) private readonly collectService: CollectService,
  ) { }

  @Post()
  @UseGuards(AuthGuard())
  async createPost(
    @Req() req: UserAuthRequest,
    @Body() createInput: Collect,
  ): Promise<Result> {
    createInput.user = req.user;
    await this.collectService.create(createInput);
    return { return_code: '01', return_msg: '收藏成功' };
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async update(@Req() req: UserAuthRequest, @Param() id: number, @Body() updateInput: Collect): Promise<Result> {
    await this.collectService.update(id, req.user.id, updateInput);
    return { return_code: '01', return_msg: '修改成功' };
  }

  @Get()
  @UseGuards(AuthGuard())
  async findAll(@Req() req: UserAuthRequest): Promise<Result> {
    const data = await this.collectService.findAll(req.user.id);
    return { return_code: '01', return_msg: '查询所有收藏成功', data };
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  async findbyId(@Req() req: UserAuthRequest, @Param() param: { id: number }): Promise<Result> {
    const data = await this.collectService.findOneBybooksId(param.id, req.user.id);
    return { return_code: '01', return_msg: '查询收藏成功', data };
  }
}
