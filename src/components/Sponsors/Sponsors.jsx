'use client';

import React from "react";
import styles from "./Sponsors.module.css";

export default function Sponsors({ t }) {
  const goldSponsors = [
    {
      src: "/images/batu.png",
      name: "Batu Elektrik",
      link: "https://batuelektroteknik.com.tr/",
    },
    {
      src: "/images/kocaeli.png",
      name: "Kocaeli Büyükşehir Belediyesi",
      link: "https://www.kocaeli.bel.tr/",
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
    <section
      className={styles.sponsorsSection}
      aria-labelledby="sponsors-title"
    >
      <h2 id="sponsors-title" className={styles.title}>
        {t.sponsors_title}
      </h2>

      {}
      <div className={styles.goldSection} aria-label="Gold Sponsors">
        {goldSponsors.map((s, i) => (
          <a
            key={i}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${s.name} website`}
            className={styles.goldLogo}
          >
            <img
              src={s.src}
              alt={`${s.name} company logo`}
              loading="lazy"
            />
          </a>
        ))}
      </div>

      {}
      <div className={styles.silverSection} aria-label="Silver Sponsors">
        <div className={styles.silverTrack}>
          {silverSponsors.concat(silverSponsors).map((s, i) => (
            <div key={i} className={styles.silverLogo}>
              <img
                src={s.src}
                alt={`${s.name} company logo`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {}
      <div className={styles.bronzeSection} aria-label="Bronze Sponsors">
        <div className={styles.bronzeTrack}>
          {bronzeSponsors.concat(bronzeSponsors).map((s, i) => (
            <div key={i} className={styles.bronzeLogo}>
              <img
                src={s.src}
                alt={`${s.name} company logo`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
