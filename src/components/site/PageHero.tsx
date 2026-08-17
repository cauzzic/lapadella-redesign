export function PageHero({
  eyebrow,
  title,
  image,
  text,
}: {
  eyebrow?: string;
  title: string;
  image: string;
  text?: string;
}) {
  return (
    <section className="relative flex min-h-[60vh] items-end overflow-hidden">
      <img src={image} alt={title} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-16 md:px-8 md:pb-24">
        {eyebrow && <p className="eyebrow text-clay">{eyebrow}</p>}
        <h1 className="mt-3 text-5xl text-cream md:text-7xl">{title}</h1>
        {text && <p className="mt-5 max-w-xl text-cream/75 md:text-lg">{text}</p>}
      </div>
    </section>
  );
}
