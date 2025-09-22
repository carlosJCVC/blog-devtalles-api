import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import type { Request as Req } from 'express';
import { PostsService } from '../../application/services/posts.service';
import { ZodQuery } from '@src/common/decorators/zod-query.decorator';
import {
  type PostQuery,
  postQuerySchema,
  type PublishPostPayload,
  publishPostSchema,
  type UpdatePostPayload,
  updatePostSchema,
  ZodBody,
  ZodParam,
} from '../../application/validation';
import { PaginatedResponse } from '../../domain/repositories';
import { PostDto } from '../../application/dtos/post.dto';
import { PostMapper } from '../../application/mappers/post.mapper';
import { idNumberSchema } from '../../application/validation/schemas/param.schemas';

interface AppRequest extends Req {
  user?: { id: number };
  sessionID?: string; // si usas express-session
}

@Controller('admin/posts')
// @UseGuards(JwtAuthGuard) // Uncomment when auth is implemented
export class AdminPostsController {
  private readonly logger = new Logger(AdminPostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts(
    @ZodQuery(postQuerySchema) query: PostQuery,
  ): Promise<PaginatedResponse<PostDto>> {
    this.logger.log(`GET /admin/posts - Query: ${JSON.stringify(query)}`);

    const result = await this.postsService.listPosts(query);

    return {
      data: result.data.map((item) => PostMapper.fromEntity(item)),
      meta: result.meta,
    };
  }

  @Get(':id')
  async getPostById(
    @ZodParam('id', idNumberSchema) id: number,
  ): Promise<PostDto> {
    this.logger.log(`GET /admin/posts/${id}`);

    const post = await this.postsService.getPostById(id.toString());

    return PostMapper.fromEntity(post);
  }

  @Put(':id')
  async updatePost(
    @ZodParam('id', idNumberSchema) id: number,
    @ZodBody(updatePostSchema) input: UpdatePostPayload,
    @Request() req: AppRequest,
  ): Promise<PostDto> {
    // Mock user ID - replace with real auth
    const updatedBy = req.user?.id || 0;

    this.logger.log(`PUT /admin/posts/${id} - Updating post`);

    const post = await this.postsService.updatePost(id, input, updatedBy);

    return PostMapper.fromEntity(post);
  }

  @Patch(':id/publish')
  async publishPost(
    @ZodParam('id', idNumberSchema) id: number,
    @ZodBody(publishPostSchema) input: PublishPostPayload,
  ): Promise<PostDto> {
    this.logger.log(`PATCH /admin/posts/${id}/publish`);

    const post = await this.postsService.publishPost(id, input);

    return PostMapper.fromEntity(post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @ZodParam('id', idNumberSchema) id: number,
    @Query('hard') hardDelete: boolean = false,
    @Request() req: AppRequest,
  ): Promise<void> {
    // Mock user ID - replace with real auth
    const deletedBy = req.user?.id || 0;

    this.logger.log(`DELETE /admin/posts/${id} - Hard delete: ${hardDelete}`);

    await this.postsService.deletePost(id, deletedBy, hardDelete);
  }
}
