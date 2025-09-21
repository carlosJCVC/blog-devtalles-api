import { PrismaClient, PostStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const slugify = (input: string): string => {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '') // quita acentos/símbolos
    .trim()
    .replace(/\s+/g, '-') // espacios -> guiones
    .replace(/-+/g, '-');
};

const randomStatus = (): PostStatus => {
  // Distribución: más publicados, algunos drafts/scheduled, pocos archivados
  const bag: PostStatus[] = [
    PostStatus.PUBLISHED,
    PostStatus.PUBLISHED,
    PostStatus.PUBLISHED,
    PostStatus.PUBLISHED,
    PostStatus.DRAFT,
    PostStatus.DRAFT,
    PostStatus.SCHEDULED,
    PostStatus.ARCHIVED,
  ];
  return bag[Math.floor(Math.random() * bag.length)];
};

const datesForStatus = (status: PostStatus) => {
  const now = new Date();
  switch (status) {
    case PostStatus.PUBLISHED: {
      const daysAgo = faker.number.int({ min: 1, max: 90 });
      const published_at = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000,
      );
      return { published_at, scheduled_at: null as Date | null };
    }
    case PostStatus.SCHEDULED: {
      const daysAhead = faker.number.int({ min: 1, max: 30 });
      const scheduled_at = new Date(
        now.getTime() + daysAhead * 24 * 60 * 60 * 1000,
      );
      return { published_at: null as Date | null, scheduled_at };
    }
    case PostStatus.ARCHIVED: {
      const daysAgo = faker.number.int({ min: 120, max: 365 });
      const published_at = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000,
      );
      return { published_at, scheduled_at: null as Date | null };
    }
    case PostStatus.DRAFT:
    default:
      return {
        published_at: null as Date | null,
        scheduled_at: null as Date | null,
      };
  }
};

const resetDevData = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('🔒 Producción detectada: no se resetean datos.');
    return;
  }
  console.log('🧹 Reseteando datos (dev)…');
  await prisma.$transaction([
    prisma.postTag.deleteMany({}),
    prisma.postCategory.deleteMany({}),
    prisma.post.deleteMany({}),
    prisma.category.deleteMany({}),
    prisma.tag.deleteMany({}),
  ]);
};

const seedCategories = async () => {
  const base = [
    { name: 'Technology', color: '#4F46E5' },
    { name: 'Business', color: '#16A34A' },
    { name: 'Design', color: '#F97316' },
    { name: 'Tutorials', color: '#0EA5E9' },
    { name: 'Opinions', color: '#A855F7' },
    { name: 'News', color: '#EF4444' },
    { name: 'Reviews', color: '#22C55E' },
    { name: 'DevOps', color: '#10B981' },
  ];

  const created: any = [];
  for (const c of base) {
    const slug = slugify(c.name);
    const cat = await prisma.category.upsert({
      where: { slug },
      update: { name: c.name, color: c.color, isActive: true },
      create: { name: c.name, slug, color: c.color, isActive: true },
    });
    created.push(cat);
  }
  return created;
};

const seedTags = async () => {
  const base = [
    'nestjs',
    'prisma',
    'postgres',
    'docker',
    'typescript',
    'graphql',
    'testing',
    'ci-cd',
    'performance',
    'security',
    'best-practices',
    'linux',
    'nodejs',
    'rest',
    'microservices',
    'orm',
    'migrations',
    'kubernetes',
    'design-patterns',
    'monitoring',
  ];

  const created: any = [];
  for (const name of base) {
    const slug = slugify(name);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name, usageCount: 0 },
      create: { name, slug, usageCount: 0 },
    });
    created.push(tag);
  }
  return created;
};

const seedPosts = async (
  categories: { id: number }[],
  tags: { id: number }[],
) => {
  const authorPool = [1, 2, 3];
  const usedSlugs = new Set<string>();
  const POSTS = 30;

  for (let i = 0; i < POSTS; i++) {
    const title = faker.lorem.sentence({ min: 3, max: 8 });
    let slug = slugify(title);

    let k = 1;
    while (usedSlugs.has(slug)) {
      slug = `${slug}-${++k}`;
    }
    usedSlugs.add(slug);

    const content = faker.lorem.paragraphs(
      {
        min: 2,
        max: 6,
      },
      '\n\n',
    );
    const status = randomStatus();
    const { published_at, scheduled_at } = datesForStatus(status);
    const author_id = authorPool[Math.floor(Math.random() * authorPool.length)];

    // Métricas coherentes
    const views = faker.number.int({ min: 0, max: 8000 });
    const likes = faker.number.int({
      min: Math.floor(views * 0.02),
      max: Math.floor(views * 0.25),
    });
    const comments = faker.number.int({ min: 0, max: Math.floor(likes * 0.4) });

    const is_featured = Math.random() < 0.25 ? true : false;
    const featured_image_url = `https://picsum.photos/seed/${slug}/960/540`;

    const post = await prisma.post.upsert({
      where: { slug },
      update: {
        title,
        content,
        status,
        published_at,
        scheduled_at,
        author_id,
        is_featured,
        featured_image_url,
        views_count: views,
        likes_count: likes,
        comments_count: comments,
      },
      create: {
        title,
        slug,
        content,
        status,
        published_at,
        scheduled_at,
        author_id,
        is_featured,
        featured_image_url,
        views_count: views,
        likes_count: likes,
        comments_count: comments,
      },
    });

    await prisma.postCategory.deleteMany({ where: { postId: post.id } });
    await prisma.postTag.deleteMany({ where: { postId: post.id } });

    const catCount = faker.number.int({ min: 1, max: 3 });
    const tagCount = faker.number.int({ min: 2, max: 5 });

    const cats = faker.helpers
      .arrayElements(categories, catCount)
      .map((c) => ({ postId: post.id, categoryId: c.id }));
    const tgs = faker.helpers
      .arrayElements(tags, tagCount)
      .map((t) => ({ postId: post.id, tagId: t.id }));

    if (cats.length)
      await prisma.postCategory.createMany({
        data: cats,
        skipDuplicates: true,
      });
    if (tgs.length)
      await prisma.postTag.createMany({ data: tgs, skipDuplicates: true });
  }

  const counts = await prisma.postTag.groupBy({
    by: ['tagId'],
    _count: { tagId: true },
  });
  await Promise.all(
    counts.map((c) =>
      prisma.tag.update({
        where: { id: c.tagId },
        data: { usageCount: c._count.tagId },
      }),
    ),
  );
};

const main = async () => {
  faker.seed(42);

  await resetDevData();
  const categories = await seedCategories();
  const tags = await seedTags();
  await seedPosts(categories, tags);

  console.log('✅ Seed completed');
};

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
