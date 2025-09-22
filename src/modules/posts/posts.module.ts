import { Module } from '@nestjs/common';
import { PrismaPostsRepository } from './infrastructure/repositories';
import { PostValidator } from './application/validation';
import { POSTS_REPOSITORY_TOKEN } from './domain/repositories/posts.repository.interface';
import {
  GetPopularPostsUseCase,
  GetPostsByAuthorUseCase,
  GetPostUseCase,
  GetRelatedPostsUseCase,
  ListPostsUseCase,
  SearchPostsUseCase,
} from './application/use-cases';
import {
  PostCreatedHandler,
  PostPublishedHandler,
  PostScheduledHandler,
  PostViewedHandler,
} from './application/event-handlers';
import { PostsController } from './infrastructure/controllers/posts.controller';
import { PostsService } from './application/services/posts.service';
import { PostExceptionFilter } from './infrastructure/filters/post-exception.filter';
import { PostResponseInterceptor } from './infrastructure/interceptors/post-response.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CreatePostUseCase } from './application/use-cases/commands/create-post.usecase';
import { UpdatePostUseCase } from './application/use-cases/commands/update-post.usecase';
import { PublishPostUseCase } from './application/use-cases/commands/publish-post.usecase';
import { DeletePostUseCase } from './application/use-cases/commands/delete-post.usecase';
import { CATEGORY_REPOSITORY_TOKEN } from './domain/repositories/categories.repository.interface';
import { PrismaCategoriesRepository } from './infrastructure/repositories/prisma-categories.repository';
import { AdminPostsController } from './infrastructure/controllers/admin-posts.controller';
// import { CommonModule } from '@src/common/common.module';

@Module({
  controllers: [PostsController, AdminPostsController],
  providers: [
    // Repository Implementations
    {
      provide: POSTS_REPOSITORY_TOKEN,
      useClass: PrismaPostsRepository,
    },
    {
      provide: CATEGORY_REPOSITORY_TOKEN,
      useClass: PrismaCategoriesRepository,
    },

    // Validation
    PostValidator,

    PostsService,

    // Use Cases - Queries
    GetPostUseCase,
    ListPostsUseCase,
    SearchPostsUseCase,
    GetRelatedPostsUseCase,
    GetPopularPostsUseCase,
    GetPostsByAuthorUseCase,

    // commands
    CreatePostUseCase,
    UpdatePostUseCase,
    PublishPostUseCase,
    DeletePostUseCase,

    // Event Handlers
    PostCreatedHandler,
    PostPublishedHandler,
    PostViewedHandler,
    PostScheduledHandler,

    // Global Exception Filter for this module
    {
      provide: APP_FILTER,
      useClass: PostExceptionFilter,
    },

    // Global Response Interceptor for this module
    {
      provide: APP_INTERCEPTOR,
      useClass: PostResponseInterceptor,
    },
  ],
  exports: [
    PostsService,
    // Export use cases for controllers to use
    GetPostUseCase,
    ListPostsUseCase,
    SearchPostsUseCase,
    GetRelatedPostsUseCase,
    GetPopularPostsUseCase,
    GetPostsByAuthorUseCase,

    // Export repositories for potential external use
    POSTS_REPOSITORY_TOKEN,
    CATEGORY_REPOSITORY_TOKEN,
  ],
})
export class PostsModule {}
