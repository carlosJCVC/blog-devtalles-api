import { PaginationMetaDto } from '../pagination-meta.dto';
import { PostResponseDto } from './post.response.dto';

export class PostListResponseDto {
  data: PostResponseDto[];

  meta?: PaginationMetaDto;
}
