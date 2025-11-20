import Script from 'next/script';

type Props = {
  data: object;
};

export default function StructuredData({ data }: Props) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
