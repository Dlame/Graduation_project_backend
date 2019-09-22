import {
  Controller,
  Inject,
  Post,
  UseGuards,
  Req,
  Body,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthRequest } from 'src/common/express.custommerge';
import { Comment } from '../entities/comment.entity';
import { Result } from 'src/common/result.interface';
import { FindAllDTO } from './dtos/findAll.dto';

@Controller('comment')
export class CommentController {
  constructor(
    @Inject(CommentService) private readonly commentService: CommentService,
  ) { }

  @Post()
  @UseGuards(AuthGuard())
  async createPost(
    @Req() req: UserAuthRequest,
    @Body() createInput: Comment,
  ): Promise<Result> {
    createInput.user = req.user;
    await this.commentService.create(createInput);
    return { return_code: '01', return_msg: '评论成功' };
  }

  @Get('/:id')
  async findAll(@Param() param, @Query() query: FindAllDTO): Promise<Result> {
    const data = await this.commentService.findAll(param.id, query.page, query.size);
    return { return_code: '01', return_msg: '查询所有收藏成功', data };
  }
}
