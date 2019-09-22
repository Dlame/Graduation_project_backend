import { Controller, Inject, Post, UseGuards, Req, Body, Delete, Get, Param, Query, Put } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthRequest } from 'src/common/express.custommerge';
import { Result } from 'src/common/result.interface';
import { Borrow } from 'src/entities/borrow.entity';

@Controller('borrow')
export class BorrowController {
    constructor(
        @Inject(BorrowService) private readonly borrowService: BorrowService,
    ) { }

    @Post()
    @UseGuards(AuthGuard())
    async createPost(
        @Req() req: UserAuthRequest,
        @Body() createInput: Borrow,
    ): Promise<Result> {
        createInput.user = req.user;
        await this.borrowService.create(createInput);
        return { return_code: '01', return_msg: '借阅成功' };
    }

    @Get('/current')
    @UseGuards(AuthGuard())
    async findCurrent(@Req() req: UserAuthRequest, @Query() query: { isBorrow: number, currentTime: string }): Promise<Result> {
        const data = await this.borrowService.findCurrent(req.user.id, query);
        return { return_code: '01', return_msg: '查询所有借阅成功', data };
    }

    @Get('/booksid/:id')
    @UseGuards(AuthGuard())
    async findOneBybooksId(@Req() req: UserAuthRequest, @Param() param: { id: number }): Promise<Result> {
        const data = await this.borrowService.findOneBybooksId(req.user.id, param.id);
        return { return_code: '01', return_msg: '查询借阅成功', data };
    }

    @Get('/overdue')
    @UseGuards(AuthGuard())
    async findOverdue(@Req() req: UserAuthRequest, @Query() query: { isBorrow: number, currentTime: string }): Promise<Result> {
        const data = await this.borrowService.findOverdue(req.user.id, query);
        return { return_code: '01', return_msg: '查询所有逾期成功', data };
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async remove(@Req() req: UserAuthRequest, @Param() id: number): Promise<Result> {
        await this.borrowService.remove(id, req.user.id);
        return { return_code: '01', return_msg: '修改成功' };
    }
}
