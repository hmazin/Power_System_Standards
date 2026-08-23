import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileDown, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { getStandardById, getStandards } from "@/lib/standards";

type StandardPageProps = {
  params: Promise<{
    standardId: string;
  }>;
};

export function generateStaticParams() {
  return getStandards().map((standard) => ({
    standardId: standard.standard_id
  }));
}

export async function generateMetadata({
  params
}: StandardPageProps): Promise<Metadata> {
  const { standardId } = await params;
  const standard = getStandardById(decodeURIComponent(standardId));

  if (!standard) {
    return {
      title: "Standard Not Found"
    };
  }

  return {
    title: standard.designation,
    description: standard.summary,
    openGraph: {
      title: `${standard.designation}: ${standard.title}`,
      description: standard.summary
    }
  };
}

export default async function StandardPage({ params }: StandardPageProps) {
  const { standardId } = await params;
  const standard = getStandardById(decodeURIComponent(standardId));

  if (!standard) {
    notFound();
  }

  return (
    <main className="detail-shell">
      <div className="detail-topbar">
        <Link className="icon-link" href="/">
          <ArrowLeft aria-hidden="true" size={18} />
          Registry
        </Link>
        <div className="detail-actions">
          {standard.source_download_url ? (
            <a
              className="download-button"
              href={standard.source_download_url}
              rel="noreferrer"
              target="_blank"
            >
              Direct Download
              <FileDown aria-hidden="true" size={16} />
            </a>
          ) : null}
          <a
            className="source-button"
            href={standard.official_url}
            rel="noreferrer"
            target="_blank"
          >
            Official Source
            <ExternalLink aria-hidden="true" size={16} />
          </a>
        </div>
      </div>

      <section className="detail-header">
        <div>
          <p className="eyebrow">{standard.publisher}</p>
          <h1>{standard.designation}</h1>
          <p className="detail-title">{standard.title}</p>
        </div>
      </section>

      <section className="detail-grid" aria-label="Standard metadata">
        <MetadataItem label="Latest Edition" value={standard.latest_known_edition} />
        <MetadataItem label="Country Scope" value={standard.country_scope} />
        <MetadataItem label="Category" value={standard.primary_category} />
        <MetadataItem label="Record Type" value={standard.record_type} />
        <MetadataItem label="Applicability" value={standard.applicability} />
      </section>

      <section className="detail-panel">
        <div className="panel-heading">
          <FileText aria-hidden="true" size={20} />
          <h2>Applicability Summary</h2>
        </div>
        <p>{standard.summary}</p>
      </section>

      <section className="detail-panel">
        <h2>Notes</h2>
        <p>{standard.notes}</p>
      </section>
    </main>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="metadata-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
