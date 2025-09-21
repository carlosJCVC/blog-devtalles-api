import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostStatus } from '../../../domain/enums/post-status.enum';
import type { PostsRepositoryInterface } from '../../../domain/repositories/posts.repository.interface';

export const RequiredPostStatus = Reflector.createDecorator<PostStatus[]>();

type AuthUser = { id: string };
type HttpRequestShape = {
  user?: AuthUser;
  params: Record<string, string>;
};

@Injectable()
export class PostStatusGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly postsRepository: PostsRepositoryInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredStatuses = this.reflector.get(
      RequiredPostStatus,
      context.getHandler(),
    );

    if (!requiredStatuses) {
      return true; // No status requirement
    }

    const request = context.switchToHttp().getRequest<HttpRequestShape>();
    const postId = +request.params.id || +request.params.postId;

    if (!postId) {
      throw new NotFoundException('Post ID not provided');
    }

    const post = await this.postsRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!requiredStatuses.includes(post.status as PostStatus)) {
      throw new BadRequestException(
        `Operation not allowed for post with status: ${post.status}`,
      );
    }

    return true;
  }
}
