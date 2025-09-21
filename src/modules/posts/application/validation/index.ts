export {
  createPostSchema,
  updatePostSchema,
  publishPostSchema,
  type CreatePostPayload,
  type UpdatePostPayload,
  type PublishPostPayload,
} from './schemas/post.schemas';

// Query schemas
export {
  postQuerySchema,
  searchPostsSchema,
  popularPostsSchema,
  type PostQuery,
  type SearchPostQuery,
  type PopularPostQuery,
} from './schemas/post-query.schemas';

// Category schemas
export {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from './schemas/category.schemas';

// Tag schemas
export {
  createTagSchema,
  tagSearchSchema,
  type CreateTagInput,
  type TagSearchInput,
} from './schemas/tag.schemas';

// Validator service
export { PostValidator } from './post.validator';

// Pipes
export { ZodValidationPipe } from '../../../../common/pipes/zod-validation.pipe';
export {
  UuidValidationPipe,
  SlugValidationPipe,
  PaginationValidationPipe,
} from './pipes/post-validation.pipes';

// Decorators
export { ZodBody } from '../../../../common/decorators/zod-body.decorator';
export { ZodQuery } from '../../../../common/decorators/zod-query.decorator';
export { ZodParam } from '../../../../common/decorators/zod-param.decorator';

// Guards
export { PostOwnershipGuard } from './guards/post-ownership.guard';
export {
  PostStatusGuard,
  RequiredPostStatus,
} from './guards/post-status.guard';

// Utils
export {
  sanitizeHtmlContent,
  validateTagNames,
  generateSlugFromTitle,
  validateImageUpload,
} from './utils/validation.utils';
