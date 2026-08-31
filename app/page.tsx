import Countdown from "@/components/Countdown";
import GuestForm from "@/components/GuestForm";
import RevealRoot from "@/components/RevealRoot";
import styles from "@/components/GuestForm.module.css";

export default function Home() {
  return (
    <RevealRoot>
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

          <a href="#rsvp" className="rsvp-cta reveal">
            RSVP
            <span className="rsvp-chevron" aria-hidden="true">
              &darr;
            </span>
          </a>
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

      <section id="rsvp" className={`${styles.section} reveal`}>
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
