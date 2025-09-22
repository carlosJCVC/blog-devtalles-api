import { Injectable, Logger } from '@nestjs/common';
import {
  GetPopularPostsUseCase,
  GetPostsByAuthorUseCase,
  GetPostUseCase,
  GetRelatedPostsUseCase,
  ListPostsUseCase,
  SearchPostsUseCase,
} from '../use-cases';
import {
  CreatePostPayload,
  PopularPostQuery,
  PostQuery,
  PublishPostPayload,
  SearchPostQuery,
  UpdatePostPayload,
} from '../validation';
import { PaginatedResponse } from '../../domain/repositories';
import { ViewerInfo } from '../../domain/events/post-viewed.event';
import { PostEntity } from '../../domain/entities/post.entity';
import { CreatePostUseCase } from '../use-cases/commands/create-post.usecase';
import { UpdatePostUseCase } from '../use-cases/commands/update-post.usecase';
import { PublishPostUseCase } from '../use-cases/commands/publish-post.usecase';
import { DeletePostUseCase } from '../use-cases/commands/delete-post.usecase';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    // Command Use Cases
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly publishPostUseCase: PublishPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,

    // Query Use Cases
    private readonly getPostUseCase: GetPostUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly searchPostsUseCase: SearchPostsUseCase,
    private readonly getRelatedPostsUseCase: GetRelatedPostsUseCase,
    private readonly getPopularPostsUseCase: GetPopularPostsUseCase,
    private readonly getPostsByAuthorUseCase: GetPostsByAuthorUseCase,
  ) {}

  // commands
  async createPost(
    payload: CreatePostPayload,
    authorId: number,
  ): Promise<PostEntity> {
    this.logger.log(
      `Service: Creating post "${payload.title}" for author ${authorId}`,
    );

    return await this.createPostUseCase.execute(payload, authorId);
  }

  async updatePost(
    postId: number,
    input: UpdatePostPayload,
    updatedBy: number,
  ): Promise<PostEntity> {
    this.logger.log(`Service: Updating post ${postId}`);

    return await this.updatePostUseCase.execute(postId, input, updatedBy);
  }

  async publishPost(
    postId: number,
    input: PublishPostPayload = {},
  ): Promise<PostEntity> {
    this.logger.log(`Service: Publishing post ${postId}`);

    return await this.publishPostUseCase.execute(postId, input);
  }

  async deletePost(
    postId: number,
    deletedBy: number,
    hardDelete: boolean = false,
  ): Promise<void> {
    this.logger.log(
      `Service: Deleting post ${postId}, hardDelete: ${hardDelete}`,
    );

    return await this.deletePostUseCase.execute(postId, deletedBy, hardDelete);
  }

  // queries
  async getPostBySlug(
    slug: string,
    incrementViews: boolean = true,
    viewerInfo?: ViewerInfo,
  ): Promise<PostEntity> {
    this.logger.log(`Service: Getting post by slug ${slug} for public view`);

    return this.getPostUseCase.execute(slug, incrementViews, viewerInfo);
  }

  async getPostById(id: string): Promise<PostEntity> {
    this.logger.log(`Service: Getting post by ID ${id} for admin view`);

    return this.getPostUseCase.execute(id, false);
  }

  async listPosts(query: PostQuery): Promise<PaginatedResponse<PostEntity>> {
    this.logger.log(
      `Service: Listing posts with query: ${JSON.stringify(query)}`,
    );

    return this.listPostsUseCase.execute(query);
  }

  async searchPosts(
    input: SearchPostQuery,
  ): Promise<PaginatedResponse<PostEntity>> {
    this.logger.log(`Service: Searching posts with query: "${input.query}"`);

    return this.searchPostsUseCase.execute(input);
  }

  async getRelatedPosts(
    postId: number,
    limit: number = 5,
  ): Promise<PostEntity[]> {
    this.logger.log(`Service: Getting related posts for ${postId}`);

    return this.getRelatedPostsUseCase.execute(postId, limit);
  }

  async getPopularPosts(input: PopularPostQuery): Promise<PostEntity[]> {
    this.logger.log(`Service: Getting popular posts`);

    return this.getPopularPostsUseCase.execute(input);
  }

  async getPostsByAuthor(
    authorId: number,
    page: number = 1,
    limit: number = 10,
    includeDrafts: boolean = false,
  ): Promise<PaginatedResponse<PostEntity>> {
    this.logger.log(`Service: Getting posts by author ${authorId}`);

    return this.getPostsByAuthorUseCase.execute(
      authorId,
      page,
      limit,
      includeDrafts,
    );
  }
}
