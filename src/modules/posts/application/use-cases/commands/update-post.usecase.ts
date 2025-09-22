import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import type { PostsRepositoryInterface } from '@src/modules/posts/domain/repositories';
import { POSTS_REPOSITORY_TOKEN } from '@src/modules/posts/domain/repositories/posts.repository.interface';
import { PostValidator, UpdatePostPayload } from '../../validation';
import {
  EVENT_BUS_TOKEN,
  type EventBus,
} from '@src/common/domain/events/event-bus.interface';
import { PostEntity } from '@src/modules/posts/domain/entities/post.entity';
import { PostNotFoundException } from '@src/modules/posts/domain/exceptions';
import { toError } from '@src/common/errors/to-error';

@Injectable()
export class UpdatePostUseCase {
  private readonly logger = new Logger(UpdatePostUseCase.name);

  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,
    private readonly postValidator: PostValidator,

    @Inject(EVENT_BUS_TOKEN)
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    postId: number,
    payload: UpdatePostPayload,
    updatedBy: number,
  ): Promise<PostEntity> {
    this.logger.log(`Updating post: ${postId} by user: ${updatedBy}`);

    try {
      const post = await this.postsRepository.findById(postId);
      if (!post) {
        throw new PostNotFoundException(postId);
      }

      if (!post.canBeEdited()) {
        throw new ForbiddenException('Published posts cannot be edited');
      }

      await this.updateContentFields(post, payload);

      if (payload.categoryIds !== undefined) {
        await this.updateCategories(post, payload.categoryIds);
      }

      if (payload.tags !== undefined) {
        // TODO reserved for tags
      }

      this.updateOtherFields(post, payload);

      await this.postsRepository.update(post);
      const postUpdated = await this.postsRepository.findById(postId);

      if (!postUpdated) {
        throw new PostNotFoundException(postId);
      }

      await this.publishDomainEvents(postUpdated);

      this.logger.log(`Post updated successfully: ${postUpdated.id}`);
      return postUpdated;
    } catch (err) {
      const error = toError(err);
      this.logger.error(`Failed to update post: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async updateContentFields(
    post: PostEntity,
    payload: UpdatePostPayload,
  ): Promise<void> {
    // Check if slug needs validation
    if (payload.slug && payload.slug !== post.slug) {
      await this.postValidator.validateSlugUniqueness(payload.slug, post.id);
    }

    // Update content using domain method
    post.updateContent(payload.title, payload.content, payload.slug);
  }

  private async updateCategories(
    post: PostEntity,
    categoryIds: number[],
  ): Promise<void> {
    if (categoryIds.length > 0) {
      await this.postValidator.validateCategoryIds(categoryIds);
    }

    post.assignCategories(categoryIds);
  }

  private updateOtherFields(
    post: PostEntity,
    payload: UpdatePostPayload,
  ): void {
    if (payload.featuredImageUrl !== undefined) {
      if (payload.featuredImageUrl === '') {
        post.removeFeaturedImage();
      } else {
        post.setFeaturedImage(payload.featuredImageUrl);
      }
    }

    if (payload.allowComments !== undefined) {
      if (post.allowComments !== payload.allowComments) {
        post.toggleComments();
      }
    }
  }

  private async publishDomainEvents(post: PostEntity): Promise<void> {
    const events = post.domainEvents;

    for (const event of events) {
      await this.eventBus.publish(event);
    }

    post.clearDomainEvents();
  }
}
