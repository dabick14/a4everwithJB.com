import Image from "next/image";
import Countdown from "@/components/Countdown";
import GuestForm from "@/components/GuestForm";
import RevealRoot from "@/components/RevealRoot";
import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import styles from "@/components/GuestForm.module.css";

export default function Home() {
  return (
    <RevealRoot>
      {/*
        Demo usage of the reusable <EnvelopeIntro> component (see
        components/EnvelopeIntro/README.md for the full prop reference).
        Colours below are pulled straight from this site's palette
        (app/globals.css :root) so the intro and the page underneath
        feel like one piece.
      */}
      <EnvelopeIntro
        names={["Jeremy", "Afriyie"]}
        tagline="are getting married"
        couplePalette={{
          envelope: "#4A2E17",
          envelopeShadow: "#20110A",
          card: "#F7F1E4",
          ink: "#3A2414",
          accent: "#E0BE55",
          ribbon: "#C6A253",
          wax: "#C6A253",
        }}
        envelopeTexture="/images/envelope-texture.jpeg"
        artwork={
          // seal-gold.webp already has "J & A" embossed correctly into the
          // wax, so no code-drawn monogram overlay is needed here. If a
          // future asset regen changes the design, re-check the baked-in
          // letters before reusing this as-is.
          <Image
            src="/images/seal-gold.webp"
            alt="J & A wax seal"
            fill
            priority
            sizes="(min-width: 768px) 150px, 29vw"
            style={{ objectFit: "contain" }}
          />
        }
      />

      <div className="bg-photo" aria-hidden="true" />
      <div className="scrim" aria-hidden="true" />

      <div className="screen">
        <main className="composition">
          <p className="domain-label reveal">#a4everwithJB</p>

          <h1 className="headline reveal">2nd January 2027</h1>

          <p className="hashtags reveal">
            #JBGetsAnA <span className="sep">&middot;</span> #ABaidenInHisTime
          </p>

          <p className="names reveal">
            Jeremy <span className="amp">&amp;</span> Afriyie
          </p>

          <p className="tagline reveal">are getting married</p>

          <p className="venue reveal">Anagkazo Campus, Mampong</p>

          <div className="divider reveal" aria-hidden="true" />

          <Countdown />
        </main>

        <footer className="site-footer">
          <p>
            Built with &hearts; by{" "}
            <a href="https://cfweddings.live" target="_blank" rel="noopener">
              CF Weddings
            </a>{" "}
            &middot;{" "}
            <a href="https://instagram.com/cfweddingslive" target="_blank" rel="noopener">
              @cfweddingslive
            </a>
          </p>
        </footer>
      </div>

      <section className={`${styles.section} reveal`}>
        <div className={styles.divider} aria-hidden="true" />
        <p className={styles.eyebrow}>Join the Celebration</p>
        <h2 className={styles.heading}>Save Your Spot</h2>
        <p className={styles.subtext}>
          Share a few details and we&rsquo;ll be sure to welcome you when the day comes.
        </p>
        <GuestForm />
      </section>
    </RevealRoot>
  );
}
