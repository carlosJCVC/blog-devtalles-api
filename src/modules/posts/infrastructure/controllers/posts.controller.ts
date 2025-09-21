import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { PostsService } from '../../application/services/posts.service';
import type { Request as Req } from 'express';
import { ZodQuery } from '@src/common/decorators/zod-query.decorator';
import { PostListResponseDto } from '../../application/dtos/responses/post-list.response.dto';
import { PostStatus } from '../../domain/enums/post-status.enum';
import { PostMapper } from '../../application/mappers/post.mapper';
import {
  type CreatePostPayload,
  createPostSchema,
  popularPostsSchema,
  postQuerySchema,
  searchPostsSchema,
  ZodBody,
  ZodParam,
} from '../../application/validation';
import type {
  PopularPostQuery,
  PostQuery,
  SearchPostQuery,
} from '../../application/validation/schemas/post-query.schemas';
import { PostResponseDto } from '../../application/dtos/responses/post.response.dto';
import {
  idNumberSchema,
  slugSchema,
} from '../../application/validation/schemas/param.schemas';

interface AppRequest extends Req {
  user?: { id: string | number };
  sessionID?: string; // si usas express-session
}

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(
    @ZodQuery(postQuerySchema) query: PostQuery,
  ): Promise<PostListResponseDto> {
    this.logger.log(`GET /posts - Query: ${JSON.stringify(query)}`);

    const publicQuery = { ...query, status: PostStatus.PUBLISHED };

    const result = await this.postsService.listPosts(publicQuery);

    return {
      data: result.data.map((item) => PostMapper.fromEntity(item)),
      meta: result.meta,
    };
  }

  @Get('popular')
  async getPopularPosts(
    @ZodQuery(popularPostsSchema) query: PopularPostQuery,
  ): Promise<PostListResponseDto> {
    this.logger.log(`GET /posts/popular - Query: ${JSON.stringify(query)}`);

    const result = await this.postsService.getPopularPosts(query);

    return {
      data: result.map((item) => PostMapper.fromEntity(item)),
    };
  }

  @Get('search')
  async searchPosts(
    @ZodQuery(searchPostsSchema) query: SearchPostQuery,
  ): Promise<PostListResponseDto> {
    this.logger.log(`GET /posts/search - Query: "${query.query}"`);

    const result = await this.postsService.searchPosts(query);

    return {
      data: result.data.map((item) => PostMapper.fromEntity(item)),
      meta: result.meta,
    };
  }

  @Get(':slug')
  async getPostBySlug(
    @ZodParam('slug', slugSchema) slug: string,
    @Request() req: AppRequest,
  ): Promise<PostResponseDto> {
    this.logger.log(`GET /posts/${slug}`);

    // Extract viewer info for analytics
    const viewerInfo = {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id.toString(), // If authenticated
      sessionId: req.sessionID,
    };

    const post = await this.postsService.getPostBySlug(slug, true, viewerInfo);

    return PostMapper.fromEntity(post);
  }

  @Get(':postId/related')
  async getRelatedPosts(
    @ZodParam('postId', idNumberSchema) postId: number,
    @Query('limit') limit: number = 5,
  ): Promise<PostListResponseDto> {
    this.logger.log(`GET /posts/${postId}/related`);

    const result = await this.postsService.getRelatedPosts(postId, limit);

    return {
      data: result.map((item) => PostMapper.fromEntity(item)),
    };
  }

  @Post()
  // @UseGuards(JwtAuthGuard) // Uncomment when auth is implemented
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @ZodBody(createPostSchema) payload: CreatePostPayload,
    @Request() req: AppRequest,
  ): Promise<PostResponseDto> {
    // For now, mock the author ID - replace with real auth
    const authorId = req.user?.id || 2;

    this.logger.log(`POST /posts - Creating post: "${payload.title}"`);

    const post = await this.postsService.createPost(payload, +authorId);

    return PostMapper.fromEntity(post);
  }
}
