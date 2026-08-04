'use client';

import React from "react";
import WingCut from "@/components/WingCut/WingCut";
import styles from "./Sponsors.module.css";

export default function Sponsors({ t }) {
  const goldSponsors = [
    {
      src: "/images/batu.png",
      name: "Batu Elektrik",
      link: "https://batuelektroteknik.com.tr/",
    },
    {
      src: "/images/kilavuz.png",
      name: "KILAVUZ TEKNOLOJİ MERKEZİ",
      link: "https://kilavuzgenclik.kocaeli.bel.tr/TeknolojiMerkezi",
    },
  ];

  const silverSponsors = [
    { src: "/images/silver1.png", name: "Silver Sponsor 1", link: "#" },
    { src: "/images/silver2.png", name: "Silver Sponsor 2", link: "#" },
    { src: "/images/silver3.png", name: "Silver Sponsor 3", link: "#" },
  ];

  const bronzeSponsors = [
    { src: "/images/bronze1.png", name: "Bronze Sponsor 1", link: "#" },
    { src: "/images/bronze2.png", name: "Bronze Sponsor 2", link: "#" },
    { src: "/images/bronze3.png", name: "Bronze Sponsor 3", link: "#" },
  ];

  return (
    <section className={styles.sponsorsSection} id="sponsors" aria-labelledby="sponsors-title">
      <div className={styles.inner}>
        <div className={`${styles.header} reveal`}>
          <div className={styles.eyebrow}>{t.sponsors_eyebrow || "SPONSORS"}</div>
          <h2 id="sponsors-title" className={styles.title}>
            {t.sponsors_title}
          </h2>
        </div>

        <div className={`${styles.sponsorsTier} reveal`}>
          <div className={styles.tierLabel}>GOLD</div>
          <div className={styles.goldWrap}>
            <a
              href="https://batuelektroteknik.com.tr/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Batu Elektrik website"
              className={styles.goldLink}
            >
              <img src="/images/batu.png" alt="Batu Elektrik" loading="lazy" />
            </a>
          </div>
        </div>

        <div className={`${styles.sponsorsTier} reveal`}>
          <div className={styles.tierLabel}>SILVER</div>
          <div className={styles.placeholderRow}>
            {placeholders.map((item) => (
              <div className={styles.sponsorPlaceholder} key={`silver-${item}`}>
                <span>OPEN</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.sponsorsTier} reveal`}>
          <div className={styles.tierLabel}>BRONZE</div>
          <div className={styles.placeholderRow}>
            {placeholders.map((item) => (
              <div className={styles.sponsorPlaceholder} key={`bronze-${item}`}>
                <span>OPEN</span>
              </div>
            ))}
          </div>
        </div>

        <p className={`${styles.sponsorsNote} reveal`}>
          {t.sponsors_note_prefix || "Interested in supporting EMPÆRIAL?"}{" "}
          <a href={`mailto:${t.contact_email || "empaerial.uav@gmail.com"}`}>
            {t.sponsors_note_link || "Contact us →"}
          </a>
        </p>
      </div>

      <WingCut fill="#000" style={{ marginTop: 80 }} />
    </section>
  );
}
