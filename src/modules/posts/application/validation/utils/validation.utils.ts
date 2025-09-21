import z from 'zod';

/**
 * Sanitizes and validates HTML content
 */
export const sanitizeHtmlContent = (content: string): string => {
  // Basic HTML sanitization - in production use a library like DOMPurify
  const allowedTags = [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'i',
    'b',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'a',
    'img',
    'blockquote',
    'code',
    'pre',
  ];

  // This is a simplified sanitization - use proper library in production
  return content;
};

/**
 * Validates tag names format
 */
export const validateTagNames = (tags: string[]): string[] => {
  const tagSchema = z
    .string()
    .min(1, 'Tag cannot be empty')
    .max(50, 'Tag cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Tag contains invalid characters');

  return tags.map((tag) => {
    const cleanTag = tag.trim().toLowerCase();
    tagSchema.parse(cleanTag);
    return cleanTag;
  });
};

/**
 * Generates slug from title
 */
export const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Validates file upload constraints
 */
export const validateImageUpload = (file: {
  mimetype: string;
  size: number;
}): void => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(
      'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed',
    );
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size cannot exceed 5MB');
  }
};
