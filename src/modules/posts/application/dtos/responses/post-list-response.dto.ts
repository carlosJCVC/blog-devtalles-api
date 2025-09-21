import { PostDto } from '../post.dto';
import { PaginationMetaDto } from './pagination-meta.dto';

export interface PostListResponseDto {
  data: PostDto[];
  meta?: PaginationMetaDto;
}
