/**
 * Emits JSON-LD. Next hoists this into <head> automatically.
 *
 * The JSON.stringify output is escaped so a "</script>" inside any string
 * cannot break out of the tag — the standard XSS hole in hand-rolled JSON-LD.
 */
export default function JsonLd({ schema }: { schema: object | object[] }) {
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
