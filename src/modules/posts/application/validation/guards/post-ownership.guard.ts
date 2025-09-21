import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { PostsRepositoryInterface } from '@src/modules/posts/domain/repositories';

type AuthUser = { id: number };
type HttpRequestShape = {
  user?: AuthUser;
  params: Record<string, string>;
};

@Injectable()
export class PostOwnershipGuard implements CanActivate {
  constructor(private readonly postsRepository: PostsRepositoryInterface) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<HttpRequestShape>();
    const postId = +request.params.id || +request.params.postId;
    const currentUserId = request.user?.id; // Assuming user is attached by auth guard

    if (!currentUserId) {
      throw new ForbiddenException('Authentication required');
    }

    if (!postId) {
      throw new NotFoundException('Post ID not provided');
    }

    const post = await this.postsRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== currentUserId) {
      throw new ForbiddenException('You can only modify your own posts');
    }

    return true;
  }
}
