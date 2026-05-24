"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import useProjects from "@/hooks/useProjects";
import { normalizeProjectRecord } from "@/Lib/projectData";
import en from "@/translations/en.json";
import tr from "@/translations/tr.json";
import styles from "./ProjectDetail.module.css";

const STATUS_TRANSLATIONS = {
  en: {
    active: "Active",
    "work in progress": "Work in Progress",
    completed: "Completed",
    archived: "Archived",
  },
  tr: {
    active: "Aktif",
    "work in progress": "Devam Ediyor",
    completed: "Tamamlandi",
    archived: "Arsivlendi",
  },
};

function parseSections(rawSections) {
  if (Array.isArray(rawSections)) return rawSections;
  if (typeof rawSections !== "string") return [];

  try {
    const parsed = JSON.parse(rawSections);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeRows(section) {
  if (Array.isArray(section?.data?.rows)) {
    return section.data.rows.map((row) => ({
      key: row?.key || "-",
      value: row?.value || "N/A",
    }));
  }

  if (section?.data && typeof section.data === "object") {
    return Object.entries(section.data).map(([key, value]) => ({
      key: key.replaceAll("_", " "),
      value: value || "N/A",
    }));
  }

  return [];
}

function normalizeVideos(sections) {
  return sections.flatMap((section) => {
    const rawVideos = Array.isArray(section?.data?.videos)
      ? section.data.videos
      : [];

    return rawVideos
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            id: `${item}-${index}`,
            title: "",
            url: item,
          };
        }

        return {
          id: item?.id || `${item?.url || "video"}-${index}`,
          title: item?.title || "",
          url: item?.url || "",
        };
      })
      .filter((item) => item.url);
  });
}

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;
  if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  return url;
}

function getProjectDetailCopy(lang, projectName) {
  const statusLabels = STATUS_TRANSLATIONS[lang] || STATUS_TRANSLATIONS.en;

  return {
    back: lang === "tr" ? "Projelere Don" : "Back to Projects",
    dossier: lang === "tr" ? "Proje Dosyasi" : "Project Dossier",
    heroEyebrow: lang === "tr" ? "Atmosferik Brifing" : "Atmospheric Briefing",
    loading: lang === "tr" ? "Proje yukleniyor..." : "Loading project...",
    notFound: lang === "tr" ? "Proje bulunamadi." : "Project not found.",
    heroPlaceholder:
      lang === "tr"
        ? "Kurgulanmis kahraman medyasi yakinda eklenecek."
        : "Curated hero media will be added soon.",
    gallery: lang === "tr" ? "Galeri" : "Gallery",
    videos: lang === "tr" ? "Videolar" : "Videos",
    specEmpty:
      lang === "tr"
        ? "Teknik ozellikler yakinda eklenecek."
        : "Specifications will be added soon.",
    detailFallback:
      lang === "tr" ? "Detaylar yakinda eklenecek." : "Details coming soon.",
    contactTitle:
      lang === "tr"
        ? `${projectName || "Bu proje"} ile ilgileniyor musunuz?`
        : `Interested in ${projectName || "this project"}?`,
    contactText:
      lang === "tr"
        ? "Is birlikleri, sponsorluklar veya proje detaylari icin bizimle iletisime gecin."
        : "Reach out for collaborations, sponsorships, or a deeper technical conversation about the build.",
    reachOut: lang === "tr" ? "Iletisime Gec" : "Reach Out",
    emailUs: lang === "tr" ? "E-Posta Gonder" : "Email Us",
    contactSection: lang === "tr" ? "Iletisim Bolumu ->" : "Contact Section ->",
    metaLabels: {
      status: lang === "tr" ? "Durum" : "Status",
      year: lang === "tr" ? "Yil" : "Year",
      purpose: lang === "tr" ? "Amac" : "Purpose",
    },
    statusLabels,
  };
}

export default function ProjectDetails() {
  const { slug } = useParams();
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const t = lang === "tr" ? tr : en;
  const { projects, loading } = useProjects();

  useEffect(() => {
    const userLang = navigator.language.startsWith("tr") ? "tr" : "en";
    setLang(userLang);
  }, []);

  const project = useMemo(() => {
    const matched = projects.find((item) => item.slug === slug);
    return matched ? normalizeProjectRecord(matched) : null;
  }, [projects, slug]);

  const sections = useMemo(
    () => parseSections(project?.sections),
    [project?.sections]
  );

  const galleryImages = useMemo(() => {
    const sectionImages = sections
      .filter((section) => section.type === "gallery")
      .flatMap((section) =>
        Array.isArray(section?.data?.images) ? section.data.images : []
      );

    return [...new Set([project?.image_url, ...sectionImages].filter(Boolean))];
  }, [project?.image_url, sections]);

  const specs = useMemo(() => {
    const specSection = sections.find((section) => section.type === "specs");
    return normalizeRows(specSection);
  }, [sections]);

  const materials = useMemo(() => {
    const materialSection = sections.find(
      (section) => section.type === "materials"
    );
    return normalizeRows(materialSection);
  }, [sections]);

  const textSections = useMemo(
    () => sections.filter((section) => section.type === "text"),
    [sections]
  );

  const videos = useMemo(
    () =>
      normalizeVideos(sections.filter((section) => section.type === "videos")),
    [sections]
  );

  const contactSection = useMemo(
    () => sections.find((section) => section.type === "contact"),
    [sections]
  );

  const copy = useMemo(
    () => getProjectDetailCopy(lang, project?.name),
    [lang, project?.name]
  );

  const dossierRows = useMemo(
    () => [
      {
        label: copy.metaLabels.status,
        value: project?.status
          ? copy.statusLabels[project.status] || project.status
          : "-",
      },
      {
        label: copy.metaLabels.year,
        value: project?.year || "-",
      },
      {
        label: copy.metaLabels.purpose,
        value: project?.purpose || "-",
      },
    ],
    [
      copy.metaLabels,
      copy.statusLabels,
      project?.purpose,
      project?.status,
      project?.year,
    ]
  );

  const contactTitle = contactSection?.data?.message || copy.contactTitle;
  const heroMedia = project?.hero_media;
  const heroAlt = heroMedia?.alt || project?.name || "Project hero";
  const heroPoster = heroMedia?.poster_url || project?.image_url || "";
  const heroImage = heroMedia?.url || project?.image_url || "";
  const hasHeroVideo = heroMedia?.type === "video" && Boolean(heroMedia?.url);
  const hasHeroImage = heroMedia?.type !== "video" && Boolean(heroImage);

  if (loading) {
    return (
      <>
        <Header t={t} lang={lang} setLang={setLang} />
        <main className={styles.pageMain}>
          <p className={styles.loading}>{copy.loading}</p>
        </main>
        <Footer t={t} />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Header t={t} lang={lang} setLang={setLang} />
        <main className={styles.pageMain}>
          <div className={styles.inner}>
            <button
              type="button"
              onClick={() => router.push("/projects")}
              className={styles.fallbackBackBtn}
            >
              {copy.back}
            </button>
            <p className={styles.loading}>{copy.notFound}</p>
          </div>
        </main>
        <Footer t={t} />
      </>
    );
  }

  return (
    <>
      <Header t={t} lang={lang} setLang={setLang} />
      <main className={styles.pageMain}>
        <section className={styles.pageSection}>
          <div className={styles.inner}>
            <section className={styles.heroCard}>
              <div className={styles.heroMediaShell}>
                {hasHeroVideo ? (
                  <video
                    className={styles.heroMedia}
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={heroPoster || undefined}
                  >
                    <source src={heroMedia.url} type="video/mp4" />
                  </video>
                ) : hasHeroImage ? (
                  <img
                    src={heroImage}
                    alt={heroAlt}
                    className={styles.heroMedia}
                  />
                ) : heroPoster ? (
                  <img
                    src={heroPoster}
                    alt={heroAlt}
                    className={styles.heroMedia}
                  />
                ) : (
                  <div className={styles.heroPlaceholder}>
                    {copy.heroPlaceholder}
                  </div>
                )}

                <div className={styles.heroScrim} />

                <div className={styles.heroTopbar}>
                  <button
                    type="button"
                    onClick={() => router.push("/projects")}
                    className={styles.heroBackBtn}
                  >
                    {copy.back}
                  </button>
                  <div className={styles.heroEyebrow}>{copy.heroEyebrow}</div>
                </div>

                <div className={styles.heroOverlay}>
                  <div className={styles.heroIntro}>
                    <div className={styles.dossierTag}>{copy.dossier}</div>
                    <h1 className={styles.title}>{project.name}</h1>
                    <p className={styles.summary}>
                      {project.summary ||
                        t.vespasian?.subtitle ||
                        "A modular UAV platform built for testing, iteration, and field performance."}
                    </p>
                  </div>

                  <div className={styles.dossierPanel}>
                    {dossierRows.map((row) => (
                      <div key={row.label} className={styles.dossierRow}>
                        <span className={styles.dossierLabel}>{row.label}</span>
                        <strong className={styles.dossierValue}>
                          {row.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.heroActions}>
                <a
                  href={`mailto:${contactSection?.data?.email || "empaerial.uav@gmail.com"}`}
                  className={styles.primaryBtn}
                >
                  {copy.emailUs}
                </a>
                <a
                  href={contactSection?.data?.link || "#project-contact"}
                  className={styles.secondaryBtn}
                >
                  {copy.reachOut}
                </a>
              </div>
            </section>

            {galleryImages.length > 1 && (
              <section className={styles.blockCard}>
                <div className={styles.blockHeader}>
                  <h2 className={styles.blockTitle}>{copy.gallery}</h2>
                </div>
                <div className={styles.galleryGrid}>
                  {galleryImages.map((src, index) => (
                    <img
                      key={`${src}-${index}`}
                      src={src}
                      alt={`${project.name} view ${index + 1}`}
                      className={styles.galleryImage}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className={styles.dualGrid}>
              <div className={styles.blockCard}>
                <div className={styles.blockHeader}>
                  <h2 className={styles.blockTitle}>
                    {t.vespasian?.specifications || "Specifications"}
                  </h2>
                </div>
                {specs.length > 0 ? (
                  <div className={styles.dataGrid}>
                    {specs.map((spec, index) => (
                      <div
                        key={`${spec.key}-${index}-full`}
                        className={styles.dataRow}
                      >
                        <span className={styles.dataKey}>{spec.key}</span>
                        <span className={styles.dataValue}>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyText}>{copy.specEmpty}</p>
                )}
              </div>

              {materials.length > 0 && (
                <div className={styles.blockCard}>
                  <div className={styles.blockHeader}>
                    <h2 className={styles.blockTitle}>
                      {t.vespasian?.materials || "Materials"}
                    </h2>
                  </div>
                  <div className={styles.dataGrid}>
                    {materials.map((item, index) => (
                      <div
                        key={`${item.key}-${index}-material`}
                        className={styles.dataRow}
                      >
                        <span className={styles.dataKey}>{item.key}</span>
                        <span className={styles.dataValue}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {textSections.map((section, index) => (
              <section key={`text-${index}`} className={styles.blockCard}>
                <div className={styles.blockHeader}>
                  <h2 className={styles.blockTitle}>
                    {section?.data?.heading || "About the Project"}
                  </h2>
                </div>
                <p className={styles.bodyText}>
                  {section?.data?.content || copy.detailFallback}
                </p>
              </section>
            ))}

            {videos.length > 0 && (
              <section className={styles.blockCard}>
                <div className={styles.blockHeader}>
                  <h2 className={styles.blockTitle}>{copy.videos}</h2>
                </div>
                <div className={styles.videoGrid}>
                  {videos.map((video) => {
                    const isYouTube =
                      video.url.includes("youtube") ||
                      video.url.includes("youtu.be");

                    return (
                      <div key={video.id} className={styles.videoCard}>
                        {isYouTube ? (
                          <iframe
                            className={styles.videoFrame}
                            src={getYouTubeEmbedUrl(video.url)}
                            title={video.title || project.name}
                            allowFullScreen
                          />
                        ) : (
                          <video className={styles.videoFrame} controls>
                            <source src={video.url} type="video/mp4" />
                          </video>
                        )}
                        {video.title ? (
                          <div className={styles.videoCaption}>
                            {video.title}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section
              id="project-contact"
              className={`${styles.blockCard} ${styles.contactCard}`}
            >
              <div className={styles.blockHeader}>
                <h2 className={styles.blockTitle}>{contactTitle}</h2>
              </div>
              <p className={styles.bodyText}>{copy.contactText}</p>
              <div className={styles.contactActions}>
                <a
                  href={`mailto:${contactSection?.data?.email || "empaerial.uav@gmail.com"}`}
                  className={styles.primaryBtn}
                >
                  {copy.emailUs}
                </a>
                <a
                  href={contactSection?.data?.link || "/#contact"}
                  className={styles.secondaryBtn}
                >
                  {copy.contactSection}
                </a>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer t={t} />
    </>
  );
}
