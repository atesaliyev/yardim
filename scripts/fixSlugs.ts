import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function generateSeoSlug(str: string) {
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i',
    'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
    'é': 'e', 'â': 'a', 'î': 'i', 'û': 'u', 'ô': 'o',
    '&': '', '@': '', '#': '', '$': '', '%': '', '^': '', '*': '', '(': '', ')': '', '=': '', '?': '', '!': '', ',': '', '.': '', ':': '', ';': '', '"': '', '\'': '', '[': '', ']': '', '{': '', '}': '', '|': '', '<': '', '>': '', '/': '', '\\': '', '`': '', '~': '', '+': '', '–': '-', '—': '-', '’': '', '“': '', '”': '', '…': '', ' ': '-', '_': '-',
  };
  return (
    str
      .replace(/[çÇğĞıİöÖşŞüÜéâîûô&@#$%^*()=?!,.:;"'\[\]{}|<>/\\`~+–—’"“… _]/g, (match) => trMap[match] || '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/(^-|-$)/g, '')
  );
}

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(^|\s|[-/])([a-zçğıöşü])/g, (m, p1, p2) => p1 + p2.toUpperCase());
}

async function fixTableSlugs(table: string, titleField: string) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) throw error;
  for (const row of data) {
    const newSlug = generateSeoSlug(row[titleField]);
    const newTitle = toTitleCase(row[titleField]);
    if (row.slug !== newSlug || row[titleField] !== newTitle) {
      await supabase.from(table).update({ slug: newSlug, [titleField]: newTitle }).eq('id', row.id);
      console.log(`[${table}] Updated:`, row.id, '->', newSlug);
    }
  }
}

(async () => {
  try {
    await fixTableSlugs('categories', 'name');
    await fixTableSlugs('topics', 'title');
    await fixTableSlugs('guides', 'title');
    console.log('All slugs and titles fixed!');
  } catch (e) {
    console.error(e);
  }
})(); 