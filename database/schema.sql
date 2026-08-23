-- Draft PostgreSQL schema for the public standards metadata registry.
-- This schema stores metadata and source links only. Do not store copyrighted standards text or private PDF metadata.

create table publishers (
    id text primary key,
    name text not null unique,
    website_url text,
    country text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table standards (
    id text primary key,
    designation text not null,
    title text not null,
    publisher_id text references publishers(id),
    record_type text not null default 'standard',
    country_scope text,
    primary_category text,
    status text,
    summary text,
    official_url text,
    source_download_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (designation, publisher_id)
);

create table standard_editions (
    id text primary key,
    standard_id text not null references standards(id) on delete cascade,
    edition_label text not null,
    publication_year integer,
    published_date date,
    status text,
    supersedes_edition_id text references standard_editions(id),
    official_url text,
    source_download_url text,
    date_verified date,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (standard_id, edition_label)
);

create table jurisdictions (
    id text primary key,
    name text not null,
    country text not null,
    jurisdiction_type text not null,
    parent_jurisdiction_id text references jurisdictions(id),
    authority_notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table adoptions (
    id text primary key,
    standard_id text not null references standards(id) on delete cascade,
    edition_id text references standard_editions(id) on delete set null,
    jurisdiction_id text not null references jurisdictions(id) on delete cascade,
    adoption_status text not null,
    effective_date date,
    end_date date,
    authority_name text,
    authority_url text,
    amendment_notes text,
    date_verified date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table topics (
    id text primary key,
    name text not null unique,
    description text
);

create table standard_topics (
    standard_id text not null references standards(id) on delete cascade,
    topic_id text not null references topics(id) on delete cascade,
    primary key (standard_id, topic_id)
);

create table asset_types (
    id text primary key,
    name text not null unique,
    description text
);

create table standard_asset_types (
    standard_id text not null references standards(id) on delete cascade,
    asset_type_id text not null references asset_types(id) on delete cascade,
    primary key (standard_id, asset_type_id)
);

create table sources (
    id text primary key,
    standard_id text references standards(id) on delete cascade,
    edition_id text references standard_editions(id) on delete cascade,
    source_type text not null,
    source_title text not null,
    source_url text not null,
    publisher_or_authority text,
    date_accessed date not null,
    notes text,
    created_at timestamptz not null default now()
);

create table standard_relationships (
    id text primary key,
    source_standard_id text not null references standards(id) on delete cascade,
    target_standard_id text not null references standards(id) on delete cascade,
    relationship_type text not null,
    notes text,
    created_at timestamptz not null default now(),
    unique (source_standard_id, target_standard_id, relationship_type)
);

create index idx_standards_designation on standards (designation);
create index idx_standards_publisher on standards (publisher_id);
create index idx_editions_standard on standard_editions (standard_id);
create index idx_adoptions_standard on adoptions (standard_id);
create index idx_adoptions_jurisdiction on adoptions (jurisdiction_id);
create index idx_sources_standard on sources (standard_id);
